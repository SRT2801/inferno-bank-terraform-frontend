import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProfileResponse } from '../models/profile.interface';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly API_URL = environment.profileApiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getProfile(): Observable<ProfileResponse> {
    const currentUser = this.authService.currentUserValue;

    if (!currentUser || !currentUser.token) {
      return throwError(() => new Error('No authentication token found'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${currentUser.token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get<ProfileResponse>(this.API_URL, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching profile:', error);
        return throwError(() => error);
      })
    );
  }
}
