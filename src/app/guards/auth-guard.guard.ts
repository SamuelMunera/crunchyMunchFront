import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthServices } from '../services/auth-admin.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
  constructor(
    private authService: AuthServices,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Verificar si el usuario está autenticado y es un superadmin
    if (this.authService.isAdminLoggedIn()) {
      return true;
    }

    // Si no está autenticado como superadmin, redirigir al login
    this.router.navigate(['/admin-login']);
    return false;
  }
}