import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ContactFormModel {
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
  website: string;
}

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css'
})
export class ContactoComponent {
  form: ContactFormModel = this.createEmptyForm();

  readonly reasonOptions: string[] = [
    'Chatbots y automatización IA',
    'Software empresarial',
    'Páginas web',
    'Software a la medida',
    'Otro'
  ];

  isReasonOpen = false;
  isLoading = false;
  submitState: 'idle' | 'success' | 'error' = 'idle';

  toggleReasonDropdown(): void {
    this.isReasonOpen = !this.isReasonOpen;
  }

  selectReason(option: string): void {
    this.form.reason = option;
    this.isReasonOpen = false;
  }

  handleReasonKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.isReasonOpen = false;
      return;
    }

    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
      event.preventDefault();
      this.isReasonOpen = true;
    }
  }

  @HostListener('document:click')
  closeReasonDropdown(): void {
    this.isReasonOpen = false;
  }

  async sendRequest(): Promise<void> {
    if (this.isLoading) return;
    if (!this.hasValidRequiredValues()) {
      this.submitState = 'error';
      return;
    }

    this.isLoading = true;
    this.submitState = 'idle';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.form)
      });

      if (!response.ok) throw new Error('La solicitud no pudo completarse.');

      this.submitState = 'success';
      this.form = this.createEmptyForm();
    } catch {
      this.submitState = 'error';
    } finally {
      this.isLoading = false;
    }
  }

  private hasValidRequiredValues(): boolean {
    const email = this.form.email.trim();
    const phone = this.form.phone.trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(email);
    const phoneDigits = phone.replace(/\D/gu, '');
    const validPhone =
      !phone || (/^\+?[0-9\s().-]+$/u.test(phone) && phoneDigits.length >= 7 && phoneDigits.length <= 15);

    return Boolean(
      this.form.firstName.trim() &&
        validEmail &&
        this.form.message.trim() &&
        validPhone
    );
  }

  private createEmptyForm(): ContactFormModel {
    return {
      reason: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      location: '',
      city: '',
      message: '',
      website: ''
    };
  }
}
