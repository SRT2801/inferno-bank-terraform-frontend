import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { User } from '../../models/user.interface';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input() title: string = 'Inferno Bank Services';
  @Input() icon: string = 'hub';
  @Input() showUserInfo: boolean = true;

  constructor(
    public authService: AuthService,
    private alertService: AlertService,
    private router: Router
  ) {}

  get currentUser(): User | null {
    return this.authService.currentUserValue;
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  logout(): void {
    this.alertService.confirm('¿Are you sure?', 'You will log out of Inferno Bank Services', () => {
      this.authService.logout();
      this.alertService.success('Logged out', 'You have successfully logged out');
    });
  }
}
