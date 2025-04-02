import { Component, inject, signal } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';
import { CardProductComponent } from '../../components/card-product/card-product.component';

import { ProductsService } from '../../services/products.service';
import { CategoryService } from '../../services/category.service';
import { Products } from '../../models/Product.model';

@Component({
  selector: 'app-bebidas-producto',
  standalone: true,
  imports: [RouterLinkWithHref, HttpClientModule, CardProductComponent],
  templateUrl: './bebidas-producto.component.html',
  styleUrl: './bebidas-producto.component.css',
})
export class BebidasProductoComponent {
  private ProductService = inject(ProductsService);

  products = signal<null | Products[]>(null);
  category = signal<null | string[]>(null);

  ngOnInit() {
    this.loadProducts();
  }
// cargar los productos

  private loadProducts() {
    this.ProductService.getAllProducts().subscribe({
      next: (response: any) => {
        console.log('products:', response);
        this.products.set(response);
      },
      error: (error) => console.log('Error, cargando productos:', error),
    });
  }

  //obtener los productos por categoria
  
  getProductsByCategory(category: string) {
    return this.products()?.filter((product) => product.category === category);
  }
}
