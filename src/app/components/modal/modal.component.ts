import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { Input } from '@angular/core';
import { CookieService } from '../../services/cookie.service';
import { CrookieService } from '../../services/crookie.service';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {

  @Input() product: any | null = null; //  Asegura que product puede ser null

  @Input() name: string = '';
  @Input() photo = '';
  @Input() description = '';
  @Input() recommendation = '';
  @Input() price = '';

  @Output() close = new EventEmitter<void>();

  
  closeModal() {
    this.close.emit();
  }

  //funcion para que muestre la imagen del producto
  get photoUrl(): string {
    if (!this.product || !this.product.photo) return ''; // Previene errores si product es null
    return this.product.photo.startsWith('http') ? this.product.photo : `http://localhost:3000${this.product.photo}`;
  }


  //funcion para que mueva la cantidad de productos
  quantity: number = 0;
  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 0) {
      this.quantity--;
    }
  }
}