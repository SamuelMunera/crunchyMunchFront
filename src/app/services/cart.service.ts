import { inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor() {}
  
  cartVisibility = signal(false);
  productsInCart = signal(new Map());
      
  toggleCartVisibility() {
    this.cartVisibility.update((value) => !value);
    console.log(this.cartVisibility());
  }
  
  addToCart(product: any, quantity: number) {
    this.productsInCart.update((value) => {
      const nuevoMapaPorCompleto = new Map(value);
      
      // Verificar si el producto ya está en el carrito
      if (!nuevoMapaPorCompleto.has(product.name)) {
        // Si no existe, lo agregas al carrito
        nuevoMapaPorCompleto.set(product.name,{ product: product, quantity: quantity });
      } else {
        // Si existe, podrías actualizar la cantidad (opcional)
        const existingItem = nuevoMapaPorCompleto.get(product.name);
        existingItem.quantity += quantity;
        nuevoMapaPorCompleto.set(product.name, existingItem);
      }
  
      console.log(nuevoMapaPorCompleto);
      return nuevoMapaPorCompleto;
    });
  }
}