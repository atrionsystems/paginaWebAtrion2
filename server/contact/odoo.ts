import { buildOpportunityDescription, type ContactData, formatContactName } from './contact-data';

const DEFAULT_TIMEOUT_MS = 8_000;

export type OdooErrorKind = 'authentication' | 'configuration' | 'network' | 'timeout' | 'upstream';

export class OdooIntegrationError extends Error {
  constructor(
    public readonly kind: OdooErrorKind,
    message: string,
    public readonly upstreamStatus?: number,
  ) {
    super(message);
    this.name = 'OdooIntegrationError';
  }
}

interface OdooConfig {
  apiKey: string;
  database?: string;
  endpoint: string;
  teamId?: number;
  userId?: number;
}

export interface OdooCreateOptions {
  env?: NodeJS.ProcessEnv;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}

export interface OdooCreateResult {
  response: unknown;
}

function optionalPositiveInteger(
  value: string | undefined,
  variableName: string,
): number | undefined {
  if (!value?.trim()) return undefined;

  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    throw new OdooIntegrationError(
      'configuration',
      `${variableName} debe ser un entero positivo cuando está configurada.`,
    );
  }
  return parsed;
}

function loadConfig(env: NodeJS.ProcessEnv): OdooConfig {
  const rawUrl = env['ODOO_URL']?.trim();
  const apiKey = env['ODOO_API_KEY']?.trim();

  if (!rawUrl || !apiKey) {
    throw new OdooIntegrationError(
      'configuration',
      'Faltan ODOO_URL u ODOO_API_KEY en el entorno del servidor.',
    );
  }

  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new OdooIntegrationError('configuration', 'ODOO_URL no es una URL válida.');
  }

  const isLocal = ['localhost', '127.0.0.1', '::1'].includes(url.hostname);
  if (url.protocol !== 'https:' && !(isLocal && url.protocol === 'http:')) {
    throw new OdooIntegrationError(
      'configuration',
      'ODOO_URL debe usar HTTPS (HTTP solo se permite para mocks locales).',
    );
  }

  if (url.search || url.hash) {
    throw new OdooIntegrationError('configuration', 'ODOO_URL no debe incluir query ni fragmento.');
  }

  const baseUrl = url.toString().replace(/\/+$/u, '');

  return {
    apiKey,
    database: env['ODOO_DATABASE']?.trim() || undefined,
    endpoint: `${baseUrl}/json/2/crm.lead/create`,
    teamId: optionalPositiveInteger(env['ODOO_CRM_TEAM_ID'], 'ODOO_CRM_TEAM_ID'),
    userId: optionalPositiveInteger(env['ODOO_CRM_USER_ID'], 'ODOO_CRM_USER_ID'),
  };
}

function parseJsonSafely(text: string): unknown {
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

function summarizeOdooError(body: unknown): string {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return 'sin detalle JSON';

  const error = body as Record<string, unknown>;
  const name = typeof error['name'] === 'string' ? error['name'] : 'error desconocido';
  const message = typeof error['message'] === 'string' ? error['message'] : '';
  return `${name}${message ? `: ${message.slice(0, 300)}` : ''}`;
}

export async function createOdooOpportunity(
  data: ContactData,
  options: OdooCreateOptions = {},
): Promise<OdooCreateResult> {
  const env = options.env ?? process.env;
  const fetchImpl = options.fetchImpl ?? fetch;
  const config = loadConfig(env);
  const contactName = formatContactName(data);
  const leadValues: Record<string, string | number> = {
    name: `Página web Atrion - ${data.company || contactName}`,
    contact_name: contactName,
    email_from: data.email,
    description: buildOpportunityDescription(data),
    type: 'opportunity',
  };

  if (data.company) leadValues['partner_name'] = data.company;
  if (data.phone) leadValues['phone'] = data.phone;
  if (config.teamId) leadValues['team_id'] = config.teamId;
  if (config.userId) leadValues['user_id'] = config.userId;

  const headers: Record<string, string> = {
    Authorization: `bearer ${config.apiKey}`,
    'Content-Type': 'application/json; charset=utf-8',
    'User-Agent': 'AtrionSystemsWebsite/1.0',
  };
  if (config.database) headers['X-Odoo-Database'] = config.database;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetchImpl(config.endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ vals_list: [leadValues] }),
      signal: controller.signal,
    });
    const responseText = await response.text();
    const responseBody = parseJsonSafely(responseText);

    if (!response.ok) {
      const kind: OdooErrorKind =
        response.status === 401 || response.status === 403 ? 'authentication' : 'upstream';
      throw new OdooIntegrationError(
        kind,
        `Odoo respondió ${response.status}: ${summarizeOdooError(responseBody)}`,
        response.status,
      );
    }

    return { response: responseBody };
  } catch (error) {
    if (error instanceof OdooIntegrationError) throw error;
    if (controller.signal.aborted) {
      throw new OdooIntegrationError('timeout', 'La solicitud a Odoo agotó el tiempo de espera.');
    }
    throw new OdooIntegrationError(
      'network',
      error instanceof Error
        ? `No fue posible conectar con Odoo: ${error.message}`
        : 'No fue posible conectar con Odoo.',
    );
  } finally {
    clearTimeout(timeout);
  }
}
