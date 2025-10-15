import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { AlertService } from '../shared/services/alert.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  animations: [
    trigger('rotateAnimation', [
      transition(':enter', [
        style({ transform: 'rotateY(90deg)', opacity: 0 }),
        animate('600ms ease-out', style({ transform: 'rotateY(0deg)', opacity: 1 })),
      ]),
    ]),
  ],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  showPassword: boolean = false;
  loading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.alertService.error('Validation Error', 'Please complete all fields');
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.alertService.error('Validation Error', 'Please enter a valid email');
      return;
    }

    this.loading = true;
    this.authService.login(this.email, this.password).subscribe({
      next: (success) => {
        this.loading = false;
        if (success) {
          this.router.navigate(['/home']);
        } else {
          this.alertService.error('Login Failed', 'The response does not contain a valid token');
        }
      },
      error: (err) => {
        this.loading = false;
        this.alertService.error(
          'Login Error',
          err.message || 'An error occurred. Please try again.'
        );
      },
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
