// modal.component.ts - VERSIÓN CORREGIDA
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Topping {
  _id: string;
  name: string;
}

interface IceCream {
  _id: string;
  name: string;
}

@Component({
  selector: 'app-modal',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent implements OnInit {
  quantity: number = 1;
  private cartService = inject(CartService);
  private http = inject(HttpClient);
  
  selectedTopping: string = '';
  selectedIceCream: string = '';
  
  availableToppings: Topping[] = [];
  availableIceCreams: IceCream[] = [];
  
  isLoading: boolean = false;
  error: string | null = null;

  @Input() product: any | null = null;
  @Output() close = new EventEmitter<void>();
  
  closeModal() {
    this.close.emit();
  }

  // ✅ Getter para URLs de imagen
  get photoUrl(): string {
    if (!this.product || !this.product.photo) {
      console.log('❌ No hay producto o foto disponible');
      return 'assets/img/logo.png';
    }
    
    // Verificar si la URL es válida
    if (this.product.photo.startsWith('http')) {
      return this.product.photo;
    }
    
    // Si no es una URL completa, construir la URL de S3
    return `https://crunchy-app-2025.s3.us-east-2.amazonaws.com/${this.product.photo}`;
  }

  // ✅ Método para manejar errores de imagen
  onImageError(event: any) {
    console.error('❌ Error al cargar imagen:', event);
    event.target.src = 'assets/img/logo.png';
  }

  // ✅ Método para verificar cuando la imagen se carga correctamente
  onImageLoad(event: any) {
    console.log('✅ Imagen cargada correctamente:', event.target.src);
  }

  handleAddToCart(product: any, quantity: number) {
    if (!product) return;
    
    const productWithOptions = {
      ...product,
      selectedTopping: this.selectedTopping || '',
      selectedIceCream: this.selectedIceCream || '',
      toppingInfo: this.selectedTopping && this.availableToppings ? 
        this.availableToppings.find(t => t._id === this.selectedTopping) : null,
      iceCreamInfo: this.selectedIceCream && this.availableIceCreams ? 
        this.availableIceCreams.find(i => i._id === this.selectedIceCream) : null
    };
    
    console.log('Añadiendo al carrito:', productWithOptions);
    this.cartService.addToCart(productWithOptions, quantity);
    this.closeModal();
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  // ✅ MÉTODOS CORREGIDOS: Verificar si hay opciones disponibles
  hasToppings(): boolean {
    return this.availableToppings && this.availableToppings.length > 0;
  }

  hasIceCreams(): boolean {
    return this.availableIceCreams && this.availableIceCreams.length > 0;
  }

  // ✅ Método para verificar si el producto tiene toppings populados
  private hasPopulatedToppings(): boolean {
    return this.product?.toppings && 
           Array.isArray(this.product.toppings) && 
           this.product.toppings.length > 0;
  }

  // ✅ Método para verificar si el producto tiene ice creams populados
  private hasPopulatedIceCreams(): boolean {
    return this.product?.iceCream && 
           Array.isArray(this.product.iceCream) && 
           this.product.iceCream.length > 0;
  }

  // ✅ INICIALIZACIÓN SIMPLIFICADA
  ngOnInit() {
    console.log('🚀 Modal iniciado con producto:', this.product);
    
    if (!this.product) {
      console.error('❌ No se recibió ningún producto en el modal');
      this.error = 'No hay producto disponible';
      return;
    }
    
    // ✅ Debug del producto
    this.debugProduct();
    
    // ✅ Inicializar opciones usando SOLO los datos populados
    this.initializeOptions();
  }

  // ✅ MÉTODO PRINCIPAL: Inicializar opciones desde datos populados
  private initializeOptions() {
    console.group('🔧 INICIALIZANDO OPCIONES DEL PRODUCTO');
    
    // ✅ Inicializar toppings SOLO si existen y están populados
    if (this.hasPopulatedToppings()) {
      this.availableToppings = this.product.toppings;
      // Seleccionar el primer topping por defecto (opcional)
      this.selectedTopping = this.availableToppings[0]._id;
      console.log('✅ Toppings inicializados:', this.availableToppings.length, this.availableToppings);
    } else {
      this.availableToppings = [];
      this.selectedTopping = '';
      console.log('⚠️ No hay toppings disponibles para este producto');
    }
    
    // ✅ Inicializar ice creams SOLO si existen y están populados
    if (this.hasPopulatedIceCreams()) {
      this.availableIceCreams = this.product.iceCream;
      // Seleccionar el primer ice cream por defecto (opcional)
      this.selectedIceCream = this.availableIceCreams[0]._id;
      console.log('✅ Ice Creams inicializados:', this.availableIceCreams.length, this.availableIceCreams);
    } else {
      this.availableIceCreams = [];
      this.selectedIceCream = '';
      console.log('⚠️ No hay ice creams disponibles para este producto');
    }
    
    console.log('📊 Estado final:');
    console.log('   - Toppings disponibles:', this.hasToppings());
    console.log('   - Ice Creams disponibles:', this.hasIceCreams());
    console.log('   - Topping seleccionado:', this.selectedTopping);
    console.log('   - Ice Cream seleccionado:', this.selectedIceCream);
    
    console.groupEnd();
  }

  // ✅ Método mejorado para debug
  private debugProduct() {
    console.group('🔍 DEBUG COMPLETO DEL PRODUCTO');
    console.log('📦 Producto completo:', this.product);
    console.log('🆔 ID:', this.product?._id);
    console.log('📛 Nombre:', this.product?.name);
    console.log('💰 Precio:', this.product?.price);
    console.log('🖼️ Foto URL:', this.product?.photo);
    console.log('📝 Descripción:', this.product?.description);
    console.log('⭐ Recomendación:', this.product?.recommendation);
    
    // ✅ Debug específico de toppings
    console.log('🍰 Toppings raw:', this.product?.toppings);
    console.log('🍰 Toppings es array?', Array.isArray(this.product?.toppings));
    console.log('🍰 Cantidad de toppings:', this.product?.toppings?.length || 0);
    console.log('🍰 Tiene toppings populados?', this.hasPopulatedToppings());
    
    // ✅ Debug específico de ice creams
    console.log('🍨 Ice Creams raw:', this.product?.iceCream);
    console.log('🍨 Ice Creams es array?', Array.isArray(this.product?.iceCream));
    console.log('🍨 Cantidad de ice creams:', this.product?.iceCream?.length || 0);
    console.log('🍨 Tiene ice creams populados?', this.hasPopulatedIceCreams());
    
    console.log('🔗 PhotoURL calculado:', this.photoUrl);
    console.groupEnd();
  }
}