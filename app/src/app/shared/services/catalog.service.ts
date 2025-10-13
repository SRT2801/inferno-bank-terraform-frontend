import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Service} from '../models/service.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  constructor(private http: HttpClient) {}

  getCatalog(): Observable<Service[]> {
    return this.http.get<any>(environment.catalogApiUrl).pipe(
      map((response: any) => {
        const items = response.response.data.items;
        return items.map((item: any) => this.mapApiDataToService(item));
      })
    );
  }

  private mapApiDataToService(apiData: any): Service {
    return {
      id: apiData.ID,
      categoria: apiData.Categoría,
      proveedor: apiData.Proveedor,
      servicio: apiData.Servicio,
      plan: apiData.Plan,
      precioMensual: apiData['Precio mensual'],
      velocidadDetalles: apiData['Velocidad/Detalles'],
      estado: apiData.Estado
    };
  }
}
