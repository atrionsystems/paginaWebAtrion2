import { NgForm } from '@angular/forms';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ContactoComponent } from './contacto';

function formStub(invalid = false): NgForm {
  return {
    invalid,
    control: { markAllAsTouched: vi.fn() },
    resetForm: vi.fn(),
  } as unknown as NgForm;
}

function complete(component: ContactoComponent): void {
  component.form = {
    reason: 'Analítica de datos',
    firstName: 'Ana',
    lastName: 'López',
    email: 'ana@example.com',
    phone: '3000000000',
    company: 'Atrion',
    position: 'Líder',
    location: 'Colombia',
    city: 'Manizales',
    message: 'Necesito un tablero de indicadores.',
  };
}

describe('ContactoComponent', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('muestra validaciones y no envía un formulario inválido', async () => {
    const component = new ContactoComponent();
    const form = formStub(true);
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await component.sendRequest(form);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(form.control.markAllAsTouched).toHaveBeenCalledOnce();
  });

  it('conserva el cuerpo POST, muestra éxito y reinicia el formulario', async () => {
    const component = new ContactoComponent();
    const form = formStub();
    complete(component);
    const expectedBody = { ...component.form };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));

    await component.sendRequest(form);

    expect(fetch).toHaveBeenCalledWith('/api/contact', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expectedBody),
    }));
    expect(component.submitState).toBe('success');
    expect(component.clientEmail).toBe('ana@example.com');
    expect(component.form.email).toBe('');
    expect(form.resetForm).toHaveBeenCalledOnce();
  });

  it('muestra el estado de error sin borrar los datos', async () => {
    const component = new ContactoComponent();
    const form = formStub();
    complete(component);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

    await component.sendRequest(form);

    expect(component.submitState).toBe('error');
    expect(component.form.email).toBe('ana@example.com');
    expect(form.resetForm).not.toHaveBeenCalled();
  });

  it('evita envíos duplicados mientras hay una solicitud en curso', async () => {
    const component = new ContactoComponent();
    complete(component);
    component.isLoading = true;
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await component.sendRequest(formStub());

    expect(fetchMock).not.toHaveBeenCalled();
  });
});
