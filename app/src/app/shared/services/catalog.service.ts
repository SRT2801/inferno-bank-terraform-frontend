import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Service } from "../models/service.interface";
import { environment } from "../../../environments/environment.prod";

@Injectable({
  providedIn: "root",
})
export class CatalogService {
  private readonly apiUrl = `${environment.apiUrl}/catalog`;

  constructor(private http: HttpClient) {}

  getCatalog(): Observable<Service[]> {
    return this.http.get<Service[]>(this.apiUrl);
  }
}
