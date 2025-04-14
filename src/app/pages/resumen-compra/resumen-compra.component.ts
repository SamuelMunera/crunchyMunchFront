import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkWithHref } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService, CartItem } from '../../services/cart.service';
import { PedidoService } from '../../services/pedidos.service';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './resumen-compra.component.html',
  styleUrls: ['./resumen-compra.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink, 
    RouterLinkWithHref
  ]
})
export class ResumenCompraComponent implements OnInit, OnDestroy {
  // Variables para la información del cliente
  clienteInfo = {
    nombre: '',
    apellido: '',
    telefono: '',
    dedicatoria: ''
  };

  // Variables para la información de entrega
  entregaInfo = {
    tipoPedido: 'domicilio', // Por defecto domicilio
    direccion: '',
    barrio: '',
    ciudad: '',
    referencias: ''
  };

  // Variables para el carrito
  cartItems: CartItem[] = [];
  hayProductos = false;
  totalPagar = 0;
  recargoDomicilio = 5000; // Valor por defecto, ajustar según necesidad
  
  // Variables para el pago
  metodoPago = 'efectivo'; // Por defecto efectivo
  aceptoTerminos = false;

  // Variables para confirmación
  mensajeExito: string = '';
  mostrarMensaje: boolean = false;
  pedidoCreado: boolean = false;
  pedidoId: string = '';

  // Suscripción para detectar cambios en el carrito
  private cartSubscription: Subscription | null = null;
  
  // Usuario actual
  currentUser: User | null = null;

  constructor(
    private cartService: CartService,
    private pedidoService: PedidoService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Verificar autenticación
    this.currentUser = this.authService.getCurrentUser();
    console.log('Token en localStorage:', localStorage.getItem('token') ? 'Presente' : 'Ausente');
    
    if (!this.currentUser) {
      alert('Debes iniciar sesión para realizar un pedido');
      this.router.navigate(['/Login']);
      return;
    }

    // Cargar datos del carrito
    this.cartSubscription = this.cartService.getCartItems().subscribe(cartMap => {
      this.cartItems = Array.from(cartMap.values());
      this.hayProductos = this.cartItems.length > 0;
      this.calcularTotal();
    });

    // Pre-cargar información del usuario si existe
    if (this.currentUser) {
      this.clienteInfo.nombre = this.currentUser.name || '';
      this.clienteInfo.apellido = this.currentUser.lastName || '';
      this.clienteInfo.telefono = this.currentUser.phone?.toString() || '';
    }
  }

