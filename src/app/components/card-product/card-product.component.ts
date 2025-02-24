import { Component, Input } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'card-product',
  standalone: true,
  imports: [RouterLinkWithHref],
  templateUrl: './card-product.component.html',
  styleUrl: './card-product.component.css'
})
export class CardProductComponent {

  @Input() name: string = '';
  @Input() photo ='';
  @Input() description ='';
  @Input() recommendation = '';
  @Input() price ='';

  get photoUrl(): string {
    return this.photo.startsWith('http') ? this.photo : `http://localhost:3000${this.photo}`;
  }
 

 }
