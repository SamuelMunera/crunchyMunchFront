// modal.component.ts
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

  get photoUrl(): string {
    if (!this.product || !this.product.photo) return '';
    return this.product.photo.startsWith('http') ? this.product.photo : `http://3.14.254.112:3000/api${this.product.photo}`;
  }
  
  handleAddToCart(product: any, quantity: number) {
    if (!product) return;
    
    const productWithOptions = {
      ...product,
      selectedTopping: this.selectedTopping || '',
      selectedIceCream: this.selectedIceCream || '',
      // Incluir información adicional si es necesario
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

  hasToppings(): boolean {
    return this.availableToppings && this.availableToppings.length > 0;
  }

  hasIceCreams(): boolean {
    return this.availableIceCreams && this.availableIceCreams.length > 0;
  }

  // Cargar toppings y helados disponibles
  loadAvailableOptions() {
    this.isLoading = true;
    
    // Cargar toppings
    this.http.get<Topping[]>(`http://3.14.254.112:3000/api/${this.product.name}/toppings`).subscribe({
      next: (toppings) => {
        this.availableToppings = toppings || [];
        console.log('Toppings disponibles:', this.availableToppings);
      },
      error: (err) => {
        console.error('Error al cargar toppings:', err);
        this.error = 'No se pudieron cargar los toppings';
      },
      complete: () => this.isLoading = false
    });
    
    // Cargar helados
    this.http.get<IceCream[]>(`http://3.14.254.112:3000/api/product/${this.product.name}/iceCream`).subscribe({
      next: (iceCreams) => {
        this.availableIceCreams = iceCreams || [];
        console.log('Helados disponibles:', this.availableIceCreams);
      },
      error: (err) => {
        console.error('Error al cargar helados:', err);
        this.error = 'No se pudieron cargar los helados';
      },
      complete: () => this.isLoading = false
    });
  }

  ngOnInit() {
    console.log('Producto recibido en el modal:', this.product);
    
    if (this.product) {
      // Si el producto tiene ID pero está vacío, es un producto nuevo que no se ha guardado
      if (this.product._id === "") {
        console.log('Producto nuevo detectado, cargando opciones disponibles');
        this.loadAvailableOptions();
        return;
      }
      
      // Si es un producto existente, intentar usar sus toppings e iceCream
      if (Array.isArray(this.product.toppings)) {
        console.log('Toppings del producto:', this.product.toppings);
        this.availableToppings = this.product.toppings;
        
        // Seleccionar el primer topping por defecto
        if (this.availableToppings.length > 0) {
          this.selectedTopping = this.availableToppings[0]._id;
        }
      } else {
        console.log('No hay toppings en el producto, cargando opciones');
        this.loadAvailableOptions();
      }
      
      if (Array.isArray(this.product.iceCream)) {
        console.log('Ice Creams del producto:', this.product.iceCream);
        this.availableIceCreams = this.product.iceCream;
        
        // Seleccionar el primer helado por defecto
        if (this.availableIceCreams.length > 0) {
          this.selectedIceCream = this.availableIceCreams[0]._id;
        }
      }
    } else {
      console.error('No se recibió ningún producto en el modal');
    }
  }
}