import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Service {
  id: number;
  name: string;
  provider: string;
  category: string;
  description: string;
  price: number;
  currency: string;
  period: string;
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-home2',
  imports: [CommonModule, FormsModule],
  templateUrl: './home2.html',
  styleUrl: './home2.css',
})
export class Home2 implements OnInit {
  searchTerm: string = '';
  selectedCategory: string = 'Todos';

  categories = [
    'Todos',
    'Streaming',
    'Música',
    'Cloud Storage',
    'Productividad',
    'Gaming',
    'Seguridad',
  ];

  services: Service[] = [
    {
      id: 1,
      name: 'Plan Estándar',
      provider: 'Netflix',
      category: 'Streaming',
      description: 'Acceso a contenido en HD, 2 pantallas simultáneas.',
      price: 35000,
      currency: '$',
      period: 'mes',
      status: 'active',
    },
    {
      id: 2,
      name: 'Premium Individual',
      provider: 'Spotify',
      category: 'Música',
      description: 'Sin anuncios, descargas offline, calidad alta.',
      price: 16900,
      currency: '$',
      period: 'mes',
      status: 'active',
    },
    {
      id: 3,
      name: 'Google One',
      provider: 'Google',
      category: 'Cloud Storage',
      description: 'Almacenamiento en la nube, backup automático.',
      price: 8900,
      currency: '$',
      period: 'mes',
      status: 'active',
    },
    {
      id: 4,
      name: 'Amazon Prime',
      provider: 'Prime Video',
      category: 'Streaming',
      description: 'Video streaming, envíos gratis en Amazon.',
      price: 12000,
      currency: '$',
      period: 'mes',
      status: 'inactive',
    },
    {
      id: 5,
      name: 'Office 365',
      provider: 'Microsoft',
      category: 'Productividad',
      description: 'Word, Excel, PowerPoint, OneDrive 1TB.',
      price: 25000,
      currency: '$',
      period: 'mes',
      status: 'active',
    },
    {
      id: 6,
      name: 'PlayStation Plus',
      provider: 'PlayStation',
      category: 'Gaming',
      description: 'Juegos gratis mensuales, multijugador online.',
      price: 35000,
      currency: '$',
      period: 'mes',
      status: 'active',
    },
    {
      id: 7,
      name: 'Apple Music',
      provider: 'Apple',
      category: 'Música',
      description: 'Música sin pérdida, audio espacial, Dolby Atmos.',
      price: 14900,
      currency: '$',
      period: 'mes',
      status: 'active',
    },
    {
      id: 8,
      name: 'VPN Premium',
      provider: 'NordVPN',
      category: 'Seguridad',
      description: 'Conexión segura y privada a internet.',
      price: 12000,
      currency: '$',
      period: 'mes',
      status: 'inactive',
    },
  ];

  filteredServices: Service[] = [];

  // Estadísticas calculadas
  get totalServices(): number {
    return this.services.length;
  }

  get activeServices(): number {
    return this.services.filter((s) => s.status === 'active').length;
  }

  get inactiveServices(): number {
    return this.services.filter((s) => s.status === 'inactive').length;
  }

  get totalCost(): number {
    return this.services
      .filter((s) => s.status === 'active')
      .reduce((total, service) => total + service.price, 0);
  }

  ngOnInit() {
    this.filterServices();
  }

  filterServices() {
    this.filteredServices = this.services.filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        service.provider.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory =
        this.selectedCategory === 'Todos' || service.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  onSearchChange() {
    this.filterServices();
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.filterServices();
  }

  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      Streaming: 'bg-blue-100/50 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200',
      Música: 'bg-pink-100/50 dark:bg-pink-900/50 text-pink-800 dark:text-pink-200',
      'Cloud Storage':
        'bg-indigo-100/50 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200',
      Productividad: 'bg-yellow-100/50 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200',
      Gaming: 'bg-purple-100/50 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200',
      Seguridad: 'bg-teal-100/50 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200',
    };
    return (
      colors[category] || 'bg-gray-100/50 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200'
    );
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO').format(price);
  }
}
