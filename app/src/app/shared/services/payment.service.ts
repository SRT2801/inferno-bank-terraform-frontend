import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  PaymentRequest,
  PaymentResponse,
  PaymentStatusResponse,
} from '../models/payment.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private readonly paymentApiUrl = environment.paymentApiUrl;
  private readonly paymentStatusApiUrl = environment.paymentStatusApiUrl;

  constructor(private http: HttpClient) {}

  initiatePayment(paymentRequest: PaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(this.paymentApiUrl, paymentRequest);
  }

  checkPaymentStatus(traceId: string): Observable<PaymentStatusResponse> {
    return this.http.get<PaymentStatusResponse>(`${this.paymentStatusApiUrl}/${traceId}`);
  }
}
