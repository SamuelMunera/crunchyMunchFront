import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthServices } from '../services/auth-admin.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(
    private authService: AuthServices,
    private router: Router
  ) {}
  
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Obtener el token
    const token = this.authService.getToken();
    
    // Si hay un token, añadirlo al header de la solicitud
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    
    // Continuar con la solicitud modificada
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Si es un error 401 (no autorizado), redirigir al login correspondiente
        if (error.status === 401) {
          this.authService.logout();
          
          // Redirigir según el tipo de usuario (admin o normal)
          if (this.authService.isSuperAdmin()) {
            this.router.navigate(['/admin-login']);
          } else {
            this.router.navigate(['/login']);
          }
        }
        return throwError(() => error);
      })
    );
  }
}