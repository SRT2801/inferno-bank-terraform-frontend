import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Service } from "../../../../app/src/app/shared/models/service.interface";

@Component({
  selector: "app-service-card",
  templateUrl: "./service-card.component.html",
  styleUrl: "./service-card.component.css",
})
export class ServiceCardComponent {
  @Input() service!: Service;
  @Input() disabled: boolean = false;
  @Output() selectService = new EventEmitter<Service>();

  onSelectService(): void {
    if (!this.disabled) {
      this.selectService.emit(this.service);
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  }
}
