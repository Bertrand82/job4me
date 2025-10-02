import { getAuth } from '@angular/fire/auth';
import { ChangeDetectorRef, Component } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { BgAuthService, StripeCustomer } from '../services/bg-auth-service';

@Component({
  selector: 'component-stripe',
  imports: [],
  templateUrl: './component-stripe.html',
  styleUrl: './component-stripe.css',
})
export class ComponentStripe {

  //
  isSubscribed: any = false;

  priceIdStripeOneTime = {
    id: 'price_1SBWfpI256EUPY44i7gmazbu',
    mode: 'payment',
  };
  priceIdStripeAbonnement = {
    id: 'price_1SC2ZiI256EUPY44UFeNCj8x',
    mode: 'subscription',
  };

  baseUrl0 =
      'https://europe-west1-job4you-78ed0.cloudfunctions.net/';
  constructor(
    private http: HttpClient,
    public bgAuth: BgAuthService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}
  ngOnInit() {
    console.log('ComponentStripe ngOnInit');
  }
  mettreAJourInfosStripeCustomer() {
    this.http
      .get<{
        object: string;
        data: Array<StripeCustomer>;
        has_more: boolean;
        url: string;
      }>(
        `${this.baseUrl0}/bgstripegetclient2?email=` +
          this.getEmail(),
        {}
      )
      .subscribe({
        next: (res) => {
          console.log('Response from bgstripeCustomers:', res);
          const object = res.object;
          const url = res.url;
          const data: Array<StripeCustomer> = res.data;
          console.log('data Array<StripeCustomer> :', data);
          console.log('data Array<StripeCustomer> length:', data.length);
          if (data.length > 0) {
            this.bgAuth.stripeCustomer = data[0];
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
        `${this.baseUrl0}/bgstripegetpayments2?clientIdStripe=` +
          this.getStripeCustomerId(),
        {}
      )
      .subscribe({
        next: (res) => {
          console.log('Response from bgstripePayments:', res);
          const listPayments = res.data;
          console.log('listPayments:', listPayments);
          listPayments.forEach((payment: any) => {
            const createdDate = new Date(payment.created * 1000);
            const nowTimestamp = Math.floor(Date.now() / 1000); // temps actuel en secondes
            const ageInSeconds = nowTimestamp - payment.created;
            const ageInDays = Math.floor(ageInSeconds / 86400);
            console.log('Payment created date:', createdDate);
            console.log('Payment age in days:', ageInDays);
            const isSubscription = payment.description ==="Subscription creation"
            const latestCharge = payment.latestCharge ;
            console.log('isSubscription:', isSubscription);
            console.log('latestCharge:', latestCharge);
          });
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
    console.log('getStripePaymentLink pour le priceIdStripe :', priceIdStripe);
    const currentHost = window.location.origin;

    if (!priceIdStripe?.id || !priceIdStripe?.mode || !this.getStripeCustomerId()  || !this.getEmail()) {
      console.error('Paramètre manquant pour Stripe !', this.getEmail(), priceIdStripe, this.getStripeCustomerId());
    return;
  }
    const params = new URLSearchParams({
      email: this.getEmail() ?? '',
      priceIdStripe: priceIdStripe.id,
      mode: priceIdStripe.mode,
      clientIdStripe: this.getStripeCustomerId() ?? '',
      succesUrl: `${currentHost}/merci`,
      cancelUrl: `${currentHost}/cancelStripe`,
    });
    console.log('Appel de la fonction cloud bgstripegetpaymentlink avec :', params.toString());
    const url0 = `${this.baseUrl0}/bgstripegetpaymentlink2?${params.toString()}`;
    console.log('URL complète:', url0);
    this.http.get<any>(url0, {}).subscribe({
      next: (res) => {
        console.log('Response from bgstripegetpaymentlink:', res);
        const url = res.url;
        console.log('url:', url);
        // window.open(url, '_self');
        if (url){
          window.location.href = url;
        }
        else {
          console.error('Pas de lien de paiement reçu de Stripe !');
          if (res.error) {
            const message = res.error.message;
            console.error('Message d\'erreur Stripe:', message);
            console.error('Erreur Stripe:', res.error);
          }
        }

      },
      error: (err) => {
        console.error('Erreur from bgstripegetpaymentlink:', err);
      },
    });
  }

  /**
   * Attention: appelle une fonction cloud qui crée un client stripe à chaque appel.
   * Il faut donc vérifier avant que le client n'existe pas déjà (recherche par email).
   * Pour cela utiliser la fonction searchCustomersByBgUserId()
    */
  createStripeCustomer() {

    const params = new URLSearchParams({
      email: this.getEmail() ?? '',
    });
    this.http
      .get<StripeCustomer>(`${this.baseUrl0}/bgstripecreatecustomer2?${params.toString()}`, {})
      .subscribe({
        next: (res) => {
          console.log('Response from bgstripecreatecustomer:', res);
          this.bgAuth.stripeCustomer = res;
          this.bgAuth.saveStripeCustomerInLocal();
          this.changeDetectorRef.detectChanges();
        },
        error: (err) => {
          console.error('Erreur from bgstripecreatecustomer:', err);
        },
      });
  }

  createStripeCustomerOrCreate() {
    const baseUrl =
      `${this.baseUrl0}/bgstripesearchclientsbybguseridorcreateclient2`;
    const params = new URLSearchParams({
      email: this.getEmail() ?? '',
    });
    this.http.get<any>(`${baseUrl}?${params.toString()}`, {}).subscribe({
      next: (res) => {
        console.log('Response from bgstripesearchclientsbybguseridorcreateclient:', res);
        this.bgAuth.stripeCustomer = res;
        this.bgAuth.saveStripeCustomerInLocal();
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        console.error('Erreur from bgstripesearchclientsbybguseridorcreateclient:', err);
      },
    });
  }

  searchCustomersByBgUserId() {
    const baseUrl =
      `${this.baseUrl0}/bgstripesearchclientsbybguserid2`;
      console.log('baseUrl:', baseUrl);
    const params = new URLSearchParams({
      email: this.getEmail() ?? '',
    });
    this.http.get<any>(`${baseUrl}?${params.toString()}`, {}).subscribe({
      next: (res) => {
        console.log('Response from bgstripesearchclientsbybguserid:', res);
        const ListClients: Array<StripeCustomer> = res.data;
        console.log('ListClients:', ListClients);
        if (ListClients.length > 0) {
          this.bgAuth.stripeCustomer = ListClients[0];
          console.log('Client Stripe ID:', this.getStripeCustomerId());
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
  getStripeCustomer() {
    return this.bgAuth.stripeCustomer;
  }

  getStripeCustomerId() {
    return this.bgAuth.stripeCustomer?.id;
  }
}



