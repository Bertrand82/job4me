import { Routes } from '@angular/router';
import { ComponentMerci } from './component-merci/component-merci';
import { ComponentStripeCancel } from './component-stripe-cancel/component-stripe-cancel';

export const routes: Routes = [
   { path: 'merci', component: ComponentMerci },
  { path: 'cancelStripe', component: ComponentStripeCancel },
  // Route par défaut
  { path: '', redirectTo: '', pathMatch: 'full' }
];
