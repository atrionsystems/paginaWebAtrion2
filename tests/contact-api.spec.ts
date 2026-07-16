import type { VercelRequest, VercelResponse } from '@vercel/node';
import { describe, expect, it, vi } from 'vitest';
import { createContactHandler } from '../api/contact';
import { OdooIntegrationError } from '../server/contact/odoo';

const validBody = {
  reason: 'Software a la medida',
  firstName: 'Daniel',
  lastName: 'Ríos',
  email: 'daniel@example.com',
  phone: '',
  company: '',
  position: '',
  location: '',
  city: '',
  message: 'Quiero revisar un proyecto.',
  website: '',
};

function mockRequest(body: unknown, origin = 'https://atrion.systems'): VercelRequest {
  return {
    method: 'POST',
    body,
    headers: {
      host: 'atrion.systems',
      origin,
      'content-type': 'application/json',
    },
  } as VercelRequest;
}

function mockRequestWithContentType(body: unknown, contentType: string): VercelRequest {
  const request = mockRequest(body);
  request.headers['content-type'] = contentType;
  return request;
}

function mockResponse(): {
  response: VercelResponse;
  result: {
    status?: number;
    body?: unknown;
    headers: Record<string, string | number | readonly string[]>;
  };
} {
  const result: {
    status?: number;
    body?: unknown;
    headers: Record<string, string | number | readonly string[]>;
  } = { headers: {} };
  const response = {
    setHeader(name: string, value: string | number | readonly string[]) {
      result.headers[name] = value;
      return this;
    },
    status(code: number) {
      result.status = code;
      return this;
    },
    json(body: unknown) {
      result.body = body;
      return this;
    },
  } as unknown as VercelResponse;

  return { response, result };
}

describe('POST /api/contact', () => {
  it('valida y crea la oportunidad antes de responder 201', async () => {
    const createOpportunity = vi.fn(async () => ({ response: [99] }));
    const sendEmails = vi.fn(async () => false);
    const handler = createContactHandler({ createOpportunity, sendEmails });
    const { response, result } = mockResponse();

    await handler(mockRequest(validBody), response);

    expect(result).toMatchObject({ status: 201, body: { ok: true } });
    expect(createOpportunity).toHaveBeenCalledOnce();
    expect(sendEmails).toHaveBeenCalledOnce();
  });

  it('rechaza datos inválidos sin llamar a Odoo', async () => {
    const createOpportunity = vi.fn(async () => ({ response: [99] }));
    const handler = createContactHandler({ createOpportunity, sendEmails: async () => false });
    const { response, result } = mockResponse();

    await handler(mockRequest({ ...validBody, email: 'mal' }), response);

    expect(result.status).toBe(400);
    expect(createOpportunity).not.toHaveBeenCalled();
  });

  it('rechaza origen cruzado', async () => {
    const createOpportunity = vi.fn(async () => ({ response: [99] }));
    const handler = createContactHandler({ createOpportunity, sendEmails: async () => false });
    const { response, result } = mockResponse();

    await handler(mockRequest(validBody, 'https://spam.example'), response);

    expect(result.status).toBe(403);
    expect(createOpportunity).not.toHaveBeenCalled();
  });

  it('exige solicitudes JSON', async () => {
    const createOpportunity = vi.fn(async () => ({ response: [99] }));
    const handler = createContactHandler({ createOpportunity, sendEmails: async () => false });
    const { response, result } = mockResponse();

    await handler(mockRequestWithContentType(validBody, 'text/plain'), response);

    expect(result.status).toBe(415);
    expect(createOpportunity).not.toHaveBeenCalled();
  });

  it('devuelve un error seguro cuando Odoo agota el timeout', async () => {
    const handler = createContactHandler({
      createOpportunity: async () => {
        throw new OdooIntegrationError('timeout', 'detalle interno de red');
      },
      sendEmails: async () => false,
    });
    const { response, result } = mockResponse();

    await handler(mockRequest(validBody), response);

    expect(result.status).toBe(504);
    expect(result.body).toEqual({
      ok: false,
      error: 'No pudimos enviar tu solicitud en este momento. Inténtalo nuevamente.',
    });
    expect(JSON.stringify(result.body)).not.toContain('detalle interno');
  });
});
