import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, switchMap, takeWhile } from 'rxjs';
import { PaymentRequest, PaymentResponse, PaymentStatus } from '../models/payment.interface';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {

  private readonly paymentApiUrl = 'https://tu-api-de-pagos.com/payment';

  constructor(private http: HttpClient) {}

  initiatePayment(paymentRequest: PaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(this.paymentApiUrl, paymentRequest);
  }

  getPaymentStatus(traceId: string): Observable<PaymentStatus> {
    return this.http.get<PaymentStatus>(`${this.paymentApiUrl}/status/${traceId}`);
  }

  trackPayment(traceId: string): Observable<PaymentStatus> {
    return interval(3000).pipe(
      switchMap(() => this.getPaymentStatus(traceId)),
      takeWhile((status) => status.status === 'INITIAL' || status.status === 'IN_PROGRESS', true)
    );
  }
}
