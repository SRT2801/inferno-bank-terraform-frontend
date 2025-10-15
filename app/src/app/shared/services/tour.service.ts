import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TourService {
  private driverObj: any = null;

  constructor() {}

  async startHomeTour(): Promise<void> {
    const { driver } = await import('driver.js');

    this.driverObj = driver({
      showProgress: true,
      showButtons: ['next', 'previous', 'close'],
      nextBtnText: 'Next',
      prevBtnText: 'Previous',
      doneBtnText: 'Done',
      animate: true,
      smoothScroll: true,
      steps: [
        {
          element: '#catalog-section',
          popover: {
            title: 'Welcome to Your Service Catalog! 🎉',
            description:
              'This is your central dashboard where you can manage all your digital services and subscriptions. Get a quick overview of your total services, active subscriptions, and monthly costs.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#cost-section',
          popover: {
            title: 'Service Statistics 📊',
            description:
              'View your service metrics at a glance: Total number of services, active subscriptions, inactive services, and total monthly cost. These cards update in real-time as you manage your services.',
            side: 'left',
            align: 'start',
          },
        },
        {
          element: '#filter-section',
          popover: {
            title: 'Search & Filter Tools 🔍',
            description:
              'Use the search bar to find specific services by name, provider, or plan. Filter by category to organize and view your services by type (Internet, TV, Streaming, etc.).',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#services-grid',
          popover: {
            title: 'Your Services Grid 💼',
            description:
              'Browse all your services displayed as cards. Each card shows the service details, provider, plan, monthly price, and status. Click on any service card to view more information or manage it.',
            side: 'top',
            align: 'center',
          },
        },
        {
          element: '#user-profile',
          popover: {
            title: 'User Profile & Account 👤',
            description:
              "View your account information here. Click the logout button to securely sign out of your account when you're finished managing your services.",
            side: 'left',
            align: 'start',
          },
        },
      ],
      onDestroyStarted: () => {
        if (this.driverObj) {
          this.driverObj.destroy();
        }
      },
    });

    this.driverObj.drive();
  }

  stopTour(): void {
    if (this.driverObj) {
      this.driverObj.destroy();
      this.driverObj = null;
    }
  }
}
