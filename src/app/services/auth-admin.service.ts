import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthServices {
  private apiUrl = 'https://api.crunchy-munch.com/api/superUserAuth';
  
  constructor(private http: HttpClient) { }
  
  // Login para usuarios normales
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('userRole', 'user');
          }
        })
      );
  }
  
  // Login para super usuarios
  adminLogin(userName: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/login`, { userName, password })
      .pipe(
        tap(response => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('userRole', 'superadmin');
            localStorage.setItem('adminUserName', userName); // Guardamos también el nombre de usuario
          }
        })
      );
  }
  
  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
  
  // Verificar si es un super usuario
  isSuperAdmin(): boolean {
    return localStorage.getItem('userRole') === 'superadmin';
  }
  
  // Método para cerrar sesión
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('adminUserName');
  }
  
  // Obtener el token actual
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  
  // Verificar específicamente si el admin está logueado (combina isAuthenticated e isSuperAdmin)
  isAdminLoggedIn(): boolean {
    return this.isAuthenticated() && this.isSuperAdmin();
  }
}
