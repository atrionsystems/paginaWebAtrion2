import { describe, expect, it, vi } from 'vitest';
import { validateContactPayload } from '../server/contact/contact-data';
import { createOdooOpportunity, OdooIntegrationError } from '../server/contact/odoo';

const contact = validateContactPayload({
  reason: 'Páginas web',
  firstName: 'Laura',
  lastName: 'Mejía',
  email: 'laura@example.com',
  phone: '+57 310 000 0000',
  company: 'Empresa Demo',
  position: 'Gerente',
  location: 'Colombia',
  city: 'Manizales',
  message: 'Necesitamos una nueva plataforma.',
  website: '',
});

const baseEnv = {
  ODOO_URL: 'https://atrion-test.odoo.com',
  ODOO_DATABASE: 'atrion-test',
  ODOO_API_KEY: 'test-key-only',
  ODOO_CRM_TEAM_ID: '',
  ODOO_CRM_USER_ID: '',
};

describe('createOdooOpportunity', () => {
  it('usa JSON-2, vals_list y los encabezados privados esperados', async () => {
    const fetchMock = vi.fn(
      async () =>
        new Response(JSON.stringify([321]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
    );

    await createOdooOpportunity(contact, {
      env: { ...baseEnv, ODOO_CRM_TEAM_ID: '7', ODOO_CRM_USER_ID: '11' },
      fetchImpl: fetchMock as typeof fetch,
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, request] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    const headers = request.headers as Record<string, string>;
    const body = JSON.parse(String(request.body)) as {
      vals_list: Array<Record<string, unknown>>;
    };

    expect(url).toBe('https://atrion-test.odoo.com/json/2/crm.lead/create');
    expect(headers.Authorization).toBe('bearer test-key-only');
    expect(headers['X-Odoo-Database']).toBe('atrion-test');
    expect(body.vals_list).toHaveLength(1);
    expect(body.vals_list[0]).toMatchObject({
      name: 'Página web Atrion - Empresa Demo',
      contact_name: 'Laura Mejía',
      partner_name: 'Empresa Demo',
      email_from: 'laura@example.com',
      phone: '+57 310 000 0000',
      type: 'opportunity',
      team_id: 7,
      user_id: 11,
    });
  });

  it('omite base, equipo y responsable cuando no están configurados', async () => {
    const fetchMock = vi.fn(async (_url: string | URL | Request, request?: RequestInit) => {
      const headers = request?.headers as Record<string, string>;
      const body = JSON.parse(String(request?.body)) as {
        vals_list: Array<Record<string, unknown>>;
      };
      expect(headers['X-Odoo-Database']).toBeUndefined();
      expect(body.vals_list[0]['team_id']).toBeUndefined();
      expect(body.vals_list[0]['user_id']).toBeUndefined();
      return new Response('not-json-but-successful', { status: 200 });
    });

    await expect(
      createOdooOpportunity(contact, {
        env: { ...baseEnv, ODOO_DATABASE: '' },
        fetchImpl: fetchMock as typeof fetch,
      }),
    ).resolves.toEqual({ response: null });
  });

  it('clasifica errores de autenticación sin exponer la clave', async () => {
    const fetchMock = vi.fn(
      async () =>
        new Response(JSON.stringify({ name: 'Unauthorized', message: 'Invalid apikey' }), {
          status: 401,
        }),
    );

    await expect(
      createOdooOpportunity(contact, {
        env: baseEnv,
        fetchImpl: fetchMock as typeof fetch,
      }),
    ).rejects.toMatchObject({ kind: 'authentication', upstreamStatus: 401 });
  });

  it('aborta y clasifica una instancia que no responde', async () => {
    const neverResponds = vi.fn(
      async (_url: string | URL | Request, request?: RequestInit): Promise<Response> =>
        new Promise((_resolve, reject) => {
          request?.signal?.addEventListener('abort', () => reject(new Error('aborted')));
        }),
    );

    await expect(
      createOdooOpportunity(contact, {
        env: baseEnv,
        fetchImpl: neverResponds as typeof fetch,
        timeoutMs: 10,
      }),
    ).rejects.toEqual(expect.objectContaining<OdooIntegrationError>({ kind: 'timeout' }));
  });
});
