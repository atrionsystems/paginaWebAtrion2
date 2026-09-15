import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-asesorias',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './asesorias.html',
  styleUrl: './asesorias.css',
})
export class Asesorias implements AfterViewInit, OnDestroy {
  private revealObserver?: IntersectionObserver;

  audiences = [
    {
      number: '01',
      title: 'Federaciones y gremios',
      description:
        'Orientamos a sus afiliados sobre transformación digital, IA, software y automatización.',
    },
    {
      number: '02',
      title: 'Empresas',
      description:
        'Acompañamos equipos directivos y operativos para detectar oportunidades tecnológicas.',
    },
    {
      number: '03',
      title: 'Ferias y eventos',
      description:
        'Participamos como expositores, conferencistas o aliados en espacios empresariales.',
    },
    {
      number: '04',
      title: 'Personas y emprendedores',
      description:
        'Convertimos ideas, tareas y necesidades en una ruta digital práctica y alcanzable.',
    },
  ];

  advisoryLines = [
    {
      number: '01',
      title: 'Charlas sobre inteligencia artificial',
      description:
        'Explicamos cómo aplicar IA en empresas reales, con lenguaje claro y ejemplos prácticos.',
      points: ['IA para productividad', 'Asistentes inteligentes', 'Casos de uso por sector'],
    },
    {
      number: '02',
      title: 'Automatización de procesos',
      description:
        'Detectamos tareas repetitivas y oportunidades para conectar flujos, software e integraciones.',
      points: ['Mapeo de procesos', 'Cuellos de botella', 'Ruta de automatización'],
    },
    {
      number: '03',
      title: 'Consultoría en software empresarial',
      description:
        'Orientamos decisiones sobre plataformas, sistemas internos, dashboards y soluciones a medida.',
      points: ['Software a medida', 'Plataformas web', 'Sistemas de gestión'],
    },
    {
      number: '04',
      title: 'Datos e inteligencia de negocio',
      description:
        'Convertimos información empresarial en indicadores, reportes y decisiones estratégicas.',
      points: ['Dashboards ejecutivos', 'Análisis de datos', 'Indicadores de gestión'],
    },
    {
      number: '05',
      title: 'Chatbots y atención inteligente',
      description:
        'Exploramos soluciones para mejorar la atención mediante asistentes y canales automatizados.',
      points: ['WhatsApp y web', 'Atención automatizada', 'Captación de prospectos'],
    },
    {
      number: '06',
      title: 'Diagnóstico digital',
      description:
        'Evaluamos el estado tecnológico de la organización y proponemos prioridades de mejora.',
      points: ['Evaluación inicial', 'Priorización', 'Hoja de ruta tecnológica'],
    },
  ];

  process = [
    {
      number: '01',
      title: 'Escuchamos',
      description: 'Entendemos el espacio, su audiencia y el objetivo de la organización.',
    },
    {
      number: '02',
      title: 'Diseñamos',
      description: 'Creamos una sesión o diagnóstico adaptado al contexto real.',
    },
    {
      number: '03',
      title: 'Compartimos',
      description: 'Facilitamos una experiencia clara, útil y orientada a decisiones.',
    },
    {
      number: '04',
      title: 'Proponemos',
      description: 'Entregamos próximos pasos y oportunidades concretas de implementación.',
    },
  ];

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    const elements = this.host.nativeElement.querySelectorAll<HTMLElement>('[data-reveal]');
    elements.forEach((element) => element.classList.add('reveal-ready'));

    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    this.revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            this.revealObserver?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    elements.forEach((element) => this.revealObserver?.observe(element));
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).classList.add('is-hidden');
  }

  ngOnDestroy(): void {
    this.revealObserver?.disconnect();
  }
}
