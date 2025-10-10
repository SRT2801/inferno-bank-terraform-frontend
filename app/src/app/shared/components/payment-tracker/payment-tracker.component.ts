import { Component, Input, OnInit, OnDestroy, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { PaymentService } from '../../services/payment.service';
import { PaymentStatus } from '../../models/payment.interface';

@Component({
  selector: 'app-payment-tracker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-tracker.component.html',
  styleUrl: './payment-tracker.component.css',
})
export class PaymentTrackerComponent implements OnInit, OnDestroy {
  @Input() traceId?: string;

  paymentStatus: PaymentStatus | null = null;
  private subscription?: Subscription;
  showMockData: boolean = false;

  constructor(@Optional() private paymentService?: PaymentService) {}

  ngOnInit(): void {
    if (this.traceId && this.paymentService) {
      this.startTracking();
    } else {
      this.showMockData = true;
      this.loadMockData();
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private startTracking(): void {
    if (!this.traceId || !this.paymentService) return;

    this.subscription = this.paymentService.trackPayment(this.traceId).subscribe({
      next: (status) => {
        this.paymentStatus = status;
      },
      error: (error) => {
        console.error('Error tracking payment:', error);
      },
    });
  }

  private loadMockData(): void {
    // Simular datos de próximos pagos para el home
    setTimeout(() => {
      this.paymentStatus = {
        userId: 'user-123',
        cardId: 'card-456',
        service: {
          id: 1,
          categoria: 'Streaming',
          proveedor: 'Netflix',
          servicio: 'Plan Estándar',
          plan: 'Mensual',
          precio_mensual: 35000,
          detalles: 'Próximo pago programado',
          estado: 'Activo',
        },
        traceId: 'mock-trace-123',
        status: 'INITIAL',
        timestamp: new Date().toISOString(),
      };
    }, 1000);
  }

  getStatusMessage(): string {
    if (!this.paymentStatus) return 'Iniciando seguimiento...';

    switch (this.paymentStatus.status) {
      case 'INITIAL':
        return 'Procesando pago...';
      case 'IN_PROGRESS':
        return 'Validando transacción...';
      case 'FINISH':
        return 'Pago completado exitosamente';
      case 'FAILED':
        return this.paymentStatus.error || 'Error en el procesamiento';
      default:
        return 'Estado desconocido';
    }
  }

  getStatusClass(): string {
    if (!this.paymentStatus) return 'loading';

    switch (this.paymentStatus.status) {
      case 'FINISH':
        return 'success';
      case 'FAILED':
        return 'error';
      default:
        return 'processing';
    }
  }
}
