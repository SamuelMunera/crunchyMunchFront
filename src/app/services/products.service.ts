import { Injectable,inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
private http = inject(HttpClient);
  private readonly ApiUrl = 'http://localhost:3000/api/product';
  
 constructor() {}

 getAllProducts() {
   return this.http.get(`${this.ApiUrl}/getAll`);
 }
  
}
