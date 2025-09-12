import { Component } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'component-stripe',
  imports: [],
  templateUrl: './component-stripe.html',
  styleUrl: './component-stripe.css'
})
export class ComponentStripe {

   constructor(private http: HttpClient) {}

   async subscribe() {
    // Appelle ton backend pour créer la session
    this.http.post<{url: string}>('https://europe-west1-job4you-78ed0.cloudfunctions.net/bgstripe', {}).subscribe(async (res) => {
      window.location.href = res.url; // Redirige l'utilisateur vers Stripe Checkout
    });
  }
}
