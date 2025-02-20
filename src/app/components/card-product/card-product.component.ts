import { Component, Input } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'card-product',
  standalone: true,
  imports: [],
  templateUrl: './card-product.component.html',
  styleUrl: './card-product.component.css'
})
export class CardProductComponent {

  @Input() name: string = '';
  @Input() photo ='';
  @Input() description ='';
  @Input() recommendation = '';
  @Input() price ='';
  
 }
