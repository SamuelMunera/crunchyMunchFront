import { Injectable, } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://api.crunchy-munch.com/api'; // Cambia esto a la URL de tu backend

  constructor(private http: HttpClient) { }

  createUsers(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/create`, userData);
  }
}
