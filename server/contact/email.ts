import nodemailer from 'nodemailer';
import { escapeHtml, formatContactName, type ContactData } from './contact-data';

export async function sendContactEmails(
  data: ContactData,
  env: NodeJS.ProcessEnv = process.env,
): Promise<boolean> {
  const user = env['GMAIL_USER']?.trim();
  const password = env['GMAIL_APP_PASSWORD']?.trim();

  if (!user || !password) return false;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass: password },
  });
  const contactName = formatContactName(data);
  const safe = (value: string, fallback = 'No especifica') => escapeHtml(value || fallback);
  const location = [data.location, data.city].filter(Boolean).join(', ');
  const reason = data.reason || 'Solicitud de información';
  const message = escapeHtml(data.message).replace(/\n/gu, '<br>');

  await transporter.sendMail({
    from: `"Atrion Web" <${user}>`,
    to: user,
    replyTo: data.email,
    subject: `Nueva solicitud — ${reason}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#4312f8">Nueva solicitud de contacto</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#666;width:140px">Servicio</td><td style="padding:8px 0;font-weight:600">${safe(reason)}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Nombre</td><td style="padding:8px 0">${safe(contactName)}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Correo</td><td style="padding:8px 0">${safe(data.email)}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Teléfono</td><td style="padding:8px 0">${safe(data.phone)}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Empresa</td><td style="padding:8px 0">${safe(data.company)}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Cargo</td><td style="padding:8px 0">${safe(data.position)}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Ubicación</td><td style="padding:8px 0">${safe(location)}</td></tr>
        </table>
        <h3 style="color:#4312f8;margin-top:24px">Mensaje</h3>
        <p style="background:#f5f5f5;padding:16px;border-radius:8px;line-height:1.7">${message}</p>
      </div>
    `,
  });

  await transporter.sendMail({
    from: `"Atrion Systems" <${user}>`,
    to: data.email,
    subject: 'Recibimos tu solicitud — Atrion Systems',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#4312f8">¡Hola, ${safe(data.firstName)}!</h2>
        <p style="color:#333;line-height:1.7">
          Recibimos tu solicitud sobre <strong>${safe(reason)}</strong>. Nuestro equipo la revisará
          y se pondrá en contacto contigo pronto.
        </p>
        <p style="color:#888;margin-top:32px;font-size:0.9rem">
          Atentamente,<br><strong>Equipo Atrion Systems</strong>
        </p>
      </div>
    `,
  });

  return true;
}
