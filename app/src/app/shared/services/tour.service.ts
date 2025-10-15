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
      nextBtnText: 'Siguiente',
      prevBtnText: 'Anterior',
      doneBtnText: 'Finalizar',
      animate: true,
      smoothScroll: true,
      steps: [
        {
          element: '#catalog-section',
          popover: {
            title: '¡Bienvenido! 🎉',
            description: 'Aquí encontrarás todos los servicios disponibles.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#cost-section',
          popover: {
            title: 'Estadísticas 📊',
            description: 'Resumen de servicios y costos totales.',
            side: 'left',
            align: 'start',
          },
        },
        {
          element: '#filter-section',
          popover: {
            title: 'Filtros 🔍',
            description: 'Filtra servicios por categoría.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#services-grid',
          popover: {
            title: 'Servicios 💼',
            description: 'Haz clic para ver detalles.',
            side: 'top',
            align: 'center',
          },
        },
        {
          element: '#user-profile',
          popover: {
            title: 'Perfil 👤',
            description: 'Accede a tu perfil y cierra sesión aquí.',
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
