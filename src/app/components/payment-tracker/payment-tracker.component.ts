import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { PaymentService } from "../../../../app/src/app/shared/services/payment.service";
import { PaymentStatus } from "../../../../app/src/app/shared/models/payment.interface";

@Component({
  selector: "app-payment-tracker",
  templateUrl: "./payment-tracker.component.html",
  styleUrl: "./payment-tracker.component.css",
})
export class PaymentTrackerComponent implements OnInit, OnDestroy {
  @Input() traceId!: string;

  paymentStatus: PaymentStatus | null = null;
  private subscription?: Subscription;

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    if (this.traceId) {
      this.startTracking();
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private startTracking(): void {
    this.subscription = this.paymentService
      .trackPayment(this.traceId)
      .subscribe({
        next: (status) => {
          this.paymentStatus = status;
        },
        error: (error) => {
          console.error("Error tracking payment:", error);
        },
      });
  }

  getStatusMessage(): string {
    if (!this.paymentStatus) return "Iniciando seguimiento...";

    switch (this.paymentStatus.status) {
      case "INITIAL":
        return "Procesando pago...";
      case "IN_PROGRESS":
        return "Validando transacción...";
      case "FINISH":
        return "Pago completado exitosamente";
      case "FAILED":
        return this.paymentStatus.error || "Error en el procesamiento";
      default:
        return "Estado desconocido";
    }
  }

  getStatusClass(): string {
    if (!this.paymentStatus) return "loading";

    switch (this.paymentStatus.status) {
      case "FINISH":
        return "success";
      case "FAILED":
        return "error";
      default:
        return "processing";
    }
  }
}
