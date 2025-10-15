import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { AlertService } from '../shared/services/alert.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  animations: [
    trigger('rotateAnimation', [
      transition(':enter', [
        style({ transform: 'rotateY(90deg)', opacity: 0 }),
        animate('600ms ease-out', style({ transform: 'rotateY(0deg)', opacity: 1 })),
      ]),
    ]),
  ],
})
export class RegisterComponent {
  name: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  document: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  loading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (
      !this.name ||
      !this.lastName ||
      !this.email ||
      !this.password ||
      !this.confirmPassword ||
      !this.document
    ) {
      this.alertService.error('Error', 'Please complete all fields');
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.alertService.error('Error', 'Please enter a valid email');
      return;
    }

    if (this.password.length < 6) {
      this.alertService.error('Error', 'Password must be at least 6 characters');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.alertService.error('Error', 'Passwords do not match');
      return;
    }

    if (!this.isValidDocument(this.document)) {
      this.alertService.error('Error', 'Document must contain only numbers');
      return;
    }

    this.loading = true;
    this.authService
      .register(this.name, this.lastName, this.email, this.password, this.document)
      .subscribe({
        next: (success) => {
          this.loading = false;
          if (success) {
            this.router.navigate(['/login']);
          }
        },
        error: (err) => {
          this.loading = false;
          this.alertService.error(
            'Registration Error',
            err.message || 'An error occurred. Please try again.'
          );
        },
      });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidDocument(document: string): boolean {
    const documentRegex = /^\d+$/;
    return documentRegex.test(document);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
