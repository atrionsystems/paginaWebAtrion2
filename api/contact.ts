import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { reason, firstName, lastName, email, phone, company, position, location, city, message } = req.body;

  if (!reason || !firstName || !lastName || !email || !phone || !location || !message) {
    return res.status(400).json({ error: 'Campos requeridos incompletos' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env['GMAIL_USER'],
      pass: process.env['GMAIL_APP_PASSWORD']
    }
  });

  // Correo interno a Atrion Systems con todos los datos
  await transporter.sendMail({
    from: `"Atrion Web" <${process.env['GMAIL_USER']}>`,
    to: process.env['GMAIL_USER'],
    replyTo: email,
    subject: `Nueva solicitud — ${reason}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#4312f8">Nueva solicitud de contacto</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#666;width:140px">Motivo</td><td style="padding:8px 0;font-weight:600">${reason}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Nombre</td><td style="padding:8px 0">${firstName} ${lastName}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Correo</td><td style="padding:8px 0"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:8px 0;color:#666">Teléfono</td><td style="padding:8px 0">${phone}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Empresa</td><td style="padding:8px 0">${company || 'No especifica'}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Cargo</td><td style="padding:8px 0">${position || 'No especifica'}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Ubicación</td><td style="padding:8px 0">${location}${city ? `, ${city}` : ''}</td></tr>
        </table>
        <h3 style="color:#4312f8;margin-top:24px">Mensaje</h3>
        <p style="background:#f5f5f5;padding:16px;border-radius:8px;line-height:1.7">${message.replace(/\n/g, '<br>')}</p>
      </div>
    `
  });

  // Correo de confirmación al cliente
  await transporter.sendMail({
    from: `"Atrion Systems" <${process.env['GMAIL_USER']}>`,
    to: email,
    subject: 'Recibimos tu solicitud — Atrion Systems',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#4312f8">¡Hola, ${firstName}!</h2>
        <p style="color:#333;line-height:1.7">
          Recibimos tu solicitud sobre <strong>${reason}</strong>. Nuestro equipo la revisará
          y te contactará a la brevedad con una respuesta.
        </p>
        <p style="color:#333;line-height:1.7">
          Si tienes alguna pregunta adicional puedes escribirnos directamente a
          <a href="mailto:atrionsystems@gmail.com" style="color:#4312f8">atrionsystems@gmail.com</a>.
        </p>
        <p style="color:#888;margin-top:32px;font-size:0.9rem">
          Atentamente,<br/>
          <strong>Equipo Atrion Systems</strong>
        </p>
      </div>
    `
  });

  return res.status(200).json({ ok: true });
}
