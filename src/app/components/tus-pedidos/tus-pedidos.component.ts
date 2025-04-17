import { Component, OnInit } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { PedidoService } from '../../services/pedidos.service';
import { AuthService } from '../../services/auth.service';
import { ToppingsService } from '../../services/toppings.service';
import { IceCreamService } from '../../services/iceCreams.service';

@Component({
  selector: 'app-tus-pedidos',
  standalone: true,
  imports: [RouterLinkWithHref, CommonModule, DatePipe],
  templateUrl: './tus-pedidos.component.html',
  styleUrl: './tus-pedidos.component.css'
})
export class TusPedidosComponent implements OnInit {
  pedidos: any[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  responseData: any = null;
  toppings: any[] = [];
  iceCreams: any[] = [];

  constructor(
    private pedidoService: PedidoService,
    private authService: AuthService,
    private toppingsService: ToppingsService,
    private iceCreamService: IceCreamService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  // Añadir esta función para el trackBy
  trackByPedidoId(index: number, pedido: any): string {
    return pedido._id;
  }

  loadData(): void {
    this.cargarPedidos();
    this.cargarToppings();
    this.cargarIceCreams();
  }

  cargarToppings(): void {
    this.toppingsService.getToppings().subscribe({
      next: (data) => {
        this.toppings = data;
      },
      error: (err) => {
        console.error('Error al cargar toppings:', err);
      }
    });
  }

  cargarIceCreams(): void {
    this.iceCreamService.getIceCreams().subscribe({
      next: (data) => {
        this.iceCreams = data;
      },
      error: (err) => {
        console.error('Error al cargar sabores de helado:', err);
      }
    });
  }

  cargarPedidos(): void {
    this.isLoading = true;
    console.log('Cargando pedidos del usuario');
    
    // Usamos la ruta correcta que obtiene los pedidos del usuario autenticado
    this.pedidoService.obtenerPedidosPorUsuarioId().subscribe({
      next: (response) => {
        console.log('Respuesta recibida:', response);
        this.responseData = response;
        
        if (response.success) {
          if (response.pedidos && Array.isArray(response.pedidos)) {
            this.pedidos = response.pedidos;
            console.log(`Se cargaron ${this.pedidos.length} pedidos`);
          } else {
            console.warn('La respuesta no contiene un array de pedidos:', response);
            this.error = 'Formato de respuesta incorrecto';
          }
        } else {
          console.warn('La respuesta indica error:', response);
          this.error = response.message || 'No se pudieron cargar los pedidos';
        }
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error en la petición:', err);
        this.error = err.message || 'Error al cargar los pedidos. Por favor, intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  // Método para obtener la dirección completa
  getDireccionCompleta(pedido: any): string {
    if (pedido.informacionDeEntrega?.tipoPedido === 'domicilio') {
      return `${pedido.informacionDeEntrega.direccion || ''}, ${pedido.informacionDeEntrega.barrio || ''}, ${pedido.informacionDeEntrega.ciudad || ''}`;
    }
    return 'Recoger en tienda';
  }

  // Método para obtener la clase CSS según el estado del pedido
  getStatusClass(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'pendiente':
        return 'status-pendiente';
      case 'en preparación':
        return 'status-preparacion';
      case 'en camino':
        return 'status-camino';
      case 'entregado':
        return 'status-entregado';
      case 'cancelado':
        return 'status-cancelado';
      default:
        return '';
    }
  }
}