import { getAuth } from '@angular/fire/auth';
import { ChangeDetectorRef, Component } from '@angular/core';
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
  stripeCustomer!: StripeCustomer;

  constructor(private http: HttpClient, public bgAuth: BgAuthService,private changeDetectorRef: ChangeDetectorRef) {}

  async subscribeStripe_deprecated() {
    // subscribe avec un lien preetablit par stripe ouvert dans une nouvelle fenetre
    console.log('subscribe clicked');
    window.open(
      'https://buy.stripe.com/test_dRm3cv4aY1jPbRfaAUe7m02',
      '_blank'
    );
  }

  priceIdStripeOneTime = {id:'price_1SBWfpI256EUPY44i7gmazbu',mode:'payment'};
  priceIdStripeAbonnement={id:'price_1SC2ZiI256EUPY44UFeNCj8x',mode:'subscription'};
  mettreAJourInfosStripeCustomer() {
    this.http
      .get<{
        object: string;
        data: Array<StripeCustomer>;
        has_more: boolean;
        url: string;
      }>(
        'https://europe-west1-job4you-78ed0.cloudfunctions.net/bgstripegetclient?email=' +
          this.getEmail(),
        {}
      )
      .subscribe({
        next: (res) => {
          console.log('Response from bgstripeCustomers:', res);
          const object = res.object;
          const url = res.url;
          const data: Array<StripeCustomer> = res.data;
          if (data.length > 0) {
            this.stripeCustomer = data[0];
            this.idStripe = this.stripeCustomer.id;
            console.log('Client Stripe ID:', this.idStripe);
            this.changeDetectorRef.detectChanges();
          }
          const has_more = res.has_more;
          console.log('object:', object);
          console.log('url:', url);
          console.log('data:', data);
          console.log('has_more:', has_more);
        },
        error: (err) => {
          console.error('Erreur frombgstripeCustomers:', err);
        },
      });
  }

  mettreAJourInfosStripePayments() {
    this.http
      .get<any>(
        'https://europe-west1-job4you-78ed0.cloudfunctions.net/bgstripegetpayments?clientIdStripe=' +
          this.idStripe,
        {}
      )
      .subscribe({
        next: (res) => {
          console.log('Response from bgstripePayments:', res);
        },
        error: (err) => {
          console.error('Erreur frombgstripePayments:', err);
        },
      });
  }
  deleteAbonnement() {
    throw new Error('Method not implemented.');
  }

  /*
  Recupere un lien dynamique, vers un "price" de stripe, pour un client stripe donné.
  Il faut don que l'id du client stripe soit connu (this.idStripe)
  Le client stripe est lié à un utilisateur de l'appli via le metadata bgUserId (email)
  Le lien renvoyé par la fonction cloud est ouvert dans une nouvelle fenetre
  Le succesUrl et le cancelUrl sont passés en parametre à la fonction cloud
  Le succesUrl et le cancelUrl sont des pages de l'appli qui seront affichées par stripe après le paiement ou l'annulation
  On obtient le priceIdStripe en créant un produit dans stripe, puis en créant un price pour ce produit (dans le dashboard stripe)
  */
 getStripePaymentLink(priceIdStripe: any) {
    const currentHost = window.location.origin;
    const baseUrl =
      'https://europe-west1-job4you-78ed0.cloudfunctions.net/bgstripegetpaymentlink';
    const params = new URLSearchParams({
      email: this.getEmail() ?? '',
      priceIdStripe: priceIdStripe.id,
      mode: priceIdStripe.mode,
      clientIdStripe: this.idStripe,
      succesUrl: `${currentHost}/merci`,
      cancelUrl: `${currentHost}/cancelStripe`  ,
    });
    this.http.get<any>(`${baseUrl}?${params.toString()}`, {}).subscribe({
      next: (res) => {
        console.log('Response from bgstripegetpaymentlink:', res);
        const url = res.url;
        console.log('url:', url);
        // window.open(url, '_self');
        window.location.href = url;
      },
/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Error handler for getStripePaymentLink.
 * @param {Error} err - The error from the request.
 */
/*******  c718413d-849b-4ee1-8307-2f4a2a3f652f  *******/
      error: (err) => {
        console.error('Erreur from bgstripegetpaymentlink:', err);
      },
    });
  }

  createStripeCustomer() {
    const baseUrl =
      'https://europe-west1-job4you-78ed0.cloudfunctions.net/bgstripecreatecustomer';
    const params = new URLSearchParams({
      email: this.getEmail() ?? '',
    });
    this.http.get<StripeCustomer>(`${baseUrl}?${params.toString()}`, {}).subscribe({
      next: (res) => {
        console.log('Response from bgstripecreatecustomer:', res);
      },
      error: (err) => {
        console.error('Erreur from bgstripecreatecustomer:', err);
      },
    });
  }

  searchCustomersByBgUserId() {
    const baseUrl =
      'https://europe-west1-job4you-78ed0.cloudfunctions.net/bgstripesearchclientsbybguserid';
    const params = new URLSearchParams({
      email: this.getEmail() ?? '',
    });
    this.http.get<any>(`${baseUrl}?${params.toString()}`, {}).subscribe({
      next: (res) => {
        console.log('Response from bgstripesearchclientsbybguserid:', res);
        const ListClients: Array<StripeCustomer> = res.data;
        console.log('ListClients:', ListClients);
        if (ListClients.length > 0) {
          this.stripeCustomer = ListClients[0];
          this.idStripe = this.stripeCustomer.id;
          console.log('Client Stripe ID:', this.idStripe);
        }
      },
      error: (err) => {
        console.error('Erreur from bgstripesearchclientsbybguserid:', err);
      },
    });
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
