import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { QuienSomosComponent } from './quien-somos/quien-somos.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    { path: 'quienSomos', component: QuienSomosComponent},
];
