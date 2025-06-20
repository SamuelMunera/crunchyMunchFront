import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IceCreamService {
  private http: HttpClient = inject(HttpClient);
  private readonly ApiUrl = 'https://us-central1-crunchy-5694e.cloudfunctions.net/api/iceCream';
  
  constructor() { }

  // Método existente
  createIceCreams(iceCreamData: any) {
    return this.http.post(`${this.ApiUrl}/create`, iceCreamData);
  }

  // Nuevos métodos para obtener datos
  getIceCreams(): Observable<any[]> {
    return this.http.get<any[]>(`${this.ApiUrl}/getAll`);
  }

  getIceCreamById(id: string): Observable<any> {
    return this.http.get<any>(`${this.ApiUrl}/${id}`);
  }
}