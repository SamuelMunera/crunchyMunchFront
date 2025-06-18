import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private http: HttpClient = inject(HttpClient);
  private readonly ApiUrl = 'https://us-central1-crunchy-5694e.cloudfunctions.net/api/pedidos';

  constructor() { }

  // Método para crear un pedido
  createPedido(pedidoData: any): Observable<any> {
    return this.http.post<any>(`${this.ApiUrl}/create`, pedidoData);
  }

  // Método para obtener los pedidos del usuario actual
  obtenerPedidosPorUsuarioId(): Observable<any> {
    return this.http.get<any>(`${this.ApiUrl}/mis-pedidos`);
  }

  // Obtener pedido por ID
  getPedidoById(pedidoId: string): Observable<any> {
    return this.http.get<any>(`${this.ApiUrl}/${pedidoId}`);
  }

  // Actualizar comprobante de pago
  actualizarComprobantePago(pedidoId: string, comprobanteData: any): Observable<any> {
    return this.http.patch<any>(`${this.ApiUrl}/${pedidoId}/pago`, comprobanteData);
  }

  // Método para administradores - obtener todos los pedidos
  obtenerTodosPedidos(): Observable<any> {
    return this.http.get<any>(`${this.ApiUrl}/all-orders`);
  }

  // Método para actualizar el estado de un pedido
  actualizarEstadoPedido(pedidoId: string, nuevoEstado: string): Observable<any> {
    return this.http.patch<any>(`${this.ApiUrl}/${pedidoId}/estado`, { estado: nuevoEstado });
  }
}