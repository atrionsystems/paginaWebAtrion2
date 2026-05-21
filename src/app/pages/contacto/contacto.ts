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
    ESTADOS DE ENVÍO
  ========================================================= */
  isLoading = false;
  submitState: 'idle' | 'success' | 'error' = 'idle';
  clientEmail = '';

  /* =========================================================
    ENVÍO DE SOLICITUD
  ========================================================= */
  async sendRequest(): Promise<void> {
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

    this.isLoading = true;
    this.submitState = 'idle';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...this.form })
      });

      if (!res.ok) throw new Error('Error en el servidor');

      this.clientEmail = this.form.email;
      this.submitState = 'success';
      this.resetForm();
    } catch {
      this.submitState = 'error';
    } finally {
      this.isLoading = false;
    }
  }

  private resetForm(): void {
    this.form = {
      reason: '', firstName: '', lastName: '', email: '',
      phone: '', company: '', position: '', location: '', city: '', message: ''
    };
  }

  /* =========================================================
    CORREO DIRECTO
  ========================================================= */
  openDirectEmail(): void {
    window.location.href = 'mailto:atrionsystems@gmail.com';
  }
}