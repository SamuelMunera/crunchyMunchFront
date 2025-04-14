import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthServices } from '../services/auth-admin.service';

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
};

export const adminAuthInterceptor = (
  request: HttpRequest<unknown>, 
  next: HttpHandlerFn
): Observable<any> => {
  const authService = inject(AuthServices);
  const router = inject(Router);
  
  const token = authService.getToken();
  
  if (token && request.url.includes('/admin')) {
    request = request.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        const currentToken = authService.getToken();
        const expired = !currentToken || isTokenExpired(currentToken);
        
        if (expired) {
          authService.logout();
          router.navigate(['/Admin Login']);
        }
      }
      return throwError(() => error);
    })
  );
};