  ngOnDestroy(): void {
    // Limpiar suscripción al destruir el componente
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  /**
   * Cambia el tipo de entrega del pedido
   */
  cambiarTipoEntrega(tipo: string): void {
    this.entregaInfo.tipoPedido = tipo;
    this.calcularTotal(); // Recalcular total en caso de que cambie el tipo de entrega
  }

  /**
   * Obtiene la URL de la imagen del producto
   */
  getImageUrl(photo: string): string {
    // Si la imagen ya es una URL completa, devolverla
    if (photo && (photo.startsWith('http') || photo.startsWith('data:'))) {
      return photo;
    }
    // Si es una ruta relativa, construir la URL completa
    return `http://localhost:3000${photo}`;
  }

  /**
   * Obtiene el nombre del topping si existe
   */
  getToppingName(item: CartItem): string {
    return item.toppingInfo?.name || 'Sin topping';
  }

  /**
   * Obtiene el nombre del helado si existe
   */
  getIceCreamName(item: CartItem): string {
    return item.iceCreamInfo?.name || 'Sin helado';
  }

  /**
   * Calcula el precio de un item individual considerando toppings y helados
   */
  calcularPrecioItem(item: CartItem): number {
    let precio = item.product.price;
    
    // Añadir precio del topping si existe
    if (item.toppingInfo && item.toppingInfo.price) {
      precio += item.toppingInfo.price;
    }
    
    // Añadir precio del helado si existe
    if (item.iceCreamInfo && item.iceCreamInfo.price) {
      precio += item.iceCreamInfo.price;
    }
    
    return precio * item.quantity;
  }

  /**
   * Elimina un producto del carrito
   */
  eliminarProducto(item: CartItem): void {
    // Generar la clave única del producto
    let key = item.product.name;
    if (item.toppingInfo) {
      key += `-topping:${item.toppingInfo.id}`;
    }
    if (item.iceCreamInfo) {
      key += `-icecream:${item.iceCreamInfo.id}`;
    }
    
    this.cartService.removeFromCart(key);
    // El total se recalculará automáticamente gracias a la suscripción
  }

  /**
   * Calcula el total a pagar
   */
  calcularTotal(): void {
    // Obtener el subtotal del carrito
    const subtotal = this.cartService.getCartTotal();
    
    // Añadir recargo de domicilio si corresponde
    if (this.entregaInfo.tipoPedido === 'domicilio') {
      this.totalPagar = subtotal + this.recargoDomicilio;
    } else {
      this.totalPagar = subtotal;
    }
  }

  /**
   * Procesa la finalización de la compra
   */
  finalizarCompra(): void {
    // Validar que haya productos en el carrito
    if (!this.hayProductos) {
      alert('No hay productos en el carrito');
      return;
    }
    
    // Validar campos obligatorios
    if (!this.clienteInfo.nombre || !this.clienteInfo.apellido || !this.clienteInfo.telefono) {
      alert('Por favor, completa todos los campos de información personal');
      return;
    }
    
    // Validar campos de dirección para domicilio
    if (this.entregaInfo.tipoPedido === 'domicilio') {
      if (!this.entregaInfo.direccion || !this.entregaInfo.barrio || !this.entregaInfo.ciudad) {
        alert('Por favor, completa todos los campos de dirección');
        return;
      }
    }
    
    // Validar aceptación de términos
    if (!this.aceptoTerminos) {
      alert('Debes aceptar los términos y condiciones para continuar');
      return;
    }
    
    // Preparar datos del pedido para enviar al backend
    const productos = this.cartItems.map(item => {
      return {
        producto: item.product.name,
        productoId: item.product._id || '',
        cantidad: item.quantity,
        precioUnitario: item.product.price,
        photo: item.product.photo,
        topping: item.toppingInfo?.id || null,
        helado: item.iceCreamInfo?.id || null
      };
    });
    
    const subtotal = this.cartService.getCartTotal();
    
    const pedidoData = {
      cliente: this.clienteInfo,
      entrega: this.entregaInfo,
      productos: productos,
      metodoPago: this.metodoPago,
      subtotal: subtotal,
      recargoDomicilio: this.entregaInfo.tipoPedido === 'domicilio' ? this.recargoDomicilio : 0,
      total: this.totalPagar
    };
    
    // Enviar pedido al servidor
    this.pedidoService.crearPedido(pedidoData).subscribe({
      next: (response) => {
        console.log('Pedido creado correctamente:', response);
        
        // Almacenar el ID del pedido
        this.pedidoId = response.pedidoId;
        
        // Mostrar mensaje de éxito
        this.mensajeExito = `¡Tu pedido ha sido creado con éxito! Número de pedido: ${this.pedidoId}`;
        this.mostrarMensaje = true;
        this.pedidoCreado = true;
        
        // Limpiar carrito
        this.cartService.clearCart();
        
        // Ocultar el mensaje después de un tiempo (opcional)
        setTimeout(() => {
          this.mostrarMensaje = false;
        }, 5000);
      },
      error: (error) => {
        console.error('Error al crear el pedido:', error);
        if (error.message.includes('sesión ha expirado')) {
          // Redirigir a login
          this.router.navigate(['/Login']);
        } else {
          this.mensajeExito = `Error: ${error.message}`;
          this.mostrarMensaje = true;
          
          // Ocultar el mensaje de error después de un tiempo
          setTimeout(() => {
            this.mostrarMensaje = false;
          }, 3000);
        }
      }
    });
  }
}