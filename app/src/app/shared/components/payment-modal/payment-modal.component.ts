import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Service } from '../../models/service.interface';
import { PaymentService } from '../../services/payment.service';
import { AlertService } from '../../services/alert.service';
import { PaymentStatusType } from '../../models/payment.interface';

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.css'],
})
export class PaymentModalComponent implements OnInit, OnChanges, OnDestroy {
  @Input() service: Service | null = null;
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() paymentSuccess = new EventEmitter<{ traceId: string; service: Service }>();
  @ViewChild('modalContent') modalContent?: ElementRef;

  cardId: string = '';
  isProcessing: boolean = false;
  showSuccess: boolean = false;
  traceId: string = '';
  isClosing: boolean = false;
  paymentStatusMessage: string = '';
  private statusCheckInterval: any;

  constructor(
    private paymentService: PaymentService,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      if (changes['isOpen'].currentValue) {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = `-${window.scrollY}px`;

        setTimeout(() => {
          const modalElement = document.querySelector('.modal-scroll-container') as HTMLElement;
          if (modalElement) {
            modalElement.scrollTop = 0;
          }
        }, 100);
      } else {
        const scrollY = document.body.style.top;

        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';

        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
      }
    }
  }

  onClose(): void {
    if (!this.isProcessing && !this.isClosing) {
      this.isClosing = true;

      const modalElement = document.querySelector('.modal-scroll-container') as HTMLElement;
      const overlayElement = document.querySelector('.modal-overlay') as HTMLElement;

      if (modalElement) {
        modalElement.classList.add('closing');
      }
      if (overlayElement) {
        overlayElement.classList.add('closing');
      }

      setTimeout(() => {
        this.isClosing = false;
        this.resetForm();

        const scrollY = document.body.style.top;
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';

        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }

        if (modalElement) {
          modalElement.classList.remove('closing');
        }
        if (overlayElement) {
          overlayElement.classList.remove('closing');
        }

        this.closeModal.emit();
      }, 300);
    }
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  processPayment(): void {
    if (!this.service || !this.cardId.trim()) {
      this.alertService.error('Please enter the card ID to proceed with the payment');
      return;
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(this.cardId.trim())) {
      this.alertService.error('The card ID format is not valid');
      return;
    }

    this.isProcessing = true;

    const precioMensual =
      typeof this.service.precioMensual === 'string'
        ? parseFloat(this.service.precioMensual.replace(/[^0-9.-]+/g, ''))
        : this.service.precioMensual;

    const paymentRequest = {
      cardId: this.cardId.trim(),
      service: {
        id: this.service.id,
        categoria: this.service.categoria,
        proveedor: this.service.proveedor,
        servicio: this.service.servicio,
        plan: this.service.plan,
        precio_mensual: precioMensual,
        detalles: this.service.velocidadDetalles,
        estado: this.service.estado,
      },
    };

    this.paymentService.initiatePayment(paymentRequest).subscribe({
      next: (response) => {
        this.traceId = response.traceId;
        this.paymentStatusMessage = 'Procesando pago...';

        // Iniciar el polling del estado del pago
        this.checkPaymentStatus(response.traceId);
      },
      error: (error) => {
        this.isProcessing = false;
        this.showSuccess = false; // ✅ Asegurar que showSuccess esté en false
        this.paymentStatusMessage = '';
        this.traceId = ''; // ✅ Limpiar traceId también

        // ✅ Forzar detección de cambios para actualizar la vista
        this.cdr.detectChanges();

        console.error('Error processing payment:', error);

        // Mensajes de error más específicos según el código de estado
        let errorTitle = 'Error al procesar el pago';
        let errorMessage = 'Por favor intenta nuevamente.';

        if (error.status === 502) {
          errorTitle = 'Servicio temporalmente no disponible';
          errorMessage =
            'El servidor de pagos está experimentando problemas. Por favor, intenta nuevamente en unos momentos.';
        } else if (error.status === 400) {
          errorTitle = 'Datos de pago inválidos';
          errorMessage = error.error?.message || 'Verifica que el Card ID sea correcto.';
        } else if (error.status === 401 || error.status === 403) {
          errorTitle = 'No autorizado';
          errorMessage =
            'No tienes permisos para realizar este pago. Por favor, inicia sesión nuevamente.';
        } else if (error.status === 404) {
          errorTitle = 'Servicio no encontrado';
          errorMessage = 'El servicio seleccionado no está disponible.';
        } else if (error.status === 0) {
          errorTitle = 'Error de conexión';
          errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }

        this.alertService.error(errorTitle, errorMessage);
      },
    });
  }

  checkPaymentStatus(traceId: string): void {
    let attempts = 0;
    const maxAttempts = 20; // Máximo 20 intentos (40 segundos)

    this.statusCheckInterval = setInterval(() => {
      attempts++;

      this.paymentService.checkPaymentStatus(traceId).subscribe({
        next: (statusResponse) => {
          this.paymentStatusMessage = this.getStatusMessage(statusResponse.status);

          switch (statusResponse.status) {
            case 'FINISH':
              clearInterval(this.statusCheckInterval);
              this.isProcessing = false;
              this.showSuccess = true;
              this.alertService.success(
                '¡Pago completado exitosamente!',
                `ID de seguimiento: ${traceId.substring(0, 8)}...`
              );

              this.paymentSuccess.emit({
                traceId: traceId,
                service: this.service!,
              });

              setTimeout(() => {
                this.onClose();
              }, 3000);
              break;

            case 'FAILED':
              clearInterval(this.statusCheckInterval);
              this.isProcessing = false;
              this.showSuccess = false;
              this.paymentStatusMessage = '';
              this.traceId = '';

              // ✅ Forzar detección de cambios
              this.cdr.detectChanges();

              this.alertService.error(
                'El pago ha fallado',
                'Por favor, verifica los datos e intenta nuevamente.'
              );
              // No cerrar el modal, permitir que el usuario reintente
              break;

            case 'INITIAL':
              this.paymentStatusMessage = 'Iniciando proceso de pago...';
              break;

            case 'IN_PROGRESS':
              this.paymentStatusMessage = 'Procesando tu pago...';
              break;
          }

          // Si llegamos al máximo de intentos sin completar
          if (attempts >= maxAttempts && statusResponse.status !== 'FINISH') {
            clearInterval(this.statusCheckInterval);
            this.isProcessing = false;
            this.showSuccess = false;
            this.paymentStatusMessage = '';
            this.traceId = '';

            // ✅ Forzar detección de cambios
            this.cdr.detectChanges();

            this.alertService.error(
              'Tiempo de espera agotado',
              'El pago está tomando más tiempo del esperado. Por favor, intenta nuevamente.'
            );
            // No cerrar el modal, permitir que el usuario reintente
          }
        },
        error: (error) => {
          console.error('Error checking payment status:', error);

          // Si hay error pero no hemos alcanzado el máximo de intentos, continuar
          if (attempts >= maxAttempts) {
            clearInterval(this.statusCheckInterval);
            this.isProcessing = false;
            this.showSuccess = false;
            this.paymentStatusMessage = '';
            this.traceId = '';

            // ✅ Forzar detección de cambios
            this.cdr.detectChanges();

            this.alertService.error(
              'Error al verificar el estado del pago',
              'Por favor, verifica los datos e intenta nuevamente.'
            );
            // No cerrar el modal, permitir que el usuario reintente
          }
        },
      });
    }, 2000); // Verificar cada 2 segundos
  }

  getStatusMessage(status: PaymentStatusType): string {
    const messages: Record<PaymentStatusType, string> = {
      INITIAL: '⏳ Iniciando proceso de pago...',
      IN_PROGRESS: '🔄 Procesando tu pago...',
      FAILED: '❌ El pago ha fallado',
      FINISH: '✅ ¡Pago completado exitosamente!',
    };
    return messages[status] || 'Verificando estado...';
  }

  resetForm(): void {
    this.cardId = '';
    this.isProcessing = false;
    this.showSuccess = false;
    this.traceId = '';
    this.paymentStatusMessage = '';

    // Limpiar el intervalo si existe
    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval);
      this.statusCheckInterval = null;
    }
  }

  ngOnDestroy(): void {
    // Limpiar el intervalo cuando se destruye el componente
    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval);
    }
  }

  formatPrice(price: string | number): string {
    const numPrice =
      typeof price === 'string' ? parseFloat(price.replace(/[^0-9.-]+/g, '')) : price;

    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice);
  }
}
