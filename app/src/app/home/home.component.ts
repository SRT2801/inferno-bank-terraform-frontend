import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Service } from '../shared/models/service.interface';
import { CatalogService } from '../shared/services/catalog.service';
import { HeaderComponent } from '../shared/components/header/header.component';
import { FilterComponent } from '../shared/components/filter/filter.component';

@Component({
  selector: 'app-home2',
  imports: [CommonModule, FormsModule, HeaderComponent, FilterComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent implements OnInit {
  searchTerm: string = '';
  selectedCategory: string = 'Todos';
  loading: boolean = true;
  error: string | null = null;

  categories: string[] = ['Todos'];
  services: Service[] = [];
  filteredServices: Service[] = [];

  constructor(private catalogService: CatalogService) {}

  get totalServices(): number {
    return this.services.length;
  }

  get activeServices(): number {
    return this.services.filter((s) => s.estado?.toLowerCase() === 'activo').length;
  }

  get inactiveServices(): number {
    return this.services.filter((s) => s.estado?.toLowerCase() !== 'activo').length;
  }

  get totalCost(): number {
    return this.services
      .filter((s) => s.estado?.toLowerCase() === 'activo')
      .reduce((total, service) => total + (service.precioMensual || 0), 0);
  }

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.loading = true;
    this.error = null;

    this.catalogService.getCatalog().subscribe({
      next: (services) => {
        this.services = services;
        this.updateCategories();
        this.filterServices();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading services:', err);
        this.error = 'Error al cargar los servicios. Por favor, intenta de nuevo.';
        this.loading = false;
      },
    });
  }

  updateCategories() {
    const uniqueCategories = [...new Set(this.services.map((s) => s.categoria).filter(Boolean))];
    this.categories = ['Todos', ...uniqueCategories.sort()];
  }

  filterServices() {
    this.filteredServices = this.services.filter((service) => {
      const matchesSearch =
        service.servicio?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        service.proveedor?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        service.plan?.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory =
        this.selectedCategory === 'Todos' || service.categoria === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  onSearchChange() {
    this.filterServices();
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.filterServices();
  }

  onSearchTermChange(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.filterServices();
  }

  onCategorySelect(category: string) {
    this.selectedCategory = category;
    this.filterServices();
  }

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

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO').format(price || 0);
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
