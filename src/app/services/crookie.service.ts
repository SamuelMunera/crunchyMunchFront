import { Injectable,inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CrookieService {

  private http = inject(HttpClient);
    private readonly ApiUrl = 'http://localhost:3000/api/crookie';
    
   constructor() {}
  
   getAllCrookies() {
     return this.http.get(`${this.ApiUrl}/getAll`);
   }
}
