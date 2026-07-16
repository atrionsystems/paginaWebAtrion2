# Atrion Systems

Sitio web de Atrion Systems construido con Angular 21 y desplegado en Vercel. El proyecto incluye funciones serverless Node.js para las integraciones privadas del sitio.

## Requisitos

- Node.js compatible con Angular 21.
- npm 11 o una versión compatible con el `package-lock.json`.
- Una cuenta de Vercel para reproducir localmente las rutas de `api/`.

## Desarrollo local

Instala las dependencias:

```bash
npm ci
```

Para trabajar solo en la interfaz:

```bash
npm start
```

Angular quedará disponible en `http://localhost:4200`. Este comando no levanta las funciones de `api/`, por lo que el envío real del formulario requiere Vercel Dev:

```bash
npx vercel dev
```

Usa la URL que indique Vercel Dev, normalmente `http://localhost:3000`, y abre `/contacto`.

## Comprobaciones

```bash
npm run typecheck
npm run test:api
npm test -- --watch=false
npm run build
npm run format:check
```

`test:api` usa mocks locales de `fetch`; nunca sustituye Odoo por datos falsos durante la ejecución de producción.

Para ejecutar una prueba real y explícita contra la instancia configurada en `.env`:

```bash
npm run test:odoo-live
```

Esta prueba crea una oportunidad con el prefijo `Página web Atrion - PRUEBA TÉCNICA ATRION - eliminar` para que pueda localizarse y eliminarse después. No forma parte de `test:api` ni del build normal.

## Integración CRM de Odoo

### Flujo

El formulario conserva su diseño Angular y envía los datos a la ruta relativa `POST /api/contact`. La función serverless valida y normaliza nuevamente la solicitud, descarta el honeypot antispam y realiza desde el servidor:

```text
Formulario Angular → /api/contact (Vercel) → API JSON-2 de Odoo 19 → crm.lead
```

El backend llama a `POST {ODOO_URL}/json/2/crm.lead/create` con el argumento nombrado `vals_list`. La clave API solo se lee en el servidor. Si Odoo confirma la operación, el endpoint responde `201` al navegador y, cuando Gmail está configurado, intenta enviar las notificaciones por correo que ya existían en el proyecto.

La oportunidad se crea con `type: opportunity`, por lo que aparece en el pipeline de CRM. El nombre sigue el formato `Página web Atrion - {empresa o nombre}` y la descripción incluye únicamente los campos diligenciados. Todo dato insertado en contenido HTML se escapa antes de enviarlo.

### Variables de entorno

Copia `.env.example` a `.env.local` para desarrollo y configura los valores solo en el entorno del servidor:

```env
ODOO_URL=https://nombre-base.odoo.com
ODOO_DATABASE=nombre_base
ODOO_API_KEY=reemplazar_con_clave_api
ODOO_CRM_TEAM_ID=
ODOO_CRM_USER_ID=
```

- `ODOO_URL`: URL base de Odoo, sin `/json/2` ni parámetros. Debe usar HTTPS; HTTP solo se acepta contra `localhost` para pruebas.
- `ODOO_DATABASE`: nombre técnico de la base. JSON-2 solo exige el encabezado `X-Odoo-Database` cuando el dominio no identifica por sí mismo una única base; si se deja vacío, no se envía.
- `ODOO_API_KEY`: clave del usuario de integración con permiso para crear `crm.lead`.
- `ODOO_CRM_TEAM_ID`: ID entero positivo de `crm.team`; opcional.
- `ODOO_CRM_USER_ID`: ID entero positivo de `res.users`; opcional.

Las notificaciones de correo existentes son opcionales y usan `GMAIL_USER` y `GMAIL_APP_PASSWORD`. Un fallo de correo no revierte ni duplica una oportunidad que Odoo ya confirmó.

En Vercel, crea las variables en Project Settings → Environment Variables para los entornos que correspondan. No uses prefijos públicos como `VITE_` o `NEXT_PUBLIC_`.

### Crear o reemplazar la clave API

