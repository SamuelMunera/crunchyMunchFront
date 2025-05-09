import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Interfaces mejoradas para tipar correctamente los datos
export interface ToppingInfo {
  id: string;
  name: string;
  price?: number;
}

export interface IceCreamInfo {
  id: string;
  name: string;
  price?: number;
}

export interface Product {
  _id?: string;
  name: string;
  photo: string;
  price: number;
  // Referencias
  toppingId?: string;
  iceCreamId?: string;

  // Info completa
  toppingInfo?: ToppingInfo;
  iceCreamInfo?: IceCreamInfo;

  // ✅ Estos son necesarios para que el pedido se envíe correctamente
  selectedTopping?: string;
  selectedIceCream?: string;
}


export interface CartItem {
  product: Product;
  quantity: number;
  toppingInfo?: ToppingInfo;
  iceCreamInfo?: IceCreamInfo;
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
    // Intentar recuperar el carrito del localStorage al iniciar
    this.loadCartFromStorage();
  }

  // Métodos para la visibilidad del carrito
  cartVisibility(): boolean {
    return this.cartVisibilitySubject.value;
  }

  toggleCartVisibility(): void {
    const newValue = !this.cartVisibilitySubject.value;
    this.cartVisibilitySubject.next(newValue);
    console.log('Cart visibility toggled:', newValue);
  }

  // Obtener el mapa actual de items del carrito como observable
  getCartItems(): Observable<Map<string, CartItem>> {
    return this.cartMapSubject.asObservable();
  }

  // Método mejorado para añadir productos al carrito con toppings y helados
  addToCart(product: Product, quantity: number, toppingInfo?: ToppingInfo, iceCreamInfo?: IceCreamInfo): void {
    console.log('Adding to cart:', product, 'quantity:', quantity);
    console.log('Product photo URL:', product.photo);
    console.log('Topping:', toppingInfo);
    console.log('Ice Cream:', iceCreamInfo);
    
    // CORRECCIÓN: Asegurarse que se establezcan correctamente los IDs en el producto
    const productCopy = { ...product };
    
    if (toppingInfo) {
      productCopy.selectedTopping = toppingInfo.id;
      productCopy.toppingId = toppingInfo.id;
    }
    
    if (iceCreamInfo) {
      productCopy.selectedIceCream = iceCreamInfo.id;
      productCopy.iceCreamId = iceCreamInfo.id;
    }
    
    // Generar una clave única para el producto con sus extras
    const cartKey = this.generateCartItemKey(productCopy);
    
    // Obtener el mapa actual
    const currentMap = this.cartMapSubject.getValue();
    const updatedMap = new Map(currentMap);
    
    // Verificar si el producto ya está en el carrito
    if (!updatedMap.has(cartKey)) {
      // Si no existe, lo agregas al carrito
      updatedMap.set(cartKey, {
        product: productCopy,
        quantity,
        toppingInfo,
        iceCreamInfo
      });
    } else {
      // Si existe, actualizar la cantidad
      const existingItem = updatedMap.get(cartKey) as CartItem;
      existingItem.quantity += quantity;
      updatedMap.set(cartKey, existingItem);
    }
    
    // Actualizar el mapa en el BehaviorSubject
    this.cartMapSubject.next(updatedMap);
    
    // Actualizar el conteo de items
    this.updateItemCount();
    
    // Guardar en localStorage
    this.saveCartToStorage();
    
    console.log('Carrito actualizado, total items:', updatedMap.size);
  }

  // Genera una clave única para cada combinación de producto + extras
  private generateCartItemKey(product: Product): string {
    let key = product.name;
    
    if (product.selectedTopping || product.toppingId) {
      key += `-topping:${product.selectedTopping || product.toppingId}`;
    }
    
    if (product.selectedIceCream || product.iceCreamId) {
      key += `-icecream:${product.selectedIceCream || product.iceCreamId}`;
    }
    
    return key;
  }

  // Método para obtener el tamaño actual del carrito
  getCartSize(): number {
    return this.cartMapSubject.getValue().size;
  }

  // Método para eliminar un producto del carrito
  removeFromCart(cartItemKey: string): void {
    const currentMap = this.cartMapSubject.getValue();
    const updatedMap = new Map(currentMap);
    
    if (updatedMap.has(cartItemKey)) {
      updatedMap.delete(cartItemKey);
      
      // Actualizar el mapa
      this.cartMapSubject.next(updatedMap);
      
      // Actualizar el conteo
      this.updateItemCount();
      
      // Guardar en localStorage
      this.saveCartToStorage();
      
      console.log('Producto eliminado del carrito:', cartItemKey);
    }
  }

  // Método para actualizar el contador de productos
  private updateItemCount(): void {
    const updatedMap = this.cartMapSubject.getValue();
    this.cartItemsCountSubject.next(updatedMap.size);
  }

  // Método para guardar el carrito en localStorage
  private saveCartToStorage(): void {
    try {
      const cartData = Array.from(this.cartMapSubject.getValue().entries());
      localStorage.setItem('shopping-cart', JSON.stringify(cartData));
    } catch (e) {
      console.error('Error al guardar el carrito en localStorage:', e);
    }
  }

  // Método para cargar el carrito desde localStorage con corrección para mantener selectedTopping y selectedIceCream
  private loadCartFromStorage(): void {
    try {
      const savedCart = localStorage.getItem('shopping-cart');
      
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        // Crear un mapa tipado explícitamente
        const loadedMap = new Map<string, CartItem>();
        
        // Poblar el mapa manualmente para garantizar el tipo correcto
        cartData.forEach(([key, item]: [string, CartItem]) => {
          // CORRECCIÓN: Asegúrate de que selectedTopping y selectedIceCream siempre estén presentes
          if (item.toppingInfo) {
            item.product.selectedTopping = item.toppingInfo.id;
            item.product.toppingId = item.toppingInfo.id;
          }
          
          if (item.iceCreamInfo) {
            item.product.selectedIceCream = item.iceCreamInfo.id;
            item.product.iceCreamId = item.iceCreamInfo.id;
          }
          
          loadedMap.set(key, item);
        });
        
        this.cartMapSubject.next(loadedMap);
        this.updateItemCount();
        
        console.log('Carrito cargado desde localStorage con datos completos');
      }
    } catch (e) {
      console.error('Error al cargar el carrito desde localStorage:', e);
    }
  }

  // Método para limpiar todo el carrito
  clearCart(): void {
    this.cartMapSubject.next(new Map());
    this.cartItemsCountSubject.next(0);
    localStorage.removeItem('shopping-cart');
    console.log('Carrito limpiado completamente');
  }

  // Método para obtener el total del carrito
  getCartTotal(): number {
    let total = 0;
    const cartItems = this.cartMapSubject.getValue();
    
    cartItems.forEach((item) => {
      let itemPrice = item.product.price;
      
      // Añadir precio del topping si existe
      if (item.toppingInfo && item.toppingInfo.price) {
        itemPrice += item.toppingInfo.price;
      }
      
      // Añadir precio del helado si existe
      if (item.iceCreamInfo && item.iceCreamInfo.price) {
        itemPrice += item.iceCreamInfo.price;
      }
      
      total += itemPrice * item.quantity;
    });
    
    return total;
  }
}