import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const userAuthInterceptor = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<any> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const token = authService.getToken();
  console.log('Token antes de la petición:', token ? 'Token presente' : 'Token ausente');
  
  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
      
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si el servidor responde con 401, significa que el token no es válido o ha expirado
      if (error.status === 401) {
        console.log('Error 401 interceptado:', error.error?.message || 'Usuario no autenticado');
                
        // Limpiar la sesión y redirigir al login
        authService.logout();
        router.navigate(['/Login'], {
          queryParams: {
            returnUrl: router.url,
            expired: 'true'
          }
        });
      }
      return throwError(() => error);
    })
  );
};