1. En Odoo 19, usa preferiblemente un usuario técnico dedicado a la integración.
2. Asígnale el acceso mínimo al CRM que permita crear oportunidades y leer los equipos/usuarios que se vayan a asignar.
3. Abre Preferencias → Seguridad de la cuenta → Nueva clave API.
4. Define una descripción y duración, genera la clave y cópiala en `ODOO_API_KEY`; Odoo solo la muestra una vez.
5. Cuando caduque o sea necesario rotarla, genera una nueva, actualiza la variable en Vercel, despliega y revoca la anterior.

Odoo 19 limita la duración de las claves y recomienda rotarlas al menos cada tres meses. La API externa JSON-2 está disponible en planes Odoo Custom; no está disponible en One App Free ni Standard.

### Equipo comercial y responsable

Activa el modo desarrollador de Odoo y abre el equipo comercial o el usuario. El parámetro `id` de la URL corresponde al ID técnico que debe configurarse:

- El ID del equipo (`crm.team`) va en `ODOO_CRM_TEAM_ID`.
- El ID del usuario interno (`res.users`, no el contacto `res.partner`) va en `ODOO_CRM_USER_ID`.

Ambos son opcionales. Si quedan vacíos, esos campos no se incluyen y Odoo aplica sus valores predeterminados. Si se configuran, deben pertenecer a compañías compatibles y ser visibles para el usuario de la API.

### Probar el formulario

1. Configura las variables en `.env.local` o en Vercel.
2. Ejecuta `npx vercel dev` y abre `/contacto`.
3. Envía nombre, correo y mensaje válidos. Teléfono, empresa y servicio son opcionales.
4. Confirma el mensaje de éxito; el formulario solo se limpia después de una respuesta exitosa.
5. Prueba un correo o teléfono inválido y confirma que no se llama a Odoo.
6. Para simular indisponibilidad sin tocar producción, ejecuta `npm run test:api`; las pruebas cubren timeout, autenticación, validación, origen cruzado y respuesta inesperada.

Para validar el contrato específico de una instancia, abre `{ODOO_URL}/doc` con un usuario autorizado y revisa `crm.lead/create`. Los modelos, campos y métodos expuestos pueden variar según los módulos y permisos de cada base.

### Verificar la oportunidad en Odoo

1. Entra a CRM → Ventas → Mi pipeline u Oportunidades.
2. Busca `Página web Atrion -` o el correo enviado.
3. Comprueba contacto, empresa, correo, teléfono y descripción.
4. Si configuraste equipo o responsable, verifica su asignación. Si no aparece para un usuario concreto, revisa filtros, compañía, reglas de registro y permisos del usuario de integración.

### Seguridad y manejo de errores

- `.env`, `.env.local` y `.env.production` están ignorados por Git.
- La API key nunca se devuelve al navegador ni se registra en logs.
- El endpoint solo acepta `POST`, limita el tamaño, compara `Origin` con el host y aplica un timeout de 8 segundos hacia Odoo.
- La validación se ejecuta en frontend y backend; los campos se normalizan, tienen límites de longitud y el contenido se codifica antes de insertarse en HTML.
- Un honeypot oculto aporta protección básica contra spam sin servicios externos.
- Los errores de autenticación, red, timeout y configuración se registran en el servidor, pero el frontend recibe mensajes genéricos sin trazas de Odoo.

### Archivos relacionados

- `api/contact.ts`: endpoint público y orquestación segura.
- `server/contact/contact-data.ts`: validación, normalización y descripción de la oportunidad.
- `server/contact/odoo.ts`: cliente JSON-2 y timeout.
- `server/contact/email.ts`: notificaciones opcionales conservadas.
- `src/app/pages/contacto/`: formulario y estados de interfaz.
- `tests/`: pruebas del endpoint, validación y cliente Odoo.
- `.env.example`: plantilla sin secretos.

## Build de producción

```bash
npm run build
```

Los artefactos se generan en `dist/`. `vercel.json` conserva las rutas SPA y las funciones serverless de `api/`.
