import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoginResponse } from '../models/loginResponse.interface';
import { User } from '../models/user.interface';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = environment.loginApiUrl;
  private readonly REGISTER_API_URL = environment.registerApiUrl;

  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  public isAuthenticated: Observable<boolean>;

  constructor(
    private router: Router,
    private http: HttpClient,
    private alertService: AlertService
  ) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();

    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(!!storedUser);
    this.isAuthenticated = this.isAuthenticatedSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get isAuthenticatedValue(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<LoginResponse>(this.API_URL, {
        email,
        password,
      })
      .pipe(
        map((response: LoginResponse) => {
          if (response && response.data && response.data.token) {
            const user: User = {
              email: response.data.user?.email || email,
              name: response.data.user?.name || email.split('@')[0],
              token: response.data.token,
            };
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            this.isAuthenticatedSubject.next(true);

            this.alertService.success('Successful login', `Welcome!, ${user.name}!`);
            return true;
          }
          console.error('La respuesta no contiene un token válido:', response);
          return false;
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 401:
          errorMessage = 'Invalid credentials. Please check your email and password.';
          break;
        case 403:
          errorMessage = 'Access denied.';
          break;
        case 404:
          errorMessage = 'Service not found.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = error.error?.message || `Server error: ${error.status}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  register(
    name: string,
    lastName: string,
    email: string,
    password: string,
    document: string
  ): Observable<boolean> {
    return this.http
      .post<any>(this.REGISTER_API_URL, {
        name,
        lastName,
        email,
        password,
        document,
      })
      .pipe(
        map((response: any) => {
          this.alertService.success(
            'Registration successful',
            'Your account has been created. Please login.'
          );
          return true;
        }),
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'Error registering. Please try again.';

          if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}`;
          } else {
            switch (error.status) {
              case 400:
                errorMessage = 'Invalid data. Please check the information entered.';
                break;
              case 409:
                errorMessage = 'This email is already registered.';
                break;
              case 500:
                errorMessage = 'Server error. Please try again later.';
                break;
              default:
                errorMessage = error.error?.message || `Server error: ${error.status}`;
            }
          }

          return throwError(() => new Error(errorMessage));
        })
      );
  }
}
