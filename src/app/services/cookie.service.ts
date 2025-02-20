import { Injectable,inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 


@Injectable({
  providedIn: 'root'
})
export class CookieService {

  private http = inject(HttpClient);
  private readonly ApiUrl = 'http://localhost:3000/api/cookie';
  
 constructor() {}

 getAllCookies() {
   return this.http.get(`${this.ApiUrl}/getAll`);
 }
}
