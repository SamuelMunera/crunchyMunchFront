import { Component, Input } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { ModalComponent } from '../modal/modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'card-product',
  standalone: true,
  imports: [RouterLinkWithHref, ModalComponent, CommonModule],
  templateUrl: './card-product.component.html',
  styleUrl: './card-product.component.css'
})
export class CardProductComponent {
  @Input() name: string = '';
  @Input() photo = '';
  @Input() description = '';
  @Input() recommendation = '';
  @Input() price = '';

  get photoUrl(): string {
    return this.photo.startsWith('http') ? this.photo : `http://localhost:3000${this.photo}`;
  }

  isModalOpen = false;
  selectedProduct: any = null;
  
  openModal() {
    this.selectedProduct = {
      name: this.name,
      photo: this.photo,
      description: this.description,
      recommendation: this.recommendation,
      price: this.price
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}

 
