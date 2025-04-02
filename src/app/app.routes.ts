import { Routes } from '@angular/router';

// componentes
import { HomeComponent } from './pages/home/home.component';
import { QuienSomosComponent } from './pages/quien-somos/quien-somos.component';
import { CookieProductoComponent } from './pages/cookie-producto/cookie-producto.component';
import{ TusPedidosComponent } from './components/tus-pedidos/tus-pedidos.component';
import { PqrsComponent } from './pages/pqrs/pqrs.component';
import { TerminosYCondicionesComponent } from './pages/terminos-ycondiciones/terminos-ycondiciones.component';
import { NuestrosProductosComponent } from './pages/nuestros-productos/nuestros-productos.component';
import { CrookieProductoComponent } from './pages/crookie-producto/crookie-producto.component';
import { BebidasProductoComponent } from './pages/bebidas-producto/bebidas-producto.component';

export const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'Quien Somos', component: QuienSomosComponent},
    { path:'Cookie', component: CookieProductoComponent},
    { path:'Bebidas', component: BebidasProductoComponent},
    { path:'Crookie', component: CrookieProductoComponent},
    {path:'Tus Pedidos', component: TusPedidosComponent},
    {path: 'Pqrs', component: PqrsComponent},
    {path:'TyC', component: TerminosYCondicionesComponent},
    {path:'Nuestros Productos', component: NuestrosProductosComponent},
    
];
