import { Component, OnInit } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidoService } from '../../services/pedidos.service';
import { AuthService } from '../../services/auth.service';
import { ToppingsService } from '../../services/toppings.service';
import { IceCreamService } from '../../services/iceCreams.service';

@Component({
  selector: 'app-admin-pedidos',
  standalone: true,
  imports: [RouterLinkWithHref, CommonModule, DatePipe, FormsModule],
  templateUrl: './pedidos-activos.component.html',
  styleUrl: './pedidos-activos.component.css'
})
export class PedidosActivosComponent implements OnInit {
  allPedidos: any[] = []; // Almacena todos los pedidos
  pedidos: any[] = []; // Pedidos filtrados a mostrar
  isLoading: boolean = true;
  error: string | null = null;
  responseData: any = null;
  toppings: any[] = [];
  iceCreams: any[] = [];
  estados: string[] = ['pendiente', 'en preparación', 'en camino', 'entregado', 'cancelado'];
  filtroActual: string = 'activos'; // 'activos' o 'finalizados'

  constructor(
    private pedidoService: PedidoService,
    private authService: AuthService,
    private toppingsService: ToppingsService,
    private iceCreamService: IceCreamService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  // Añadir esta función para resolver el error
  trackByPedidoId(index: number, pedido: any): string {
    return pedido._id;
  }

  loadData(): void {
    // Primero cargamos los toppings y helados, luego los pedidos
    Promise.all([
      this.cargarToppingsPromise(),
      this.cargarIceCreamsPromise()
    ]).then(() => {
      this.cargarPedidos();
    }).catch(error => {
      console.error('Error cargando datos iniciales:', error);
      this.cargarPedidos(); // Intentamos cargar pedidos de todas formas
    });
  }

  // Convertimos las cargas a promesas para manejarlas más fácilmente
  cargarToppingsPromise(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.toppingsService.getToppings().subscribe({
        next: (data) => {
          console.log('Toppings cargados:', data);
          this.toppings = data;
          resolve();
        },
        error: (err) => {
          console.error('Error al cargar toppings:', err);
          reject(err);
        }
      });
    });
  }

  cargarIceCreamsPromise(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.iceCreamService.getIceCreams().subscribe({
        next: (data) => {
          console.log('Helados cargados:', data);
          this.iceCreams = data;
          resolve();
        },
        error: (err) => {
          console.error('Error al cargar sabores de helado:', err);
          reject(err);
        }
      });
    });
  }

  cargarPedidos(): void {
    this.isLoading = true;
    
    // Para el superUser, obtenemos todos los pedidos
    this.pedidoService.obtenerTodosPedidos().subscribe({
      next: (response) => {
        console.log('Respuesta recibida:', response);
        this.responseData = response;
        
        if (response.success) {
          if (response.pedidos && Array.isArray(response.pedidos)) {
            this.allPedidos = response.pedidos;
            
            // Aplicar filtro según el estado actual
            this.aplicarFiltro(this.filtroActual);
            console.log(`Se cargaron ${this.allPedidos.length} pedidos en total, ${this.pedidos.length} mostrados`);
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

  // Método para aplicar el filtro seleccionado
  aplicarFiltro(filtro: string): void {
    this.filtroActual = filtro;
    
    if (filtro === 'activos') {
      // Pedidos que no están entregados ni cancelados
      this.pedidos = this.allPedidos.filter(pedido => 
        pedido.estado !== 'entregado' && pedido.estado !== 'cancelado'
      );
    } else if (filtro === 'finalizados') {
      // Pedidos entregados o cancelados
      this.pedidos = this.allPedidos.filter(pedido => 
        pedido.estado === 'entregado' || pedido.estado === 'cancelado'
      );
    } else {
      // Todos los pedidos (por si acaso)
      this.pedidos = [...this.allPedidos];
    }
  }

  // Método para obtener la dirección completa
  getDireccionCompleta(pedido: any): string {
    if (pedido.informacionDeEntrega?.tipoPedido === 'domicilio') {
      return `${pedido.informacionDeEntrega.direccion || ''}, ${pedido.informacionDeEntrega.barrio || ''}, ${pedido.informacionDeEntrega.ciudad || ''}`;
    }
    return 'Recoger en tienda';
  }

  // Método para actualizar el estado del pedido
  actualizarEstado(pedido: any): void {
    console.log(`Actualizando estado del pedido ${pedido._id} a ${pedido.estado}`);
    
    this.pedidoService.actualizarEstadoPedido(pedido._id, pedido.estado).subscribe({
      next: (response) => {
        console.log('Estado actualizado correctamente:', response);
        
        // Si el pedido cambia a entregado/cancelado o sale de ese estado, puede necesitar
        // desaparecer de la vista actual según el filtro
        if ((pedido.estado === 'entregado' || pedido.estado === 'cancelado') && this.filtroActual === 'activos') {
          this.aplicarFiltro(this.filtroActual);
        } else if ((pedido.estado !== 'entregado' && pedido.estado !== 'cancelado') && this.filtroActual === 'finalizados') {
          this.aplicarFiltro(this.filtroActual);
        }
      },
      error: (err) => {
        console.error('Error al actualizar el estado:', err);
        // Recargar para asegurar datos consistentes
        this.cargarPedidos();
      }
    });
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

  // Métodos para obtener los nombres de toppings y helados
  getToppingName(toppingId: string): string {
    if (!toppingId) return 'No seleccionado';
    const topping = this.toppings.find(t => t._id === toppingId);
    return topping ? topping.name : 'No disponible';
  }

  getIceCreamName(iceCreamId: string): string {
    if (!iceCreamId) return 'No seleccionado';
    const iceCream = this.iceCreams.find(ic => ic._id === iceCreamId);
    return iceCream ? iceCream.name : 'No disponible';
  }
}