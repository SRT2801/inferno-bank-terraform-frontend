import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProfileService } from '../shared/services/profile.service';
import { ProfileData, Card } from '../shared/models/profile.interface';
import { AlertService } from '../shared/services/alert.service';
import { AuthService } from '../shared/services/auth.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
  ],
})
export class ProfileComponent implements OnInit {
  profileData: ProfileData | null = null;
  loading: boolean = true;

  constructor(
    private profileService: ProfileService,
    private alertService: AlertService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.profileService.getProfile().subscribe({
      next: (response) => {
        this.profileData = response.data;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.alertService.error('Error', 'Failed to load profile data. Please try again.');
        console.error('Profile loading error:', error);
      },
    });
  }

  getCardStatusColor(status: string): string {
    switch (status) {
      case 'ACTIVATED':
        return 'text-green-400';
      case 'PENDING':
        return 'text-yellow-400';
      case 'BLOCKED':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  }

  getCardTypeIcon(type: string): string {
    return type === 'CREDIT' ? 'credit_card' : 'account_balance_wallet';
  }

  formatBalance(balance: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(balance);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(
      () => {
        this.alertService.success('Copied!', 'Card ID copied to clipboard');
      },
      (err) => {
        console.error('Could not copy text: ', err);
        this.alertService.error('Error', 'Failed to copy to clipboard');
      }
    );
  }
}
