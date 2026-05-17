/* =========================================================
  IMPORTACIONES
========================================================= */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

/* =========================================================
  CONFIGURACIÓN DEL COMPONENTE
========================================================= */
@Component({
  selector: 'app-asesorias',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './asesorias.html',
  styleUrl: './asesorias.css'
})
export class Asesorias {

  /* =========================================================
    CORREO DE CONTACTO
  ========================================================= */
  private readonly contactEmail = 'atrionsystems@gmail.com';

  /* =========================================================
    TARJETAS INTRODUCTORIAS
  ========================================================= */
  audiences = [
    {
      icon: '🏛️',
      title: 'Federaciones y gremios',
      description:
        'Participamos en encuentros empresariales para orientar a sus afiliados sobre transformación digital, IA, software y automatización.'
    },
    {
      icon: '🏢',
      title: 'Empresas',
      description:
        'Acompañamos equipos directivos y operativos para identificar procesos que pueden mejorar mediante tecnología.'
    },
    {
      icon: '🎤',
      title: 'Ferias y eventos',
      description:
        'Asistimos como expositores, conferencistas o aliados tecnológicos en espacios de networking y formación empresarial.'
    },
    {
      icon: '👥',
      title: 'Personas y emprendedores',
      description:
        'Brindamos asesoría práctica para quienes desean digitalizar ideas, automatizar tareas o lanzar soluciones digitales.'
    }
  ];

  /* =========================================================
    LÍNEAS DE ASESORÍA
  ========================================================= */
  services = [
    {
      number: '01',
      icon: '🤖',
      title: 'Charlas sobre inteligencia artificial',
      description:
        'Explicamos cómo la IA puede aplicarse en empresas reales sin tecnicismos innecesarios y con ejemplos prácticos.',
      points: [
        'IA para productividad empresarial',
        'Automatización con asistentes inteligentes',
        'Casos de uso por sector económico'
      ]
    },
    {
      number: '02',
      icon: '⚙️',
      title: 'Asesoría en automatización de procesos',
      description:
        'Ayudamos a detectar tareas repetitivas que pueden optimizarse mediante flujos digitales, software o integraciones.',
      points: [
        'Mapeo de procesos actuales',
        'Identificación de cuellos de botella',
        'Propuestas de automatización'
      ]
    },
    {
      number: '03',
      icon: '💻',
      title: 'Consultoría en software empresarial',
      description:
        'Orientamos a empresas que necesitan páginas web, plataformas, sistemas internos, dashboards o soluciones a medida.',
      points: [
        'Software a la medida',
        'Páginas web profesionales',
        'Sistemas para gestión interna'
      ]
    },
    {
      number: '04',
      icon: '📊',
      title: 'Datos e inteligencia de negocio',
      description:
        'Mostramos cómo convertir información empresarial en indicadores, reportes y decisiones estratégicas.',
      points: [
        'Dashboards ejecutivos',
        'Análisis de datos empresariales',
        'Indicadores para toma de decisiones'
      ]
    },
    {
      number: '05',
      icon: '💬',
      title: 'Chatbots y atención inteligente',
      description:
        'Presentamos soluciones para mejorar la atención al cliente mediante asistentes virtuales y canales automatizados.',
      points: [
        'Chatbots para WhatsApp o web',
        'Atención automatizada',
        'Captura de clientes potenciales'
      ]
    },
    {
      number: '06',
      icon: '🚀',
      title: 'Diagnóstico digital para empresas',
      description:
        'Realizamos sesiones para entender el estado tecnológico de una organización y proponer una ruta de mejora.',
      points: [
        'Evaluación inicial',
        'Priorización de oportunidades',
        'Ruta tecnológica recomendada'
      ]
    }
  ];

  /* =========================================================
    PROCESO DE TRABAJO
  ========================================================= */
  process = [
    {
      number: '01',
      title: 'Escuchamos la necesidad',
      description:
        'Entendemos el tipo de evento, público objetivo, sector empresarial y propósito de la organización.'
    },
    {
      number: '02',
      title: 'Diseñamos la sesión',
      description:
        'Creamos una propuesta de charla, asesoría o participación adaptada al perfil de los asistentes.'
    },
    {
      number: '03',
      title: 'Participamos en el espacio',
      description:
        'Asistimos al evento, feria o reunión con una presentación clara, profesional y enfocada en valor.'
    },
    {
      number: '04',
      title: 'Proponemos soluciones',
      description:
        'Después del encuentro, podemos acompañar a las empresas interesadas con diagnósticos, proyectos o servicios específicos.'
    }
  ];

  /* =========================================================
    ABRIR CORREO CON SOLICITUD
  ========================================================= */
  openMail(subject: string): void {
    const emailSubject = encodeURIComponent(`Atrion Systems - ${subject}`);

    const body = encodeURIComponent(
      `Hola Atrion Systems,\n\n` +
      `Estoy interesado/a en recibir información sobre:\n\n` +
      `${subject}\n\n` +
      `Tipo de organización:\n` +
      `Nombre de la empresa/federación:\n` +
      `Nombre de contacto:\n` +
      `Teléfono:\n` +
      `Ciudad:\n` +
      `Mensaje:\n\n` +
      `Quedo atento/a.`
    );

    window.location.href = `mailto:${this.contactEmail}?subject=${emailSubject}&body=${body}`;
  }

  /* =========================================================
    MANEJO DE ERROR EN IMAGEN PRINCIPAL
  ========================================================= */
  onImageError(event: Event): void {
    const image = event.target as HTMLImageElement;
    image.classList.add('img-error');
    image.style.display = 'none';
  }
}