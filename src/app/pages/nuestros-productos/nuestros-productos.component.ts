import { Component,inject,signal } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { CookieService } from '../../services/cookie.service';
import { HttpClientModule } from '@angular/common/http';
import { CardProductComponent } from '../../components/card-product/card-product.component';
import { Cookie } from '../../models/Cookie.model';
import { Crookie } from '../../models/Crookie.model';
import { CrookieService } from '../../services/crookie.service';
@Component({
  selector: 'app-nuestros-productos',
  standalone: true,
  imports: [RouterLinkWithHref,HttpClientModule,CardProductComponent],
  templateUrl: './nuestros-productos.component.html',
  styleUrl: './nuestros-productos.component.css',
})


export class NuestrosProductosComponent {

  private cookieService = inject(CookieService);
  private crookieService = inject(CrookieService);

  cookies = signal<null | Cookie[]>(null);
  crookies = signal<null | Crookie[]>(null);

  ngOnInit() {
    this.loadCookies();
    this.loadCrookies();
  }

  private loadCookies() {
    this.cookieService.getAllCookies().subscribe({
      next: (response: any) => {
        console.log('Cookies:', response);
        this.cookies.set(response);
      },
      error: (error) => console.log('Error cargando cookies:', error)
    });
  }

  private loadCrookies() {
    this.crookieService.getAllCrookies().subscribe({
      next: (response: any) => {
        console.log('Crookies:', response);
        this.crookies.set(response);
      },
      error: (error) => console.log('Error cargando crookies:', error)
    });
  }
}
