import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Service } from '../../models/service.interface';

@Component({
  selector: 'app-services-grid',
  imports: [CommonModule],
  templateUrl: './services-grid.component.html',
  styleUrls: ['./services-grid.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesGridComponent {
  @Input() services: Service[] = [];
  @Input() loading: boolean = false;
  @Input() error: string | null = null;
  @Input() trackByFn?: (index: number, service: Service) => any;

  trackByServiceId = (index: number, service: Service): any => {
    if (this.trackByFn) {
      return this.trackByFn(index, service);
    }
    return service.id || index;
  };

  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      Streaming: 'bg-blue-100/50 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200',
      Música: 'bg-pink-100/50 dark:bg-pink-900/50 text-pink-800 dark:text-pink-200',
      'Cloud Storage':
        'bg-indigo-100/50 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200',
      Productividad: 'bg-yellow-100/50 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200',
      Gaming: 'bg-purple-100/50 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200',
      Seguridad: 'bg-teal-100/50 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200',
      Internet: 'bg-green-100/50 dark:bg-green-900/50 text-green-800 dark:text-green-200',
      Telefonía: 'bg-orange-100/50 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200',
    };
    return (
      colors[category] || 'bg-gray-100/50 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200'
    );
  }

  formatPrice(price: string): string {
    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericPrice);
  }

  getServiceName(service: Service): string {
    return (
      `${service.servicio || ''} - ${service.plan || ''}`.trim().replace(/^-\s*|-\s*$/g, '') ||
      'Sin nombre'
    );
  }

  getServiceProvider(service: Service): string {
    return service.proveedor || 'Proveedor desconocido';
  }

  getServiceDescription(service: Service): string {
    return service.velocidadDetalles || 'Sin descripción disponible';
  }

  isServiceActive(service: Service): boolean {
    return service.estado?.toLowerCase() === 'activo';
  }
}
