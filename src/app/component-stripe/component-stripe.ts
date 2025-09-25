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
  stripeCustomer!:StripeCustomer

  constructor(private http: HttpClient, public bgAuth: BgAuthService) {}

  async subscribeStripe() {
    console.log('subscribe clicked');
    window.open('https://buy.stripe.com/test_8x25kD22Q4w11cB9wQe7m01', '_blank');
  }

  mettreAJourInfosStripeCustomer() {
    this.http
  .get<{ object: string, data: Array<StripeCustomer>,has_more: boolean, url: string   }>(
    'https://europe-west1-job4you-78ed0.cloudfunctions.net/bgstripegetclient?email=' +  this.getEmail(),
    {}
  )
  .subscribe({
    next: (res) => {
      console.log('Response from bgstripeCustomers:', res);
      const object = res.object;
      const url = res.url
      const data: Array<StripeCustomer> = res.data;
      if (data.length > 0) {
        this.stripeCustomer = data[0];
        this.idStripe = this.stripeCustomer.id;
        console.log('Client Stripe ID:', this.idStripe);
      }
      const has_more = res.has_more;
      console.log('object:', object);
      console.log('url:', url);
      console.log('data:', data);
      console.log('has_more:', has_more);
    },
    error: (err) => {
      console.error('Erreur frombgstripeCustomers:', err);
    }
  });
  }

  mettreAJourInfosStripePayments() {
    this.http
  .get<any>(
    'https://europe-west1-job4you-78ed0.cloudfunctions.net/bgstripegetpayments?clientIdStripe=' +  this.idStripe,
    {}
  )
  .subscribe({
    next: (res) => {
      console.log('Response from bgstripePayments:', res);

    },
    error: (err) => {
      console.error('Erreur frombgstripePayments:', err);
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

export type StripeCustomer = {
  address: {
    city: string | null;
    country: string | null;
    line1: string | null;
    line2: string | null;
    postal_code: string | null;
    state?: string | null;
  };
  balance: number;
  created: number;
  currency: string;
  default_source: string | null;
  delinquent: boolean;
  description: string | null;
  discount: any | null;
  email: string | null;
  id: string;
  invoice_prefix: string;
  invoice_settings: {
    custom_fields: any | null;
    default_payment_method: string | null;
    footer: string | null;
    rendering_options: any | null;
  };
  livemode: boolean;
  metadata: Record<string, any>;
  name: string | null;
  object: string;
  phone: string | null;
  preferred_locales: string[];
  shipping: any | null;
  tax_exempt: string;
  test_clock: any | null;
};
