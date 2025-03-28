import { Component,inject,signal } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';
import { CardProductComponent } from '../../components/card-product/card-product.component';

import { ProductsService } from '../../services/products.service';
import { CategoryService } from '../../services/category.service';
import { Products } from '../../models/Product.model';

@Component({
  selector: 'app-nuestros-productos',
  standalone: true,
  imports: [RouterLinkWithHref,HttpClientModule,CardProductComponent],
  templateUrl: './nuestros-productos.component.html',
  styleUrl: './nuestros-productos.component.css',
})


export class NuestrosProductosComponent {

 
  private ProductService = inject(ProductsService);
  


  
  products = signal<null | Products[]>(null);
  category = signal<null | string[]>(null);

  ngOnInit() {
    // this.loadCookies();
    // this.loadCrookies();
    this.loadProducts();
    
  }

  // private loadCookies() {
  //   this.cookieService.getAllCookies().subscribe({
  //     next: (response: any) => {
  //       console.log('Cookies:', response);
  //       this.cookies.set(response);
  //     },
  //     error: (error) => console.log('Error cargando cookies:', error)
  //   });
  // }

  // private loadCrookies() {
  //   this.crookieService.getAllCrookies().subscribe({
  //     next: (response: any) => {
  //       console.log('Crookies:', response);
  //       this.crookies.set(response);
  //     },
  //     error: (error) => console.log('Error cargando crookies:', error)
  //   });
  // }

  private loadProducts() {
    this.ProductService.getAllProducts().subscribe({
      next: (response: any) => {
        console.log('products:', response);
        this.products.set(response);
      },
      error: (error) => console.log('Error, cargando productos:', error)
    });
  }
    getProductsByCategory(category: string) {
      return this.products()?.filter(product => product.category === category);
    }

}