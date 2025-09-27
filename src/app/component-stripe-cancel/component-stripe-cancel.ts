import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-component-stripe-cancel',
  imports: [],
  templateUrl: './component-stripe-cancel.html',
  styleUrl: './component-stripe-cancel.css'
})
export class ComponentStripeCancel {

  constructor(private router: Router) {}
   close() {
     this.router.navigate(['']);
  }
}
