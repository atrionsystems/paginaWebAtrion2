export const CONTACT_REASONS = [
  'Chatbots y automatización IA',
  'Software empresarial',
  'Páginas web',
  'Software a la medida',
  'Otro',
] as const;

export interface ContactData {
  reason: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  location: string;
  city: string;
  message: string;
}

export class ContactValidationError extends Error {
  constructor(
    message: string,
    public readonly field?: keyof ContactData | 'website',
  ) {
    super(message);
    this.name = 'ContactValidationError';
  }
}

const FIELD_LIMITS: Record<keyof ContactData, number> = {
  reason: 80,
  firstName: 80,
  lastName: 80,
  email: 254,
  phone: 30,
  company: 120,
  position: 120,
  location: 100,
  city: 100,
  message: 4000,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u;
const PHONE_PATTERN = /^\+?[0-9\s().-]+$/u;

function readString(
  body: Record<string, unknown>,
  field: keyof ContactData | 'website',
  required = false,
): string {
  const value = body[field];

  if (value === undefined || value === null || value === '') {
    if (required) {
      throw new ContactValidationError('El campo es obligatorio.', field);
    }
    return '';
  }

  if (typeof value !== 'string') {
    throw new ContactValidationError('El campo debe ser texto.', field);
  }

  return value;
}

function normalizeSingleLine(value: string): string {
  return value
    .normalize('NFC')
    .replace(/[\u0000-\u001f\u007f-\u009f]/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim();
}

function normalizeMultiline(value: string): string {
  return value
    .normalize('NFC')
    .replace(/\r\n?/gu, '\n')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]/gu, '')
    .split('\n')
    .map((line) => line.replace(/[\t\f\v ]+/gu, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/gu, '\n\n')
    .trim();
}

function enforceLength(field: keyof ContactData, value: string): void {
  if (value.length > FIELD_LIMITS[field]) {
    throw new ContactValidationError(
      `El campo supera el máximo de ${FIELD_LIMITS[field]} caracteres.`,
      field,
    );
  }
}

function validatePhone(phone: string): void {
  if (!phone) return;

  const digits = phone.replace(/\D/gu, '');
  if (!PHONE_PATTERN.test(phone) || digits.length < 7 || digits.length > 15) {
    throw new ContactValidationError('El teléfono no tiene un formato válido.', 'phone');
  }
}

export function validateContactPayload(payload: unknown): ContactData {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new ContactValidationError('El cuerpo de la solicitud no es válido.');
  }

  const body = payload as Record<string, unknown>;
  const website = normalizeSingleLine(readString(body, 'website'));

  if (website) {
    throw new ContactValidationError('La solicitud fue rechazada.', 'website');
  }

  const data: ContactData = {
    reason: normalizeSingleLine(readString(body, 'reason')),
    firstName: normalizeSingleLine(readString(body, 'firstName', true)),
    lastName: normalizeSingleLine(readString(body, 'lastName')),
    email: normalizeSingleLine(readString(body, 'email', true)).toLowerCase(),
    phone: normalizeSingleLine(readString(body, 'phone')),
    company: normalizeSingleLine(readString(body, 'company')),
    position: normalizeSingleLine(readString(body, 'position')),
    location: normalizeSingleLine(readString(body, 'location')),
    city: normalizeSingleLine(readString(body, 'city')),
    message: normalizeMultiline(readString(body, 'message', true)),
  };

  for (const [field, value] of Object.entries(data) as [keyof ContactData, string][]) {
    enforceLength(field, value);
  }

  if (!data.firstName || !data.email || !data.message) {
    throw new ContactValidationError('Faltan campos obligatorios.');
  }

  if (!EMAIL_PATTERN.test(data.email)) {
    throw new ContactValidationError('El correo electrónico no tiene un formato válido.', 'email');
  }

  validatePhone(data.phone);

  if (data.reason && !CONTACT_REASONS.includes(data.reason as (typeof CONTACT_REASONS)[number])) {
    throw new ContactValidationError('El servicio seleccionado no es válido.', 'reason');
  }

  return data;
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/gu, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return entities[character];
  });
}

export function formatContactName(data: ContactData): string {
  return [data.firstName, data.lastName].filter(Boolean).join(' ');
}

export function buildOpportunityDescription(data: ContactData): string {
  const rows: Array<[string, string]> = [
    ['Origen', 'Página web de Atrion Systems'],
    ['Servicio de interés', data.reason],
    ['Nombre', formatContactName(data)],
    ['Empresa', data.company],
    ['Correo', data.email],
    ['Teléfono', data.phone],
    ['Cargo', data.position],
    ['Ubicación', [data.location, data.city].filter(Boolean).join(', ')],
  ];

  const summary = rows
    .filter(([, value]) => Boolean(value))
    .map(([label, value]) => `${escapeHtml(label)}: ${escapeHtml(value)}`)
    .join('<br>');
  const message = escapeHtml(data.message).replace(/\n/gu, '<br>');

  return `<p>${summary}</p><p><strong>Mensaje:</strong><br>${message}</p>`;
}
