import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { RouterLink } from '@angular/router';

interface ServiceItem {
  id: number;
  number: string;
  menuTitle: string;
  title: string;
  category: string;
  eyebrow: string;
  description: string;
  image: string;
  imageAlt: string;
  benefits: string[];
  technologies: string[];
  highlight: string;
}

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css',
})
export class Servicios implements AfterViewInit, OnDestroy {
  @ViewChildren('serviceTab') private serviceTabs!: QueryList<ElementRef<HTMLButtonElement>>;

  selectedIndex = 0;
  private revealObserver?: IntersectionObserver;

  readonly services: ServiceItem[] = [
    {
      id: 1,
      number: '01',
      menuTitle: 'Automatización de procesos',
      title: 'Automatización de procesos empresariales',
      category: 'Automatización',
      eyebrow: 'Operaciones más ágiles',
      description:
        'Diseñamos flujos automatizados para reducir tareas repetitivas, conectar sistemas, mejorar la trazabilidad y optimizar procesos administrativos, comerciales y operativos.',
      image: '/imagenes/servicios/realistas/01-automatizacion.jpg',
      imageAlt: 'Profesional revisando un flujo de automatización en un monitor',
      benefits: [
        'Reducción de tareas manuales',
        'Integración entre plataformas',
        'Procesos más rápidos y controlados',
      ],
      technologies: ['n8n', 'APIs', 'Webhooks', 'FastAPI', 'Bases de datos'],
      highlight: 'Ideal para empresas que quieren ahorrar tiempo y operar con mayor eficiencia.',
    },
    {
      id: 2,
      number: '02',
      menuTitle: 'Inteligencia Artificial',
      title: 'Inteligencia Artificial, Machine Learning y Deep Learning',
      category: 'Inteligencia Artificial',
      eyebrow: 'Modelos inteligentes',
      description:
        'Implementamos soluciones de inteligencia artificial para predicción, clasificación, análisis de información, procesamiento de lenguaje natural y visión por computador.',
      image: '/imagenes/servicios/realistas/02-inteligencia-artificial.jpg',
      imageAlt: 'Profesional analizando un experimento de visión por computador',
      benefits: [
        'Automatización inteligente',
        'Predicción y análisis avanzado',
        'Modelos adaptados al negocio',
      ],
      technologies: ['Python', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'NLP'],
      highlight: 'Convertimos datos en modelos capaces de apoyar decisiones y procesos reales.',
    },
    {
      id: 3,
      number: '03',
      menuTitle: 'Software a medida',
      title: 'Desarrollo de software a medida',
      category: 'Software',
      eyebrow: 'Soluciones digitales escalables',
      description:
        'Creamos plataformas web, sistemas internos y aplicaciones empresariales adaptadas a las necesidades específicas de cada organización.',
      image: '/imagenes/servicios/realistas/03-software.jpg',
      imageAlt: 'Desarrollador trabajando en una plataforma empresarial a medida',
      benefits: [
        'Sistemas personalizados',
        'Arquitectura escalable',
        'Mayor control de los procesos',
      ],
      technologies: ['Angular', 'Django', 'FastAPI', 'PostgreSQL', 'MongoDB'],
      highlight: 'Construimos software pensado para crecer junto con la empresa.',
    },
    {
      id: 4,
      number: '04',
      menuTitle: 'Chatbots y asistentes',
      title: 'Chatbots y asistentes virtuales por suscripción',
      category: 'Chatbots',
      eyebrow: 'Atención automática 24/7',
      description:
        'Desarrollamos chatbots para atención al cliente, captación de prospectos, soporte, agendamiento y automatización de conversaciones.',
      image: '/imagenes/servicios/realistas/04-chatbots.jpg',
      imageAlt: 'Persona utilizando un asistente virtual desde su teléfono',
      benefits: [
        'Atención permanente',
        'Captura de clientes potenciales',
        'Respuestas rápidas y consistentes',
      ],
      technologies: ['WhatsApp', 'Web Chat', 'IA conversacional', 'NLP', 'APIs'],
      highlight: 'Atiende mejor y conserva la continuidad sin depender siempre de personal humano.',
    },
    {
      id: 5,
      number: '05',
      menuTitle: 'Analítica de datos',
      title: 'Analítica de datos y dashboards empresariales',
      category: 'Datos',
      eyebrow: 'Decisiones basadas en información',
      description:
        'Diseñamos tableros de control, reportes ejecutivos y procesos de analítica para visualizar indicadores, medir resultados y decidir con datos claros.',
      image: '/imagenes/servicios/realistas/05-datos-actualizada.jpg',
      imageAlt: 'Profesional analizando indicadores empresariales en una tableta',
      benefits: [
        'Información centralizada',
        'Indicadores en tiempo real',
        'Mejor toma de decisiones',
      ],
      technologies: ['Power BI', 'Python', 'SQL', 'ETL', 'Excel avanzado'],
      highlight: 'Transformamos datos dispersos en información visual, clara y accionable.',
    },
    {
      id: 6,
      number: '06',
      menuTitle: 'Integración y licenciamiento',
      title: 'Venta, integración y licenciamiento de software',
      category: 'Software',
      eyebrow: 'Herramientas listas para operar',
      description:
        'Integramos soluciones de software a procesos empresariales existentes para acelerar la adopción tecnológica sin construir todo desde cero.',
      image: '/imagenes/servicios/realistas/06-integracion.jpg',
      imageAlt: 'Equipo conectando aplicaciones y permisos en un computador portátil',
      benefits: [
        'Implementación más rápida',
        'Integración con sistemas existentes',
        'Acompañamiento técnico especializado',
      ],
      technologies: ['SaaS', 'APIs', 'Cloud', 'Integraciones', 'Soporte técnico'],
      highlight:
        'Pensado para empresas que necesitan soluciones funcionales, rápidas y sostenibles.',
    },
  ];

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  get selectedService(): ServiceItem {
    return this.services[this.selectedIndex];
  }

  get nextServiceName(): string {
    return this.services[(this.selectedIndex + 1) % this.services.length].menuTitle;
  }

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

  selectService(index: number): void {
    this.selectedIndex = index;
  }

  scrollToServices(event: Event): void {
    event.preventDefault();
    this.host.nativeElement.querySelector('#soluciones')?.scrollIntoView({ behavior: 'smooth' });
    history.replaceState(null, '', '/servicios#soluciones');
  }

  nextService(): void {
    this.selectedIndex = (this.selectedIndex + 1) % this.services.length;
    this.focusSelectedTab();
  }

  onServiceKeydown(event: KeyboardEvent, index: number): void {
    let targetIndex = index;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      targetIndex = (index + 1) % this.services.length;
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      targetIndex = (index - 1 + this.services.length) % this.services.length;
    } else if (event.key === 'Home') {
      targetIndex = 0;
    } else if (event.key === 'End') {
      targetIndex = this.services.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    this.selectedIndex = targetIndex;
    this.focusSelectedTab();
  }

  trackService(_: number, service: ServiceItem): number {
    return service.id;
  }

  ngOnDestroy(): void {
    this.revealObserver?.disconnect();
  }

  private focusSelectedTab(): void {
    requestAnimationFrame(() => this.serviceTabs.get(this.selectedIndex)?.nativeElement.focus());
  }
}
