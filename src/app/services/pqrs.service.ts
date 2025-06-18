import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PqrsService {
  
  private http: HttpClient = inject(HttpClient); // Inyección correcta
  private readonly ApiUrl = 'https://us-central1-crunchy-5694e.cloudfunctions.net/api/pqrs';

  constructor() {}

  createPqrs(pqrsData: any) {
    return this.http.post(`${this.ApiUrl}/create`, pqrsData);
  }
}
 