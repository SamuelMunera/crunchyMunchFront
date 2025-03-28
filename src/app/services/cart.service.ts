import { Injectable,signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor() {
  
   }
   cartVisibility = signal(false);
   productsInCart =signal(new Map());

   toggleCartVisibility(){
     this.cartVisibility.update((value) => !value);
     console.log(this.cartVisibility());
   }
  
  //  addTocart(){
  //   this.cartVisibility.update((productsMap) => {
  //     console.log(productsMap.v alues);
  //     return new Map()
  //   });
  
  
  
  //}
}