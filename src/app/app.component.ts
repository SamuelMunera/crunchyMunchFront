import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { QuienSomosComponent } from './pages/quien-somos/quien-somos.component';
import { Router } from '@angular/router';
import { NuestrosProductosComponent } from './pages/nuestros-productos/nuestros-productos.component';
import { PqrsComponent } from './pages/pqrs/pqrs.component';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from './services/cookie.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule,RouterOutlet, HeaderComponent, FooterComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'crunchyMunchFront';
}
