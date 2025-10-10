import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, switchMap, takeWhile } from 'rxjs';
import { PaymentRequest, PaymentResponse, PaymentStatus } from '../models/payment.interface';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  initiatePayment(paymentRequest: PaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.apiUrl}/payment`, paymentRequest);
  }

  getPaymentStatus(traceId: string): Observable<PaymentStatus> {
    return this.http.get<PaymentStatus>(`${this.apiUrl}/payment/status/${traceId}`);
  }

  trackPayment(traceId: string): Observable<PaymentStatus> {
    return interval(environment.pollingInterval).pipe(
      switchMap(() => this.getPaymentStatus(traceId)),
      takeWhile((status) => status.status === 'INITIAL' || status.status === 'IN_PROGRESS', true)
    );
  }
}
