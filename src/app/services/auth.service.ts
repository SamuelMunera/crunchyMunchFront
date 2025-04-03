import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

// Interfaces para tipar los datos
interface User {
  id: string;
  email: string;
  name: string;
  lastName: string;
  phone: number;
}

interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();
  private tokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {
    // Recuperar datos del usuario del localStorage al iniciar el servicio
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      this.currentUserSubject.next(JSON.parse(storedUser));
      this.tokenSubject.next(storedToken);
    }
  }

  // Método para iniciar sesión
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          // Guardar el token y el usuario en localStorage
          localStorage.setItem('token', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          
          // Actualizar los BehaviorSubjects
          this.currentUserSubject.next(response.user);
          this.tokenSubject.next(response.token);
        })
      );
  }

  // Método para cerrar sesión
  logout(): void {
    // Eliminar datos del localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    
    // Actualizar los BehaviorSubjects
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
  }

  // Obtener el token actual
  getToken(): string | null {
    return this.tokenSubject.value;
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.tokenSubject.value;
  }

  // Obtener el usuario actual
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}