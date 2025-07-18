import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToppingsService {
  private http: HttpClient = inject(HttpClient);
  private readonly ApiUrl = 'http://3.14.254.112:3000/api/topping';
  
  constructor() { }

  // Método existente
  createToppings(toppingsData: any) {
    return this.http.post(`${this.ApiUrl}/create`, toppingsData);
  }

  // Nuevos métodos para obtener datos
  getToppings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.ApiUrl}/getAll`);
  }

  getToppingById(id: string): Observable<any> {
    return this.http.get<any>(`${this.ApiUrl}/${id}`);
  }
}