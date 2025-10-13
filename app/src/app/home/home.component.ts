import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Service } from '../shared/models/service.interface';
import { ServiceCardComponent } from '../shared/components/service-card/service-card.component';
import { CatalogService } from '../shared/services/catalog.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ServiceCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  services: Service[] = [];
  filteredServices: Service[] = [];
  selectedCategory: string = 'Todos';
  categories: string[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(private catalogService: CatalogService) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.loading = true;
    this.error = null;

    this.catalogService.getCatalog().subscribe({
      next: (services) => {
        this.services = services;
        this.filteredServices = services;
        this.extractCategories();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar servicios:', error);
        this.error = 'Error al cargar los servicios. Por favor, intenta nuevamente.';
        this.loading = false;
      },
    });
  }

  extractCategories(): void {
    const categorySet = new Set(this.services.map((service: Service) => service.categoria));
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
