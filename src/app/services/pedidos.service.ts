import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  crearPedido(pedido: any): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No hay token disponible para crear el pedido');
      return throwError(() => new Error('No estás autenticado. Por favor inicia sesión.'));
    }
  
    return this.http.post(`${this.apiUrl}/pedidos/create`, pedido)
      .pipe(
        tap(response => {
          console.log('Pedido creado exitosamente:', response);
        }),
        catchError(error => {
          console.error('Error al crear pedido:', error);
          return throwError(() => new Error(error.error?.message || 'Ha ocurrido un error al procesar tu solicitud'));
        })
      );
  }

  obtenerPedidosUsuario(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pedidos/usuario`)
      .pipe(
        catchError(error => {
          console.error('Error al obtener pedidos:', error);
          return throwError(() => new Error(error.error?.message || 'No se pudieron cargar los pedidos'));
        })
      );
  }

  obtenerPedidoPorId(pedidoId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/pedidos/${pedidoId}`)
      .pipe(
        catchError(error => {
          console.error('Error al obtener pedido:', error);
          return throwError(() => new Error(error.error?.message || 'No se pudo cargar el pedido'));
        })
      );
  }
  
}