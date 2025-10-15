import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Service } from '../shared/models/service.interface';
import { CatalogService } from '../shared/services/catalog.service';
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
          transform: 'scale(0.3) rotateX(-80deg) rotateZ(-20deg)',
          opacity: 0,
          filter: 'blur(20px)',
        }),
        animate(
          '1000ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          style({
            transform: 'scale(1) rotateX(0deg) rotateZ(0deg)',
            opacity: 1,
            filter: 'blur(0px)',
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
              transform: 'translateY(50px) scale(0.8) rotateX(-30deg)',
              filter: 'blur(10px)',
            }),
            stagger('100ms', [
              animate(
                '800ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                style({
                  opacity: 1,
                  transform: 'translateY(0) scale(1) rotateX(0deg)',
                  filter: 'blur(0px)',
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

  constructor(private catalogService: CatalogService, private cdr: ChangeDetectorRef) {}

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
}
