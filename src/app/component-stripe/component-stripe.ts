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
  idStripe: any;
  stripeCustomer!: StripeCustomer | null;
  priceIdStripeOneTime = {
    id: 'price_1SBWfpI256EUPY44i7gmazbu',
    mode: 'payment',
  };
  priceIdStripeAbonnement = {
    id: 'price_1SC2ZiI256EUPY44UFeNCj8x',
    mode: 'subscription',
  };

  constructor(
    private http: HttpClient,
    public bgAuth: BgAuthService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}
  ngOnInit() {
    this.stripeCustomer = this.bgAuth.getStripeCustomerFromLocal();
    if (this.stripeCustomer) {
      this.idStripe = this.stripeCustomer.id;
   }
  }
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
          console.log('data Array<StripeCustomer> :', data);
          console.log('data Array<StripeCustomer> length:', data.length);
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
    const currentHost = window.location.origin;
    const baseUrl =
      'https://europe-west1-job4you-78ed0.cloudfunctions.net/bgstripegetpaymentlink';
    const params = new URLSearchParams({
      email: this.getEmail() ?? '',
      priceIdStripe: priceIdStripe.id,
      mode: priceIdStripe.mode,
      clientIdStripe: this.idStripe,
      succesUrl: `${currentHost}/merci`,
      cancelUrl: `${currentHost}/cancelStripe`,
    });
    this.http.get<any>(`${baseUrl}?${params.toString()}`, {}).subscribe({
      next: (res) => {
        console.log('Response from bgstripegetpaymentlink:', res);
        const url = res.url;
        console.log('url:', url);
        // window.open(url, '_self');
        window.location.href = url;
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
    const baseUrl =
      'https://europe-west1-job4you-78ed0.cloudfunctions.net/bgstripecreatecustomer';
    const params = new URLSearchParams({
      email: this.getEmail() ?? '',
    });
    this.http
      .get<StripeCustomer>(`${baseUrl}?${params.toString()}`, {})
      .subscribe({
        next: (res) => {
          console.log('Response from bgstripecreatecustomer:', res);
          this.stripeCustomer = res;
          if (this.stripeCustomer) {
            this.idStripe = this.stripeCustomer.id;
            console.log('Client Stripe ID:', this.idStripe);
            this.bgAuth.saveStripeCustomerInLocal(this.stripeCustomer);
          }
          this.changeDetectorRef.detectChanges();
        },
        error: (err) => {
          console.error('Erreur from bgstripecreatecustomer:', err);
        },
      });
  }

  createStripeCustomerOrCreate() {
    const baseUrl =
      'https://europe-west1-job4you-78ed0.cloudfunctions.net/bgstripesearchclientsbybguseridorcreateclient';
    const params = new URLSearchParams({
      email: this.getEmail() ?? '',
    });
    this.http.get<any>(`${baseUrl}?${params.toString()}`, {}).subscribe({
      next: (res) => {
        console.log('Response from bgstripesearchclientsbybguseridorcreateclient:', res);
        this.stripeCustomer = res;
        if (this.stripeCustomer) {
          this.idStripe = this.stripeCustomer.id;
          console.log('Client Stripe ID:', this.idStripe);
          this.bgAuth.saveStripeCustomerInLocal(this.stripeCustomer);
        }
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        console.error('Erreur from bgstripesearchclientsbybguseridorcreateclient:', err);
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



