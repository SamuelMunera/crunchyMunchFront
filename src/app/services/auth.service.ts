import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface User {
  id: string;
  email: string;
  name: string;
  lastName: string;
  phone: number;
  role?: string;
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
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Recuperar datos del usuario del localStorage al iniciar el servicio
    this.checkStoredSession();
  }

  private checkStoredSession(): void {
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      this.currentUserSubject.next(JSON.parse(storedUser));
      this.tokenSubject.next(storedToken);
      console.log('Sesión recuperada del localStorage');
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          if (!response.token) {
            console.error('Error: Respuesta de login no incluye token');
            return;
          }
          
          localStorage.setItem('token', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          
          console.log('Login exitoso, token almacenado');
          
          this.currentUserSubject.next(response.user);
          this.tokenSubject.next(response.token);
        })
      );
  }
  verificarToken(): Observable<any> {
    return this.http.get(`${this.apiUrl}/validate-token`)
      .pipe(
        catchError(error => {
          console.error('Error validando token:', error);
          this.logout(); // Si el token no es válido, desloguear al usuario
          return throwError(() => new Error('Token inválido o expirado'));
        })
      );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);

    this.router.navigate(['/Login']);
  }

  getToken(): string | null {
    const token = localStorage.getItem('token');
    return token || this.tokenSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  updateUserProfile(userData: Partial<User>): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, userData)
      .pipe(
        tap(response => {
          const currentUser = this.getCurrentUser();
          if (currentUser) {
            const updatedUser: User = {
              ...currentUser,
              ...userData
            };
            
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            this.currentUserSubject.next(updatedUser);
          }
        })
      );
  }
}