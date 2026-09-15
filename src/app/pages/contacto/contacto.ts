import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

interface ContactFormData {
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

@Component({ selector: 'app-contacto', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './contacto.html', styleUrl: './contacto.css' })
export class ContactoComponent {
  form: ContactFormData = this.createEmptyForm();
  readonly reasonOptions = ['Software a la medida', 'Inteligencia artificial', 'Automatización', 'Analítica de datos', 'Chatbots', 'Licenciamiento', 'Soporte o asesoría', 'Otro'];
  isLoading = false;
  hasSubmitted = false;
  submitState: 'idle' | 'success' | 'error' = 'idle';
  clientEmail = '';

  async sendRequest(contactForm: NgForm): Promise<void> {
    if (this.isLoading) return;
    this.hasSubmitted = true;
    if (contactForm.invalid || !this.form.reason) {
      contactForm.control.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.submitState = 'idle';
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...this.form }) });
      if (!response.ok) throw new Error('Error en el servidor');
      this.clientEmail = this.form.email;
      this.submitState = 'success';
      this.form = this.createEmptyForm();
      contactForm.resetForm(this.form);
      this.hasSubmitted = false;
    } catch {
      this.submitState = 'error';
    } finally {
      this.isLoading = false;
    }
  }

  private createEmptyForm(): ContactFormData {
    return { reason: '', firstName: '', lastName: '', email: '', phone: '', company: '', position: '', location: '', city: '', message: '' };
  }
}
