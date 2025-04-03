import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLinkWithHref, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private cartService = inject(CartService);
  private authService = inject(AuthService);

  user: any = null;
  cartItemCount = 0;
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    // Suscripción a cambios en el usuario actual
    const userSub = this.authService.currentUser.subscribe(user => {
      this.user = user;
    });
    this.subscriptions.push(userSub);

    // Obtener conteo inicial del carrito
    this.cartItemCount = this.cartService.getCartSize();
    
    // Suscripción a cambios en el carrito para actualizar el contador
    const cartSub = this.cartService.productsInCart.subscribe(count => {
      this.cartItemCount = count;
    });
    this.subscriptions.push(cartSub);
  }

  ngOnDestroy(): void {
    // Limpiar suscripciones para evitar fugas de memoria
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  handleCartClick() {
    this.cartService.toggleCartVisibility();
  }
}