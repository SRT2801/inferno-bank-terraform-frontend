export interface PaymentRequest {
  cardId: string;
  service: Service;
}

export interface PaymentResponse {
  traceId: string;
}

export interface PaymentStatus {
  userId: string;
  cardId: string;
  service: Service;
  traceId: string;
  status: "INITIAL" | "IN_PROGRESS" | "FAILED" | "FINISH";
  error?: string;
  timestamp: string;
}

export interface Service {
  id: number;
  categoria: string;
  proveedor: string;
  servicio: string;
  plan: string;
  precio_mensual: number;
  detalles: string;
  estado: string;
}
