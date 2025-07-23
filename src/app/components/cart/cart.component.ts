import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';
import { RouterLinkWithHref, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

// Definir interfaces para tipar correctamente los datos
interface Product {
  name: string;
  photo: string;
  price: number;
  // Añade otras propiedades que tenga tu producto
}

interface CartItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLinkWithHref],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit, OnDestroy {
  public cartItems: CartItem[] = [];
  private cartSubscription?: Subscription;
  private apiUrl: string = 'https://api.crunchy-munch.com/api'; // Ajústalo a la URL de tu backend
  
  constructor(
    public cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.cartSubscription = this.cartService.getCartItems().subscribe(cartMap => {
      this.cartItems = Array.from(cartMap.values()) as CartItem[];
      
      // Depuración: ver qué datos están llegando
      console.log('Items en el carrito:', this.cartItems);
      if (this.cartItems.length > 0) {
        console.log('Primera foto URL:', this.cartItems[0].product.photo);
      }
    });
  }
  
  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
  
  toggleCartVisibility(): void {
    this.cartService.toggleCartVisibility();
  }
  
  calculateTotal(): number {
    let total = 0;
    for (const item of this.cartItems) {
      total += item.product.price * item.quantity;
    }
    return total;
  }
  
  removeFromCart(productName: string): void {
    this.cartService.removeFromCart(productName);
  }
  
  // Método para verificar autenticación antes de finalizar compra
  checkoutProcess(): void {
    if (this.authService.isAuthenticated()) {
      // Si está logueado, redirige a la página de resumen de compra
      this.router.navigate(['/Resumen de compra']);
    } else {
      // Si no está logueado, muestra mensaje y redirige al login
      alert('Debes iniciar sesión para finalizar la compra');
      
      // Redirige al login
      this.router.navigate(['/login']);
    }
  }
  
  // Método para manejar errores de carga de imágenes
  handleImageError(event: any): void {
    console.log('Error cargando imagen, usando imagen de reemplazo');
    event.target.src = 'assets/img/placeholder.png'; // Imagen de reemplazo
  }
  
  // Método para generar la URL correcta de la imagen
  getImageUrl(product: Product): string {
    if (!product || !product.photo) {
      console.log('Producto o foto no disponible');
      return 'assets/img/placeholder.png';
    }
    
    // Si la URL ya incluye http:// o https://, devolverla tal cual
    if (product.photo.startsWith('http://') || product.photo.startsWith('https://')) {
      return product.photo;
    }
    
    // Si la URL comienza con /, no agregar otro /
    if (product.photo.startsWith('/')) {
      return `${this.apiUrl}${product.photo}`;
    }
    
    // De lo contrario, asegurarse de que haya un / entre apiUrl y photo
    return `${this.apiUrl}/${product.photo}`;
  }
}