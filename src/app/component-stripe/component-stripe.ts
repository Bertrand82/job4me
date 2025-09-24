import { getAuth } from '@angular/fire/auth';
import { Component } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { BgAuthService } from '../services/bg-auth-service';

@Component({
  selector: 'component-stripe',
  imports: [],
  templateUrl: './component-stripe.html',
  styleUrl: './component-stripe.css',
})
export class ComponentStripe {
  //
  isSubscribed: any = false;
  idStripe: any;

  constructor(private http: HttpClient, public bgAuth: BgAuthService) {}

  async subscribe() {
    console.log('subscribe clicked');
  }

  mettreAJourInfosAbonnement() {
    this.http
  .get<{ url: string }>(
    'https://europe-west1-job4you-78ed0.cloudfunctions.net/bgstripe/'+this.getEmail(),
    {}
  )
  .subscribe({
    next: (res) => {
      console.log('Response from bgstripe:', res);
    },
    error: (err) => {
      console.error('Erreur frombgstripe:', err);
    }
  });
  }
  deleteAbonnement() {
    throw new Error('Method not implemented.');
  }

  getEmail() {
    if (this.bgAuth.currentUser() !== null) {
      return this.bgAuth.currentUser()?.email;
    } else {
      return 'No name';
    }
  }
}
