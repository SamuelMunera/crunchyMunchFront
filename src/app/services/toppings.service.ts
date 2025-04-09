import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ToppingsService {

  private http:HttpClient  = inject(HttpClient); // Inyección correcta
  private readonly ApiUrl = 'http://localhost:3000/api/topping';
  constructor() { }

  createToppings(toppingsData: any) {
    return this.http.post(`${this.ApiUrl}/create`, toppingsData);


}}
