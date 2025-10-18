import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Service } from '../shared/models/service.interface';
import { CatalogService } from '../shared/services/catalog.service';
import { TourService } from '../shared/services/tour.service';
import { HeaderComponent } from '../shared/components/header/header.component';
import { FilterComponent } from '../shared/components/filter/filter.component';
import { ServicesGridComponent } from '../shared/components/services-grid/services-grid.component';
import { PaymentModalComponent } from '../shared/components/payment-modal/payment-modal.component';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    FilterComponent,
    ServicesGridComponent,
    PaymentModalComponent,
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
  searchTerm: string = '';
  selectedCategory: string = 'Todos';
  loading: boolean = true;
  error: string | null = null;

  categories: string[] = ['Todos'];
  services: Service[] = [];
  filteredServices: Service[] = [];

  // Payment modal
  isPaymentModalOpen: boolean = false;
  selectedServiceForPayment: Service | null = null;

  private _totalServices: number = 0;
  private _activeServices: number = 0;
  private _inactiveServices: number = 0;
  private _totalCost: number = 0;

  private destroy$ = new Subject<void>();
  private searchTimeout?: ReturnType<typeof setTimeout>;
  private resizeTimeout?: ReturnType<typeof setTimeout>;

  constructor(
    private catalogService: CatalogService,
    private cdr: ChangeDetectorRef,
    private tourService: TourService,
    private authService: AuthService
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

  ngOnInit(): void {
    this.checkMobileDevice();
    this.loadServices();
    this.initializeTour();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    this.resizeTimeout = setTimeout(() => {
      this.checkMobileDevice();
    }, 250);
  }


  private initializeTour(): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser || this.isMobile()) return;

    const tourKey = `hasSeenTour_${currentUser.email}`;
    const hasSeenTour = localStorage.getItem(tourKey) === 'true';

    if (!hasSeenTour) {
      setTimeout(() => {
        this.tourService.startHomeTour();
        localStorage.setItem(tourKey, 'true');
      }, 2000);
    }
  }

  loadServices(): void {
    this.loading = true;
    this.error = null;

    this.catalogService
      .getCatalog()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (services) => {
          this.services = services;
          this.updateCategories();
          this.calculateStats();
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

  private updateCategories(): void {
    const uniqueCategories = [...new Set(this.services.map((s) => s.categoria).filter(Boolean))];
    this.categories = ['Todos', ...uniqueCategories.sort()];
  }

  private filterServices(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      const searchLower = this.searchTerm.toLowerCase();

      this.filteredServices = this.services.filter((service) => {
        const matchesSearch =
          !searchLower ||
          service.servicio?.toLowerCase().includes(searchLower) ||
          service.proveedor?.toLowerCase().includes(searchLower) ||
          service.plan?.toLowerCase().includes(searchLower);

        const matchesCategory =
          this.selectedCategory === 'Todos' || service.categoria === this.selectedCategory;

        return matchesSearch && matchesCategory;
      });

      this.cdr.markForCheck();
    }, 300);
  }

  private calculateStats(): void {
    this._totalServices = this.services.length;

    let activeCount = 0;
    let totalCost = 0;

    for (const service of this.services) {
      const isActive = service.estado?.toLowerCase() === 'activo';

      if (isActive) {
        activeCount++;
        const numericPrice =
          parseFloat((service.precioMensual || '0').replace(/[^0-9.]/g, '')) || 0;
        totalCost += numericPrice;
      }
    }

    this._activeServices = activeCount;
    this._inactiveServices = this._totalServices - activeCount;
    this._totalCost = totalCost;
  }

  onSearchTermChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.filterServices();
  }

  onCategorySelect(category: string): void {
    this.selectedCategory = category;
    this.filterServices();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price || 0);
  }

  private isMobile(): boolean {
    return window.innerWidth < 768;
  }

  startTour(): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return;

    this.tourService.startHomeTour();
  }

  private checkMobileDevice(): void {
    const isMobile = this.isMobile();
    document.body.classList.toggle('mobile', isMobile);
    document.body.classList.toggle('desktop', !isMobile);
  }

  onPayService(service: Service): void {
    this.selectedServiceForPayment = service;
    this.isPaymentModalOpen = true;
    this.cdr.markForCheck();
  }

  onClosePaymentModal(): void {
    this.isPaymentModalOpen = false;
    this.selectedServiceForPayment = null;
    this.cdr.markForCheck();
  }

  onPaymentSuccess(event: { traceId: string; service: Service }): void {
    console.log('Payment successful:', event);

  }
}
