import { Routes } from '@angular/router';
import { ComponentMerci } from './component-merci/component-merci';

export const routes: Routes = [
   { path: 'merci', component: ComponentMerci },
  // Route par défaut
  { path: '', redirectTo: '', pathMatch: 'full' }
];
