import { Component, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';
import { AlertService } from '../shared/services/alert.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('rotateAnimation', [
      transition(':enter', [
        style({ transform: 'rotateY(90deg)', opacity: 0 }),
        animate('600ms ease-out', style({ transform: 'rotateY(0deg)', opacity: 1 })),
      ]),
    ]),
  ],
})
export class LoginComponent implements OnDestroy {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  loading: boolean = false;

  // Validaciones en tiempo real
  emailTouched: boolean = false;
  passwordTouched: boolean = false;

  // Constantes para validación
  private readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private readonly MIN_PASSWORD_LENGTH = 6;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Getters para validación en tiempo real
  get isEmailValid(): boolean {
    return this.EMAIL_REGEX.test(this.email.trim());
  }

  get isPasswordValid(): boolean {
    return this.password.length >= this.MIN_PASSWORD_LENGTH;
  }

  get isFormValid(): boolean {
    return this.isEmailValid && this.isPasswordValid;
  }

  get showEmailError(): boolean {
    return this.emailTouched && this.email.length > 0 && !this.isEmailValid;
  }

  get showPasswordError(): boolean {
    return this.passwordTouched && this.password.length > 0 && !this.isPasswordValid;
  }

  /**
   * Marca el campo de email como tocado para mostrar validaciones
   */
  onEmailBlur(): void {
    this.emailTouched = true;
    this.cdr.markForCheck();
  }

  /**
   * Marca el campo de contraseña como tocado para mostrar validaciones
   */
  onPasswordBlur(): void {
    this.passwordTouched = true;
    this.cdr.markForCheck();
  }

  /**
   * Alterna la visibilidad de la contraseña
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Maneja el envío del formulario con validaciones optimizadas
   */
  onSubmit(): void {
    // Marcar todos los campos como tocados para mostrar errores
    this.emailTouched = true;
    this.passwordTouched = true;

    // Validación de campos vacíos
    if (!this.email.trim() || !this.password) {
      this.alertService.error('Validation Error', 'Please complete all fields');
      this.cdr.markForCheck();
      return;
    }

    // Validación de formato de email
    if (!this.isEmailValid) {
      this.alertService.error('Validation Error', 'Please enter a valid email address');
      this.cdr.markForCheck();
      return;
    }

    // Validación de longitud de contraseña
    if (!this.isPasswordValid) {
      this.alertService.error(
        'Validation Error',
        `Password must be at least ${this.MIN_PASSWORD_LENGTH} characters long`
      );
      this.cdr.markForCheck();
      return;
    }

    this.performLogin();
  }

  /**
   * Realiza el proceso de login con gestión de subscripciones
   */
  private performLogin(): void {
    this.loading = true;
    this.cdr.markForCheck();

    this.authService
      .login(this.email.trim(), this.password)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (success) => {
          this.loading = false;

          if (success) {
            // Limpiar el formulario por seguridad
            this.clearForm();
            this.router.navigate(['/home']);
          } else {
            this.alertService.error('Login Failed', 'The response does not contain a valid token');
            this.cdr.markForCheck();
          }
        },
        error: (err) => {
          this.loading = false;
          this.alertService.error(
            'Login Error',
            err.message || 'An error occurred. Please try again.'
          );
          this.cdr.markForCheck();
        },
      });
  }

  /**
   * Limpia el formulario (útil después de un login exitoso)
   */
  private clearForm(): void {
    this.password = ''; // Limpiar contraseña por seguridad
    this.emailTouched = false;
    this.passwordTouched = false;
  }

  /**
   * Navega a la página de registro
   */
  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
