import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface ServiceItem {
  id: number;
  number: string;
  title: string;
  category: string;
  eyebrow: string;
  description: string;
  image: string;
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
export class Servicios {
  activeFilter = 'Todos';

  filters: string[] = [
    'Todos',
    'Automatización',
    'Inteligencia Artificial',
    'Software',
    'Datos',
    'Chatbots'
  ];

  services: ServiceItem[] = [
    {
      id: 1,
      number: '01',
      title: 'Automatización de procesos empresariales',
      category: 'Automatización',
      eyebrow: 'Operaciones más ágiles',
      description:
        'Diseñamos flujos automatizados para reducir tareas repetitivas, conectar sistemas, mejorar la trazabilidad y optimizar procesos administrativos, comerciales y operativos.',
      image: '/imagenes/servicios/automatizacion.png',
      benefits: [
        'Reducción de tareas manuales',
        'Integración entre plataformas',
        'Procesos más rápidos y controlados'
      ],
      technologies: ['n8n', 'APIs', 'Webhooks', 'FastAPI', 'Bases de datos'],
      highlight: 'Ideal para empresas que quieren ahorrar tiempo y operar con mayor eficiencia.'
    },
    {
      id: 2,
      number: '02',
      title: 'Inteligencia Artificial, Machine Learning y Deep Learning',
      category: 'Inteligencia Artificial',
      eyebrow: 'Modelos inteligentes',
      description:
        'Implementamos soluciones basadas en inteligencia artificial para predicción, clasificación, análisis de información, procesamiento de lenguaje natural y visión por computador.',
      image: '/imagenes/servicios/inteligencia-artificial.png',
      benefits: [
        'Automatización inteligente',
        'Predicción y análisis avanzado',
        'Modelos adaptados al negocio'
      ],
      technologies: ['Python', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'NLP'],
      highlight: 'Convertimos datos en modelos capaces de apoyar decisiones y procesos reales.'
    },
    {
      id: 3,
      number: '03',
      title: 'Desarrollo de software a medida',
      category: 'Software',
      eyebrow: 'Soluciones digitales escalables',
      description:
        'Creamos plataformas web, sistemas internos, aplicaciones empresariales y soluciones backend/frontend adaptadas a las necesidades específicas de cada organización.',
      image: '/imagenes/servicios/software.png',
      benefits: [
        'Sistemas personalizados',
        'Arquitectura escalable',
        'Mayor control de los procesos'
      ],
      technologies: ['Angular', 'Django', 'FastAPI', 'PostgreSQL', 'MongoDB'],
      highlight: 'Construimos software pensado para crecer junto con la empresa.'
    },
    {
      id: 4,
      number: '04',
      title: 'Chatbots y asistentes virtuales por suscripción',
      category: 'Chatbots',
      eyebrow: 'Atención automática 24/7',
      description:
        'Desarrollamos chatbots para atención al cliente, captación de prospectos, soporte, agendamiento y automatización de conversaciones en canales digitales.',
      image: '/imagenes/servicios/chatbots.png',
      benefits: [
        'Atención permanente',
        'Captura de clientes potenciales',
        'Respuestas rápidas y consistentes'
      ],
      technologies: ['WhatsApp', 'Web Chat', 'IA Conversacional', 'NLP', 'APIs'],
      highlight: 'Una solución ideal para empresas que quieren atender mejor sin depender siempre de personal humano.'
    },
    {
      id: 5,
      number: '05',
      title: 'Analítica de datos y dashboards empresariales',
      category: 'Datos',
      eyebrow: 'Decisiones basadas en información',
      description:
        'Diseñamos tableros de control, reportes ejecutivos y procesos de analítica que permiten visualizar indicadores, medir resultados y tomar decisiones con datos claros.',
      image: '/imagenes/servicios/datos.png',
      benefits: [
        'Información centralizada',
        'Indicadores en tiempo real',
        'Mejor toma de decisiones'
      ],
      technologies: ['Power BI', 'Python', 'SQL', 'ETL', 'Excel avanzado'],
      highlight: 'Transformamos datos dispersos en información visual, clara y accionable.'
    },
    {
      id: 6,
      number: '06',
      title: 'Venta, integración y licenciamiento de software',
      category: 'Software',
      eyebrow: 'Herramientas listas para operar',
      description:
        'Ofrecemos soluciones de software que pueden integrarse a procesos empresariales existentes, permitiendo acelerar la adopción tecnológica sin construir todo desde cero.',
      image: '/imagenes/servicios/licenciamiento.png',
      benefits: [
        'Implementación más rápida',
        'Integración con sistemas existentes',
        'Acompañamiento técnico especializado'
      ],
      technologies: ['SaaS', 'APIs', 'Cloud', 'Integraciones', 'Soporte técnico'],
      highlight: 'Pensado para empresas que necesitan soluciones funcionales, rápidas y sostenibles.'
    }
  ];

  setFilter(filter: string): void {
    this.activeFilter = filter;
  }

  get filteredServices(): ServiceItem[] {
    if (this.activeFilter === 'Todos') {
      return this.services;
    }

    return this.services.filter(service => service.category === this.activeFilter);
  }
}