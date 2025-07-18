import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
private http = inject(HttpClient);
  private readonly ApiUrl = 'http://3.14.254.112:3000/api/category';
  
 constructor() {}

 getAllCategory() {
   return this.http.get(`${this.ApiUrl}/getAll`);
 }
  
}
