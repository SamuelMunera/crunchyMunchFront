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
    referencias: '',
    fechaPersonalizada: false, // Nueva propiedad para fecha personalizada
    fechaEntrega: '', // Nueva propiedad para almacenar la fecha seleccionada
    horaEntrega: '12:00' // Nueva propiedad para la hora de entrega
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

  // Variables para el calendario personalizado
  mostrarCalendario: boolean = false;
  fechaMinima: string = '';
  fechaMaxima: string = '';
  diasSemana: string[] = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  meses: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  calendarioMes: number = new Date().getMonth();
  calendarioAno: number = new Date().getFullYear();
  diasDelMes: any[] = [];
  fechaSeleccionada: Date | null = null;

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

    // Configurar fechas mínimas y máximas para el calendario
    this.configurarFechas();
    this.generarCalendario();
  }

  ngOnDestroy(): void {
    // Limpiar suscripción al destruir el componente
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  /**
   * Configura las fechas mínimas y máximas para el selector de fecha
   */
  configurarFechas(): void {
    const hoy = new Date();
    const manana = new Date(hoy);
    manana.setDate(hoy.getDate() + 1);
    
    const maxFecha = new Date(hoy);
    maxFecha.setDate(hoy.getDate() + 60); // Máximo 60 días adelante
    
    this.fechaMinima = manana.toISOString().split('T')[0];
    this.fechaMaxima = maxFecha.toISOString().split('T')[0];
  }

  /**
   * Cambia el estado de fecha personalizada
   */
  cambiarFechaPersonalizada(personalizada: boolean): void {
    this.entregaInfo.fechaPersonalizada = personalizada;
    this.mostrarCalendario = personalizada;
    
    if (!personalizada) {
      this.entregaInfo.fechaEntrega = '';
      this.fechaSeleccionada = null;
    } else {
      this.generarCalendario();
    }
  }

  /**
   * Genera el calendario para el mes actual
   */
  generarCalendario(): void {
    const primerDia = new Date(this.calendarioAno, this.calendarioMes, 1);
    const ultimoDia = new Date(this.calendarioAno, this.calendarioMes + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    const diaSemanaInicio = primerDia.getDay();
    
    this.diasDelMes = [];
    
    // Agregar días vacíos al inicio
    for (let i = 0; i < diaSemanaInicio; i++) {
      this.diasDelMes.push(null);
    }
    
    // Agregar los días del mes
    const hoy = new Date();
    const fechaMinima = new Date(hoy);
    fechaMinima.setDate(hoy.getDate() + 1);
    
    const fechaMaxima = new Date(hoy);
    fechaMaxima.setDate(hoy.getDate() + 60);
    
    for (let dia = 1; dia <= diasEnMes; dia++) {
      const fecha = new Date(this.calendarioAno, this.calendarioMes, dia);
      const esHabilitado = fecha >= fechaMinima && fecha <= fechaMaxima;
      const esSeleccionado = this.fechaSeleccionada && 
        this.fechaSeleccionada.getDate() === dia &&
        this.fechaSeleccionada.getMonth() === this.calendarioMes &&
        this.fechaSeleccionada.getFullYear() === this.calendarioAno;
      
      this.diasDelMes.push({
        numero: dia,
        fecha: fecha,
        habilitado: esHabilitado,
        seleccionado: esSeleccionado
      });
    }
  }

  /**
   * Navega al mes anterior
   */
  mesAnterior(): void {
    if (this.calendarioMes === 0) {
      this.calendarioMes = 11;
      this.calendarioAno--;
    } else {
      this.calendarioMes--;
    }
    this.generarCalendario();
  }

  /**
   * Navega al mes siguiente
   */
  mesSiguiente(): void {
    if (this.calendarioMes === 11) {
      this.calendarioMes = 0;
      this.calendarioAno++;
    } else {
      this.calendarioMes++;
    }
    this.generarCalendario();
  }

  /**
   * Selecciona una fecha del calendario
   */
  seleccionarFecha(dia: any): void {
    if (!dia || !dia.habilitado) return;
    
    this.fechaSeleccionada = dia.fecha;
    this.entregaInfo.fechaEntrega = dia.fecha.toISOString().split('T')[0];
    this.generarCalendario(); // Regenerar para actualizar el estado visual
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
  
  // Si no hay foto, devolver imagen por defecto
  if (!photo) {
    return 'assets/default-image.png';
  }
  
  // Si es una ruta relativa, construir la URL completa con el bucket de S3
  const path = photo.startsWith('/') ? photo.substring(1) : photo;
  return `https://crunchy-app-2025.s3.us-east-2.amazonaws.com/${path}`;
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
    if (!this.clienteInfo.nombre || !this.clienteInfo.telefono) {
      alert('Por favor, completa todos los campos obligatorios de información personal');
      return;
    }
    
    // Validar campos de dirección para domicilio
    if (this.entregaInfo.tipoPedido === 'domicilio') {
      if (!this.entregaInfo.direccion || !this.entregaInfo.barrio || !this.entregaInfo.ciudad) {
        alert('Por favor, completa todos los campos de dirección');
        return;
      }
    }

    // Validar fecha personalizada si está seleccionada
    if (this.entregaInfo.fechaPersonalizada && !this.entregaInfo.fechaEntrega) {
      alert('Por favor, selecciona una fecha de entrega');
      return;
    }
    
    // Validar aceptación de términos
    if (!this.aceptoTerminos) {
      alert('Debes aceptar los términos y condiciones para continuar');
      return;
    }
    
    // Logging para depuración
    console.log('Contenido del carrito antes de mapear:', this.cartItems);
    
    // Depuración detallada de cada item
    this.cartItems.forEach((item, index) => {
      console.log(`Producto ${index}:`, {
        nombre: item.product.name,
        toppingInfo: item.toppingInfo,
        iceCreamInfo: item.iceCreamInfo,
        selectedTopping: item.product.selectedTopping,
        selectedIceCream: item.product.selectedIceCream,
        toppingId: item.product.toppingId,
        iceCreamId: item.product.iceCreamId
      });
    });
    
    // Preparar datos del pedido para enviar al backend - CORREGIDO
    const productos = this.cartItems.map(item => {
      // Buscar los IDs de topping y helado en todas las posibles propiedades
      const toppingId = item.product.selectedTopping || 
                    (item.toppingInfo ? item.toppingInfo.id : null) || 
                    item.product.toppingId || null;
                    
      const iceCreamId = item.product.selectedIceCream || 
                     (item.iceCreamInfo ? item.iceCreamInfo.id : null) || 
                     item.product.iceCreamId || null;
      
      // Log para depuración de cada producto
      console.log(`Mapeando producto "${item.product.name}":`, {
        toppingDirecto: item.product.selectedTopping,
        toppingInfo: item.toppingInfo?.id,
        toppingId: item.product.toppingId,
        iceCreamDirecto: item.product.selectedIceCream,
        iceCreamInfo: item.iceCreamInfo?.id,
        iceCreamId: item.product.iceCreamId,
        toppingIdFinal: toppingId,
        iceCreamIdFinal: iceCreamId
      });
      
      return {
        producto: item.product.name,
        productoId: item.product._id || '',
        cantidad: item.quantity,
        precioUnitario: item.product.price,
        photo: item.product.photo,
        selectedTopping: toppingId,
        selectedIceCream: iceCreamId
      };
    });
    
    const subtotal = this.cartService.getCartTotal();
    
    const pedidoData = {
      cliente: this.clienteInfo,
      entrega: {
        ...this.entregaInfo,
        // Formatear la fecha y hora si está personalizada
        fechaEntrega: this.entregaInfo.fechaPersonalizada && this.entregaInfo.fechaEntrega ? 
          `${this.entregaInfo.fechaEntrega}T${this.entregaInfo.horaEntrega}:00` : null
      },
      productos: productos,
      metodoPago: this.metodoPago,
      subtotal: subtotal,
      recargoDomicilio: this.entregaInfo.tipoPedido === 'domicilio' ? this.recargoDomicilio : 0,
      total: this.totalPagar
    };
    
    // Log para verificar los datos que se enviarán
    console.log('Datos del pedido a enviar:', pedidoData);
    
    // Enviar pedido al servidor
    this.pedidoService.createPedido(pedidoData).subscribe({
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