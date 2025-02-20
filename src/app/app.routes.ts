import { Routes } from '@angular/router';

// componentes
import { HomeComponent } from './pages/home/home.component';
import { QuienSomosComponent } from './pages/quien-somos/quien-somos.component';
import { NuestrosProductosComponent } from './pages/nuestros-productos/nuestros-productos.component';
import{ TusPedidosComponent } from './components/tus-pedidos/tus-pedidos.component';
import { PqrsComponent } from './pages/pqrs/pqrs.component';
import { TerminosYCondicionesComponent } from './pages/terminos-ycondiciones/terminos-ycondiciones.component';


export const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'quienSomos', component: QuienSomosComponent},
    { path:'nuestrosProductos', component: NuestrosProductosComponent},
    {path:'tusPedidos', component: TusPedidosComponent},
    {path: 'pqrs', component: PqrsComponent},
    {path:'TyC', component: TerminosYCondicionesComponent},
];
