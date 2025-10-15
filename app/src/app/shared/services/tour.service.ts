import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TourService {
  private driverObj: any = null;

  constructor() {}

  async startHomeTour(): Promise<void> {
    // Lazy load driver.js solo cuando se necesita
    const { driver } = await import('driver.js');

    this.driverObj = driver({
      showProgress: true,
      showButtons: ['next', 'previous', 'close'],
      nextBtnText: 'Siguiente',
      prevBtnText: 'Anterior',
      doneBtnText: 'Finalizar',
      steps: [
        {
          element: '#catalog-section',
          popover: {
            title: '¡Bienvenido a Nuestra Aplicación! 🎉',
            description:
              'En esta sección podrás encontrar todos los servicios disponibles que tenemos para ti. Explora y encuentra el servicio perfecto para tus necesidades.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#cost-section',
          popover: {
            title: 'Panel de Estadísticas 📊',
            description:
              'Aquí puedes ver un resumen de tus servicios: total de servicios, servicios activos, inactivos y el costo total mensual de todos tus servicios contratados.',
            side: 'left',
            align: 'start',
          },
        },
        {
          element: '#filter-section',
          popover: {
            title: 'Filtros de Búsqueda 🔍',
            description:
              'Utiliza estos filtros para encontrar rápidamente el servicio que buscas. Puedes filtrar por categoría, precio y más.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#services-grid',
          popover: {
            title: 'Servicios Disponibles 💼',
            description:
              'Aquí encontrarás todos nuestros servicios. Haz clic en cualquier tarjeta para ver más detalles y contratar.',
            side: 'top',
            align: 'center',
          },
        },
        {
          element: '#user-profile',
          popover: {
            title: 'Tu Perfil de Usuario 👤',
            description:
              'Desde aquí puedes acceder a tu perfil, ver tu información personal y cerrar sesión cuando termines de usar la aplicación.',
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
