import { Component, inject, signal, Input } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  @Input() product: any;
  @Input() quantity: number = 1;
  @Input() photo: string = '';
  
  // Cambia a público para que sea accesible desde la plantilla
  public cartService = inject(CartService);
  cartVisibility = this.cartService.cartVisibility;
  
  constructor() {}
  
  handleCartClick() {
    this.cartService.toggleCartVisibility();
  }
  
  handleProduct(product: any, quantity: number) {
    this.cartService.addToCart(product, quantity);
    
  }
  
  getCartItems() {
    
    return Array.from(this.cartService.productsInCart().values());
   
  }
  
  getCartItemCount() {
    return this.getCartItems().length;
  }
  
  calculateTotal() {
    let total = 0;
    this.getCartItems().forEach(item => {
      total += item.product.price * item.quantity;
    });
    return total.toFixed(0);
  }
}