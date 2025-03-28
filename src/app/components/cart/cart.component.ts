import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
public cartService= inject(CartService);

cartVisibility = this.cartService.cartVisibility;

handleCartClick(){
  this.cartService.toggleCartVisibility();

}}
