import { Component, Inject, Input, inject } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { ModalComponent } from '../modal/modal.component';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'card-product',
  standalone: true,
  imports: [RouterLinkWithHref, ModalComponent, CommonModule],
  templateUrl: './card-product.component.html',
  styleUrl: './card-product.component.css',
})
export class CardProductComponent {
  private cartService = inject(CartService);

  @Input() _id: string = '';
  @Input() name: string = '';
  @Input() photo = '';
  @Input() description = '';
  @Input() recommendation = '';
  @Input() price = '';

  get photoUrl(): string {
    return this.photo.startsWith('http')
      ? this.photo
      : `https://us-central1-crunchy-5694e.cloudfunctions.net/api${this.photo}`;
  }

  isModalOpen = false;
  selectedProduct: any = null;

  openModal() {
    this.selectedProduct = {
      _id: this._id, // Assuming you want to use name as the ID, change if needed
      name: this.name,
      photo: this.photo,
      description: this.description,
      recommendation: this.recommendation,
      price: this.price,
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
