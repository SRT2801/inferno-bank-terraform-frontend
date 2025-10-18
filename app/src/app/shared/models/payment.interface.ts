export type PaymentStatusType = 'INITIAL' | 'IN_PROGRESS' | 'FAILED' | 'FINISH';

export interface ServiceDetails {
  id: number;
  categoria: string;
  proveedor: string;
  servicio: string;
  plan: string;
  precio_mensual: number;
  detalles: string;
  estado: string;
}

export interface PaymentRequest {
  cardId: string;
  service: ServiceDetails;
}

export interface PaymentResponse {
  message: string;
  traceId: string;
}

export interface PaymentStatusResponse {
  message: string;
  status: PaymentStatusType;
}

export interface PaymentStatus {
  userId: string;
  cardId: string;
  service: ServiceDetails;
  traceId: string;
  status: PaymentStatusType;
  error?: string;
  timestamp: string;
}
