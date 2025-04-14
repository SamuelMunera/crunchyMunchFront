import { Component } from '@angular/core';
import { RouterLinkWithHref, Router } from '@angular/router';
import { AuthServices } from '../../services/auth-admin.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLinkWithHref],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  constructor(
    private authService: AuthServices,
    private router: Router
  ) {}
  
  // Verificar en la inicialización que el usuario tiene permisos
  ngOnInit() {
    if (!this.authService.isAdminLoggedIn()) {
      this.router.navigate(['/Admin Login']);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/Admin Login']);
  }
}