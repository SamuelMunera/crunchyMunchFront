import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private http = inject(HttpClient);
  private readonly ApiUrl = 'http://3.14.254.112:3000/api/product';
  
  constructor() {}

  getAllProducts() {
    return this.http.get(`${this.ApiUrl}/getAll`);
  }
  
  getProductById(id: string) {
    return this.http.get(`${this.ApiUrl}/getById/${id}`);
  }
}