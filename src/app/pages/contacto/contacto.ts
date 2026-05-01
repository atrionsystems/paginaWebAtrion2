/* =========================================================
  IMPORTACIONES
========================================================= */
import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';

/* =========================================================
  CONFIGURACIÓN DEL COMPONENTE
========================================================= */
@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css'
})
export class ContactoComponent {

  /* =========================================================
    MODELO DEL FORMULARIO
  ========================================================= */
  form = {
    reason: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    location: '',
    city: '',
    message: ''
  };

  /* =========================================================
    OPCIONES DEL SELECT PERSONALIZADO
  ========================================================= */
  reasonOptions: string[] = [
    'Software a la medida',
    'Inteligencia artificial',
    'Automatización',
    'Analítica de datos',
    'Chatbots',
    'Licenciamiento',
    'Soporte o asesoría',
    'Otro'
  ];

  /* =========================================================
    ESTADO DEL SELECT PERSONALIZADO
  ========================================================= */
  isReasonOpen = false;

  toggleReasonDropdown(): void {
    this.isReasonOpen = !this.isReasonOpen;
  }

  selectReason(option: string): void {
    this.form.reason = option;
    this.isReasonOpen = false;
  }

  @HostListener('document:click')
  closeReasonDropdown(): void {
    this.isReasonOpen = false;
  }

  /* =========================================================
    ENVÍO DE SOLICITUD POR CORREO
  ========================================================= */
  sendRequest(): void {
    if (
      !this.form.reason ||
      !this.form.firstName ||
      !this.form.lastName ||
      !this.form.email ||
      !this.form.phone ||
      !this.form.location ||
      !this.form.message
    ) {
      return;
    }

    const businessEmail = 'atrionsystem@gmail.com';

    const subject = encodeURIComponent(
      `Nueva solicitud de contacto - ${this.form.reason}`
    );

    const body = encodeURIComponent(
      `Hola Atrion Systems,\n\n` +
      `Les comparto mi solicitud de contacto.\n\n` +
      `Motivo de la consulta: ${this.form.reason}\n` +
      `Nombre: ${this.form.firstName}\n` +
      `Apellido: ${this.form.lastName}\n` +
      `Correo electrónico: ${this.form.email}\n` +
      `Teléfono: ${this.form.phone}\n` +
      `Empresa: ${this.form.company || 'No especifica'}\n` +
      `Cargo: ${this.form.position || 'No especifica'}\n` +
      `Ubicación: ${this.form.location}\n` +
      `Ciudad: ${this.form.city || 'No especifica'}\n\n` +
      `Consulta o comentario:\n${this.form.message}\n\n` +
      `Por favor, contáctenme con esta información.`
    );

    window.location.href = `mailto:${businessEmail}?subject=${subject}&body=${body}`;
  }

  /* =========================================================
    CORREO DIRECTO
  ========================================================= */
  openDirectEmail(): void {
    window.location.href = 'mailto:atrionsystem@gmail.com';
  }
}