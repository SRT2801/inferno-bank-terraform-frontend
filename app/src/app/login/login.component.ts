import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  showPassword: boolean = false;
  loading: boolean = false;
  error: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.error = '';

    if (!this.email || !this.password) {
      this.error = 'Por favor completa todos los campos';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.error = 'Por favor ingresa un email válido';
      return;
    }

    this.loading = true;
    this.authService.login(this.email, this.password).subscribe({
      next: (success) => {
        this.loading = false;
        console.log('Resultado del login:', success);
        if (success) {
          this.router.navigate(['/home']);
        } else {

          console.error('Login falló: la respuesta no contiene token');
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.message || 'Error al iniciar sesión. Por favor intenta de nuevo.';
        console.error('Error en login:', err);
      },
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  goToRegister(): void {

    console.log('Navegar a registro');
    
  }
}
