import { Routes } from '@angular/router';

// componentes
import { HomeComponent } from './pages/home/home.component';
import { QuienSomosComponent } from './pages/quien-somos/quien-somos.component';
import { CookieProductoComponent } from './pages/cookie-producto/cookie-producto.component';
import { TusPedidosComponent } from './components/tus-pedidos/tus-pedidos.component';
import { PqrsComponent } from './pages/pqrs/pqrs.component';
import { TerminosYCondicionesComponent } from './pages/terminos-ycondiciones/terminos-ycondiciones.component';
import { NuestrosProductosComponent } from './pages/nuestros-productos/nuestros-productos.component';
import { CrookieProductoComponent } from './pages/crookie-producto/crookie-producto.component';
import { BebidasProductoComponent } from './pages/bebidas-producto/bebidas-producto.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AdminAuthGuard } from './guards/auth-guard.guard';
import { CrearToppingsComponent } from './pages/crear-toppings/crear-toppings.component';
import { CrearIceCreamComponent } from './pages/crear-iceCream/crear-iceCream.component';
import { CrearProductosComponent } from './pages/crear-productos/crear-productos.component';
import { MilshakesProductoComponent } from './pages/bebidas-milshakes/milshakes-producto.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'Quien Somos', component: QuienSomosComponent },
  { path: 'Cookie', component: CookieProductoComponent },
  { path: 'Bebidas', component: BebidasProductoComponent },
  { path: 'Crookie', component: CrookieProductoComponent },
  { path: 'Tus Pedidos', component: TusPedidosComponent },
  { path: 'Pqrs', component: PqrsComponent },
  { path: 'TyC', component: TerminosYCondicionesComponent },
  { path: 'Nuestros Productos', component: NuestrosProductosComponent },
  { path: 'Login', component: LoginComponent },
  { path: 'Registro', component: RegisterComponent },
  { path: 'Milkshake', component: MilshakesProductoComponent },
  { path: 'dadada', component: AdminComponent },
  { path: 'admin-login', component: AdminLoginComponent },
  {
    path: 'admin/dashboard',
    component: AdminComponent,
    canActivate: [AdminAuthGuard], // Protege esta ruta con el guard
  },
  {
    path: 'admin/Crear toppings',
    component: CrearToppingsComponent,
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'admin/Crear iceCreams',
    component: CrearIceCreamComponent,
    canActivate: [AdminAuthGuard],
  },
  {path: 'admin/Crear productos',
  component: CrearProductosComponent,
  canActivate: [AdminAuthGuard],
},
  // Otras rutas de la aplicación
  { path: '', redirectTo: '/admin-login', pathMatch: 'full' },
  { path: '**', redirectTo: '/admin-login' },
];
