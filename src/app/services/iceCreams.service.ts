import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IceCreamService {

  private http:HttpClient  = inject(HttpClient); // Inyección correcta
  private readonly ApiUrl = 'http://localhost:3000/api/iceCream';
  constructor() { }

  createIceCreams(toppingsData: any) {
    return this.http.post(`${this.ApiUrl}/create`, toppingsData);


}}
