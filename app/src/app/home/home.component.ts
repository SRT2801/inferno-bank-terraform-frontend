import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Service } from '../shared/models/service.interface';
import { ServiceCardComponent } from '../shared/components/service-card/service-card.component';
import { PaymentTrackerComponent } from '../shared/components/payment-tracker/payment-tracker.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ServiceCardComponent, PaymentTrackerComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  services: Service[] = [];
  filteredServices: Service[] = [];
  selectedCategory: string = 'Todos';
  categories: string[] = [];

  // Datos de prueba
  mockServices: Service[] = [
    {
      id: 1,
      categoria: 'Streaming',
      proveedor: 'Netflix',
      servicio: 'Plan Estándar',
      plan: 'Mensual',
      precio_mensual: 35000,
      detalles: 'Acceso a contenido en HD, 2 pantallas simultáneas',
      estado: 'Activo',
    },
    {
      id: 2,
      categoria: 'Música',
      proveedor: 'Spotify',
      servicio: 'Premium Individual',
      plan: 'Mensual',
      precio_mensual: 16900,
      detalles: 'Sin anuncios, descargas offline, calidad alta',
      estado: 'Activo',
    },
    {
      id: 3,
      categoria: 'Cloud Storage',
      proveedor: 'Google',
      servicio: 'Google One',
      plan: '100GB',
      precio_mensual: 8900,
      detalles: 'Almacenamiento en la nube, backup automático',
      estado: 'Activo',
    },
    {
      id: 4,
      categoria: 'Streaming',
      proveedor: 'Prime Video',
      servicio: 'Amazon Prime',
      plan: 'Anual',
      precio_mensual: 12000,
      detalles: 'Video streaming, envíos gratis Amazon',
      estado: 'Inactivo',
    },
    {
      id: 5,
      categoria: 'Productividad',
      proveedor: 'Microsoft',
      servicio: 'Office 365',
      plan: 'Personal',
      precio_mensual: 25000,
      detalles: 'Word, Excel, PowerPoint, OneDrive 1TB',
      estado: 'Activo',
    },
    {
      id: 6,
      categoria: 'Gaming',
      proveedor: 'PlayStation',
      servicio: 'PlayStation Plus',
      plan: 'Essential',
      precio_mensual: 35000,
      detalles: 'Juegos gratis mensuales, multijugador online',
      estado: 'Activo',
    },
    {
      id: 7,
      categoria: 'Música',
      proveedor: 'Apple',
      servicio: 'Apple Music',
      plan: 'Individual',
      precio_mensual: 16900,
      detalles: 'Música sin límites, audio de alta calidad',
      estado: 'Inactivo',
    },
    {
      id: 8,
      categoria: 'Seguridad',
      proveedor: 'NordVPN',
      servicio: 'VPN Premium',
      plan: 'Mensual',
      precio_mensual: 45000,
      detalles: 'VPN segura, protección online, sin logs',
      estado: 'Activo',
    },
  ];

  ngOnInit(): void {
    this.loadServices();
    this.extractCategories();
  }

  loadServices(): void {
    // Simulamos una carga de datos
    setTimeout(() => {
      this.services = this.mockServices;
      this.filteredServices = this.services;
    }, 500);
  }

  extractCategories(): void {
    const categorySet = new Set(this.mockServices.map((service) => service.categoria));
    this.categories = ['Todos', ...Array.from(categorySet)];
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    if (category === 'Todos') {
      this.filteredServices = this.services;
    } else {
      this.filteredServices = this.services.filter((service) => service.categoria === category);
    }
  }

  onServiceSelected(service: Service): void {
    console.log('Servicio seleccionado:', service);
    // Aquí puedes agregar la lógica para manejar la selección del servicio
    // Por ejemplo, navegar a una página de detalles o abrir un modal
  }

  getActiveServicesCount(): number {
    return this.services.filter((service) => service.estado === 'Activo').length;
  }

  getTotalMonthlyAmount(): number {
    return this.services
      .filter((service) => service.estado === 'Activo')
      .reduce((total, service) => total + service.precio_mensual, 0);
  }

  trackByServiceId(index: number, service: Service): number {
    return service.id;
  }
}
