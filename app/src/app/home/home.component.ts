import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Service } from '../shared/models/service.interface';
import { CatalogService } from '../shared/services/catalog.service';
import { TourService } from '../shared/services/tour.service';
import { HeaderComponent } from '../shared/components/header/header.component';
import { FilterComponent } from '../shared/components/filter/filter.component';
import { ServicesGridComponent } from '../shared/components/services-grid/services-grid.component';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, HeaderComponent, FilterComponent, ServicesGridComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('pageEnter', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(40px) scale(0.95)',
        }),
        animate(
          '700ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          style({
            opacity: 1,
            transform: 'translateY(0) scale(1)',
          })
        ),
      ]),
    ]),
    trigger('staggerAnimation', [
      transition(':enter', [
        query(
          '.stagger-item',
          [
            style({
              opacity: 0,
              transform: 'translateY(30px) scale(0.9)',
            }),
            stagger('60ms', [
              animate(
                '600ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                style({
                  opacity: 1,
                  transform: 'translateY(0) scale(1)',
                })
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  searchTerm: string = '';
  selectedCategory: string = 'Todos';
  loading: boolean = true;
  error: string | null = null;

  categories: string[] = ['Todos'];
  services: Service[] = [];
  filteredServices: Service[] = [];

  private _totalServices: number = 0;
  private _activeServices: number = 0;
  private _inactiveServices: number = 0;
  private _totalCost: number = 0;

  constructor(
    private catalogService: CatalogService,
    private cdr: ChangeDetectorRef,
    private tourService: TourService
  ) {}

  get totalServices(): number {
    return this._totalServices;
  }

  get activeServices(): number {
    return this._activeServices;
  }

  get inactiveServices(): number {
    return this._inactiveServices;
  }

  get totalCost(): number {
    return this._totalCost;
  }

  trackByServiceId(index: number, service: Service): any {
    return service.id || index;
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
        this.calculateStats();
        this.updateCategories();
        this.filterServices();
        this.loading = false;
        this.cdr.markForCheck();
        this.checkAndStartTour();
      },

      error: (err) => {
        console.error('Error loading services:', err);
        this.error = 'Error al cargar los servicios. Por favor, intenta de nuevo.';
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  updateCategories() {
    const uniqueCategories = [...new Set(this.services.map((s) => s.categoria).filter(Boolean))];
    this.categories = ['Todos', ...uniqueCategories.sort()];
  }

  private searchTimeout: any;

  filterServices() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      this.filteredServices = this.services.filter((service) => {
        const matchesSearch =
          service.servicio?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          service.proveedor?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          service.plan?.toLowerCase().includes(this.searchTerm.toLowerCase());
        const matchesCategory =
          this.selectedCategory === 'Todos' || service.categoria === this.selectedCategory;
        return matchesSearch && matchesCategory;
      });
      this.cdr.markForCheck();
    }, 300);
  }

  private calculateStats() {
    this._totalServices = this.services.length;
    this._activeServices = this.services.filter((s) => s.estado?.toLowerCase() === 'activo').length;
    this._inactiveServices = this.services.filter(
      (s) => s.estado?.toLowerCase() !== 'activo'
    ).length;
    this._totalCost = this.services
      .filter((s) => s.estado?.toLowerCase() === 'activo')
      .reduce((total, service) => {
        const numericPrice =
          parseFloat((service.precioMensual || '0').replace(/[^0-9.]/g, '')) || 0;
        return total + numericPrice;
      }, 0);
  }

  onSearchChange() {
    this.filterServices();
    this.cdr.markForCheck();
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.filterServices();
    this.cdr.markForCheck();
  }

  onSearchTermChange(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.filterServices();
    this.cdr.markForCheck();
  }

  onCategorySelect(category: string) {
    this.selectedCategory = category;
    this.filterServices();
    this.cdr.markForCheck();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO').format(price || 0);
  }

  private checkAndStartTour(): void {
    const hasSeenTour = localStorage.getItem('hasSeenTour');

    if (!hasSeenTour) {
      setTimeout(() => {
        this.tourService.startHomeTour();
        localStorage.setItem('hasSeenTour', 'true');
      }, 2000);
    }
  }
  startTour(): void {
    this.tourService.startHomeTour();
  }
}
