import { describe, expect, it } from 'vitest';
import { validateContactPayload } from '../server/contact/contact-data';
import { createOdooOpportunity } from '../server/contact/odoo';

describe('integración real con Odoo', () => {
  it('crea una oportunidad identificable en crm.lead', async () => {
    const timestamp = new Date().toISOString();
    const company = `PRUEBA TÉCNICA ATRION - eliminar - ${timestamp}`;
    const contact = validateContactPayload({
      reason: 'Software a la medida',
      firstName: 'Validación',
      lastName: 'Automática',
      email: 'atrionsystems@gmail.com',
      phone: '',
      company,
      position: '',
      location: 'Colombia',
      city: 'Manizales',
      message: `Prueba en vivo de la integración JSON-2 ejecutada el ${timestamp}. Este registro puede eliminarse.`,
      website: '',
    });

    const result = await createOdooOpportunity(contact);

    expect(result.response).not.toBeUndefined();
    console.info(`Oportunidad de prueba creada: Página web Atrion - ${company}`);
    console.info(`Respuesta JSON-2: ${JSON.stringify(result.response)}`);
  });
});
