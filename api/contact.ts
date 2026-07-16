import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  ContactValidationError,
  type ContactData,
  validateContactPayload,
} from '../server/contact/contact-data';
import { sendContactEmails } from '../server/contact/email';
import {
  createOdooOpportunity,
  OdooIntegrationError,
  type OdooCreateResult,
} from '../server/contact/odoo';

const MAX_REQUEST_BYTES = 25_000;

type CreateOpportunity = (data: ContactData) => Promise<OdooCreateResult>;
type SendEmails = (data: ContactData) => Promise<boolean>;

export interface ContactHandlerDependencies {
  createOpportunity: CreateOpportunity;
  sendEmails: SendEmails;
}

function firstHeader(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function requestOriginIsAllowed(req: VercelRequest): boolean {
  const origin = firstHeader(req.headers.origin);
  if (!origin) return true;

  const forwardedHost = firstHeader(req.headers['x-forwarded-host']);
  const host = (forwardedHost ?? firstHeader(req.headers.host))?.split(',')[0]?.trim();
  if (!host) return false;

  try {
    return new URL(origin).host.toLowerCase() === host.toLowerCase();
  } catch {
    return false;
  }
}

function setSecurityHeaders(res: VercelResponse): void {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
}

export function createContactHandler(
  dependencies: Partial<ContactHandlerDependencies> = {},
): (req: VercelRequest, res: VercelResponse) => Promise<VercelResponse | void> {
  const createOpportunity =
    dependencies.createOpportunity ?? ((data) => createOdooOpportunity(data));
  const sendEmails = dependencies.sendEmails ?? ((data) => sendContactEmails(data));

  return async (req: VercelRequest, res: VercelResponse): Promise<VercelResponse | void> => {
    setSecurityHeaders(res);

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({
        ok: false,
        error: 'Método no permitido.',
      });
    }

    if (!requestOriginIsAllowed(req)) {
      return res.status(403).json({
        ok: false,
        error: 'Origen de solicitud no permitido.',
      });
    }

    const contentType = firstHeader(req.headers['content-type'])
      ?.split(';')[0]
      ?.trim()
      .toLowerCase();
    if (contentType !== 'application/json') {
      return res.status(415).json({
        ok: false,
        error: 'El contenido de la solicitud no es compatible.',
      });
    }

    const contentLength = Number(firstHeader(req.headers['content-length']) ?? 0);
    if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
      return res.status(413).json({
        ok: false,
        error: 'La solicitud es demasiado grande.',
      });
    }

    let contact: ContactData;
    try {
      contact = validateContactPayload(req.body);
    } catch (error) {
      if (error instanceof ContactValidationError) {
        return res.status(400).json({
          ok: false,
          error: 'Verifica los datos del formulario e inténtalo nuevamente.',
          field: error.field,
        });
      }
      console.error('[contact] Error inesperado al validar la solicitud.', error);
      return res.status(400).json({
        ok: false,
        error: 'La solicitud no es válida.',
      });
    }

    try {
      await createOpportunity(contact);
    } catch (error) {
      if (error instanceof OdooIntegrationError) {
        console.error(`[contact] Fallo de Odoo (${error.kind}).`, {
          status: error.upstreamStatus,
          message: error.message,
        });

        const status = error.kind === 'timeout' ? 504 : error.kind === 'configuration' ? 503 : 502;
        return res.status(status).json({
          ok: false,
          error: 'No pudimos enviar tu solicitud en este momento. Inténtalo nuevamente.',
        });
      }

      console.error('[contact] Error inesperado al crear la oportunidad.', error);
      return res.status(500).json({
        ok: false,
        error: 'No pudimos enviar tu solicitud en este momento. Inténtalo nuevamente.',
      });
    }

    try {
      await sendEmails(contact);
    } catch (error) {
      // Odoo ya confirmó y comprometió la oportunidad. El correo es secundario.
      console.error('[contact] Oportunidad creada, pero falló la notificación por correo.', error);
    }

    return res.status(201).json({ ok: true });
  };
}

export default createContactHandler();
