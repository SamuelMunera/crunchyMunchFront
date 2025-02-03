import { Routes } from '@angular/router';

// componentes
import { HomeComponent } from './home/home.component';
import { QuienSomosComponent } from './quien-somos/quien-somos.component';
import { NuestrosProductosComponent } from './nuestros-productos/nuestros-productos.component';
import{ TusPedidosComponent } from './tus-pedidos/tus-pedidos.component';
import { PqrsComponent } from './pqrs/pqrs.component';
import { TerminosYCondicionesComponent } from './terminos-ycondiciones/terminos-ycondiciones.component';


export const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'quienSomos', component: QuienSomosComponent},
    { path:'nuestrosProductos', component: NuestrosProductosComponent},
    {path:'tusPedidos', component: TusPedidosComponent},
    {path: 'pqrs', component: PqrsComponent},
    {path:'TyC', component: TerminosYCondicionesComponent},
];
