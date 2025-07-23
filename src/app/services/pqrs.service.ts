import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PqrsService {
  
  private http: HttpClient = inject(HttpClient); // Inyección correcta
  private readonly ApiUrl = 'http://api.crunchy-munch.com/api/pqrs';

  constructor() {}

  createPqrs(pqrsData: any) {
    return this.http.post(`${this.ApiUrl}/create`, pqrsData);
  }
}
 