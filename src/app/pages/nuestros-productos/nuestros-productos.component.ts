import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-nuestros-productos',
  standalone: true,
  imports: [CommonModule, RouterLinkWithHref],
  templateUrl: './nuestros-productos.component.html',
  styleUrl: './nuestros-productos.component.css'
})
export class NuestrosProductosComponent {

}
