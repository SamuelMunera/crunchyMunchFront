import { Component,inject,signal } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { CookieService } from '../../services/cookie.service';
import { HttpClientModule } from '@angular/common/http';
import { CardProductComponent } from '../../components/card-product/card-product.component';
import { Cookie } from '../../models/Cookie.model';
@Component({
  selector: 'app-nuestros-productos',
  standalone: true,
  imports: [RouterLinkWithHref,HttpClientModule,CardProductComponent],
  templateUrl: './nuestros-productos.component.html',
  styleUrl: './nuestros-productos.component.css',
})


export class NuestrosProductosComponent {

private cookieService = inject (CookieService)
cookies = signal<null| Cookie[] >(null)


ngOnInit() {
  this.cookieService.getAllCookies().subscribe({
    next: (response: any  ) => {
      console.log(response)
      this.cookies.set(response);
    },
    error: (error) => { console.log(error)
  }})
}
}
