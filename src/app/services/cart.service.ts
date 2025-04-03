import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartVisibilitySubject = new BehaviorSubject<boolean>(false);
  
  // BehaviorSubject para el mapa de productos
  private cartMapSubject = new BehaviorSubject<Map<string, CartItem>>(new Map());
  
  // BehaviorSubject para el conteo de productos
  private cartItemsCountSubject = new BehaviorSubject<number>(0);
  public productsInCart = this.cartItemsCountSubject.asObservable();
  
  constructor() {
    console.log('CartService initializing...');
  }
  
  cartVisibility() {
    return this.cartVisibilitySubject.value;
  }
  
  toggleCartVisibility() {
    const newValue = !this.cartVisibilitySubject.value;
    this.cartVisibilitySubject.next(newValue);
    console.log('Cart visibility toggled:', newValue);
  }
  
  // Obtener el mapa actual de items del carrito como observable
  getCartItems(): Observable<Map<string, CartItem>> {
    return this.cartMapSubject.asObservable();
  }
  
  addToCart(product: Product, quantity: number) {
    console.log('Adding to cart:', product, 'quantity:', quantity);
    console.log('Product photo URL:', product.photo);
    
    // Obtener el mapa actual
    const currentMap = this.cartMapSubject.getValue();
    const updatedMap = new Map(currentMap);
    
    // Verificar si el producto ya está en el carrito
    if (!updatedMap.has(product.name)) {
      // Si no existe, lo agregas al carrito
      updatedMap.set(product.name, { product: product, quantity: quantity });
    } else {
      // Si existe, actualizar la cantidad
      const existingItem = updatedMap.get(product.name) as CartItem;
      existingItem.quantity += quantity;
      updatedMap.set(product.name, existingItem);
    }
    
    // Actualizar el mapa en el BehaviorSubject
    this.cartMapSubject.next(updatedMap);
    
    // Actualizar el conteo de items
    this.cartItemsCountSubject.next(updatedMap.size);
    
    console.log('Carrito actualizado, total items:', updatedMap.size);
  }
  
  // Método para obtener el tamaño actual del carrito
  getCartSize(): number {
    return this.cartMapSubject.getValue().size;
  }
  
  // Método para eliminar un producto del carrito
  removeFromCart(productName: string): void {
    const currentMap = this.cartMapSubject.getValue();
    const updatedMap = new Map(currentMap);
    
    if (updatedMap.has(productName)) {
      updatedMap.delete(productName);
      
      // Actualizar el mapa y el conteo
      this.cartMapSubject.next(updatedMap);
      this.cartItemsCountSubject.next(updatedMap.size);
      console.log('Producto eliminado del carrito:', productName);
    }
  }
}