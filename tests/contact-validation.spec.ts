import { describe, expect, it } from 'vitest';
import {
  buildOpportunityDescription,
  ContactValidationError,
  validateContactPayload,
} from '../server/contact/contact-data';

const validPayload = {
  reason: 'Software empresarial',
  firstName: '  Ana  ',
  lastName: '  Gómez ',
  email: ' ANA@EXAMPLE.COM ',
  phone: '+57 300 123 4567',
  company: ' Atrion Cliente ',
  position: '',
  location: 'Colombia',
  city: 'Manizales',
  message: ' Necesito integrar\r\nmi CRM. ',
  website: '',
};

describe('validateContactPayload', () => {
  it('normaliza una solicitud válida y conserva los campos opcionales', () => {
    const result = validateContactPayload(validPayload);

    expect(result).toMatchObject({
      firstName: 'Ana',
      lastName: 'Gómez',
      email: 'ana@example.com',
      company: 'Atrion Cliente',
      message: 'Necesito integrar\nmi CRM.',
    });
  });

  it('rechaza correo inválido y teléfono inválido', () => {
    expect(() => validateContactPayload({ ...validPayload, email: 'incorrecto' })).toThrow(
      ContactValidationError,
    );
    expect(() => validateContactPayload({ ...validPayload, phone: '12-34' })).toThrow(
      ContactValidationError,
    );
  });

  it('acepta teléfono y servicio vacíos porque son opcionales', () => {
    const result = validateContactPayload({ ...validPayload, phone: '', reason: '' });
    expect(result.phone).toBe('');
    expect(result.reason).toBe('');
  });

  it('rechaza servicios fuera de la lista y el honeypot diligenciado', () => {
    expect(() => validateContactPayload({ ...validPayload, reason: 'Servicio inventado' })).toThrow(
      ContactValidationError,
    );
    expect(() => validateContactPayload({ ...validPayload, website: 'https://spam.test' })).toThrow(
      ContactValidationError,
    );
  });

  it('escapa HTML del usuario en la descripción de Odoo y omite vacíos', () => {
    const data = validateContactPayload({
      ...validPayload,
      company: '',
      phone: '',
      message: '<script>alert(1)</script>',
    });
    const description = buildOpportunityDescription(data);

    expect(description).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(description).not.toContain('Empresa:');
    expect(description).not.toContain('Teléfono:');
    expect(description).not.toContain('undefined');
  });
});
