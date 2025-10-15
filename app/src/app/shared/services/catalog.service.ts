import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, shareReplay, catchError } from 'rxjs/operators';
import { Service } from '../models/service.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  private cache$: Observable<Service[]> | null = null;
  private cacheTime: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000;

  constructor(private http: HttpClient) {}

  getCatalog(): Observable<Service[]> {
    const now = Date.now();

    if (this.cache$ && now - this.cacheTime < this.CACHE_DURATION) {
      return this.cache$;
    }

    this.cache$ = this.http.get<any>(environment.catalogApiUrl).pipe(
      map((response: any) => {
        const items = response.response.data.items;
        return items.map((item: any) => this.mapApiDataToService(item));
      }),
      shareReplay(1),
      catchError((error) => {
        console.error('Error fetching catalog:', error);
        this.cache$ = null;
        throw error;
      })
    );

    this.cacheTime = now;
    return this.cache$;
  }

  clearCache(): void {
    this.cache$ = null;
    this.cacheTime = 0;
  }

  private mapApiDataToService(apiData: any): Service {
    return {
      id: apiData.ID,
      categoria: apiData.Categoría,
      proveedor: apiData.Proveedor,
      servicio: apiData.Servicio,
      plan: apiData.Plan,
      precioMensual: apiData['Precio Mensual'],
      velocidadDetalles: apiData['Velocidad/Detalles'],
      estado: apiData.Estado,
    };
  }
}
