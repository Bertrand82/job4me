import { getAuth } from '@angular/fire/auth';
import { ChangeDetectorRef, Component } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';

import { BgAuthService, StripeCustomer, StripeInvoice, StripeSession  } from 'bg-navigation-auth-stripe';
import { BgBackFunctions } from '../services/bg-back-functions';

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
    private changeDetectorRef: ChangeDetectorRef,
    private bgBackFunctions: BgBackFunctions
  ) {}
  ngOnInit() {
    console.log('ComponentStripe ngOnInit');
    this.baseUrl0 = this.bgBackFunctions.getUrlHost();
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

  mettreAJourInfosStripePayments() : void {
    console.log('mettreAJourInfosStripePayments start',this.bgAuth.stripeCustomer);
    const stripeCustomerId = this.getStripeCustomerId();
    if (!stripeCustomerId) {
      console.log('Aucun client Stripe trouvé pour cet utilisateur.');
      this.searchStripeCustomerOrCreate(this.mettreAJourInfosStripePayments2.bind(this)) ;

    }else {
      this.mettreAJourInfosStripePayments2(stripeCustomerId) ;
    }
  }
  mettreAJourInfosStripePayments2(stripeCustomerId: string) : void {
    this.http
      .get<any>(
        `${this.baseUrl0}/bgstripegetpayments2?clientIdStripe=${stripeCustomerId}`,
        {}
      )
      .subscribe({
        next: (res) => {
          console.log('Response from bgstripePayments:', res);
          const listPayments = res.data;
          console.log('listPayments:', listPayments);
          if (!listPayments || listPayments.length === 0) {
            console.log('Aucun paiement trouvé pour ce client Stripe.');
            return;
          }
          listPayments.forEach((payment: any) => {
            const createdDate = new Date(payment.created * 1000);
            const nowTimestamp = Math.floor(Date.now() / 1000); // temps actuel en secondes
            const ageInSeconds = nowTimestamp - payment.created;
            const ageInDays = Math.floor(ageInSeconds / 86400);
            console.log('Payment created date:', createdDate);
            console.log('Payment age in days:', ageInDays);
            const isSubscription = payment.description ==="Subscription creation"
            const latestCharge = payment.latestCharge ;
            const paymentIntentId = payment.id ;
            this.getStripeInvoiceFromPaymentIntent(paymentIntentId);
            if (isSubscription) {
              this.isSubscribed = true;
              this.changeDetectorRef.detectChanges();
            }
            console.log('isSubscription:', isSubscription);
            console.log('latestCharge:', latestCharge);
          });
        },
        error: (err) => {
          console.error('Erreur frombgstripePayments:', err);
        },
      });
  }

  private getStripeInvoiceFromPaymentIntent(paymentIntentId: string) {
    console.log('getStripeInvoiceFromPaymentIntent pour le paymentIntentId :', paymentIntentId);
    this.http
      .get<any>(  `${this.baseUrl0}/bgstripegetinvoicefrompaymentintent2?paymentIntentId=` + paymentIntentId+"&email="+this.getEmail()+"", {})
      .subscribe({
        next: (res) => {
          console.log('Response from bgstripegetinvoicefrompaymentintent2:', res);
        },
        error: (err) => {
          console.error('Erreur from bgstripegetinvoicefrompaymentintent2:', err);
        },
      });
  }

  resilierAbonnement() {
   console.log('resilierAbonnement start');
   const stripeCustomerId = this.getStripeCustomerId();
   if (!stripeCustomerId) {
     console.log('Aucun client Stripe rencontré pour cet utilisateur.');
     this.searchStripeCustomerOrCreate(this.resilierAbonnement2.bind(this));
   } else {
     this.resilierAbonnement2(stripeCustomerId);
   }
  }
  resilierAbonnement2(stripeCustomerId: string) {
    console.log('resilierAbonnement2 pour le stripeCustomerId :', stripeCustomerId);
    this.http
      .post<any>(
        `${this.baseUrl0}/bgstripegetsession2`,
        {
        clientId: stripeCustomerId ,
        urlRetour: window.location.origin + "/moncomptebg"
      }
      )
      .subscribe({
        next: (res) => {
          console.log('Response from bgstripesubscriptionresilience2:', res);
          const url = res.url;
          console.log('url:', url);
          if (url) {
            window.location.href = url;
          }
        },
        error: (err) => {
          console.error('Erreur from bgstripesubscriptionresilience2:', err);
        },
      });
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
      console.error('Paramètre manquant pour Stripe ! email :', this.getEmail());
      console.error('Paramètre manquant pour Stripe ! priceIdStripe :', priceIdStripe);
      console.error('Paramètre manquant pour Stripe ! stripeCustomerId :',  this.getStripeCustomerId());
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

  searchStripeCustomerOrCreate(aCallBack?: (stripeCustomerId: string) => void) {
    const baseUrl =
      `${this.baseUrl0}/bgstripesearchclientsbybguseridorcreateclient2`;
    const params = new URLSearchParams({
      email: this.getEmail() ?? '',
    });
    this.http.get<any>(`${baseUrl}?${params.toString()}`, {}).subscribe({
      next: (res) => {
        console.log('BG Response from bgstripesearchclientsbybguseridorcreateclient:', res);
        this.bgAuth.stripeCustomer = res;
        this.bgAuth.saveStripeCustomerInLocal();
        this.changeDetectorRef.detectChanges();
        if(aCallBack){
          console.log('BG aCallBack :', aCallBack);
          console.log('BG aCallBack getStripeCustomerId :', this.getStripeCustomerId());
          const stripeCustomerId = this.getStripeCustomerId();
          if(stripeCustomerId){
            aCallBack(stripeCustomerId);
          } else {
            console.error('BG Erreur: pas de stripeCustomerId après création ou recherche du client');
          }

        }
      },
      error: (err) => {
        console.error('Erreur from bgstripesearchclientsbybguseridorcreateclient:', err);
      },
    });
  }

  searchCustomersByBgUserId(suite?: () => void) {
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
          this.changeDetectorRef.detectChanges();
          if(suite){
            suite();
          }

        }
      },
      error: (err) => {
        console.error('Erreur from bgstripesearchclientsbybguserid:', err);
      },
    });
  }

searchStripeSessionsByBgUserId() {
  const stripeCustomerId = this.getStripeCustomerId();
  if (!stripeCustomerId) {
    console.log('Aucun client Stripe trouvé pour cet utilisateur.');
    this.searchStripeCustomerOrCreate(this.searchStripeSessionsByBgUserId2.bind(this)) ;
  } else {
    this.searchStripeSessionsByBgUserId2(stripeCustomerId);
  }
}

// Implementation of the missing method
searchStripeSessionsByBgUserId2(stripeCustomerId: string) {

  console.log('searchStripeSessionsByBgUserId2 called with:', stripeCustomerId);
   const baseUrl =
      `${this.baseUrl0}/bgstripegetsessionsbyclient2`;
    const params = new URLSearchParams({
      clientIdStripe: stripeCustomerId,
    });
    this.http.get<any>(`${baseUrl}?${params.toString()}`, {}).subscribe({
      next: (res) => {
        console.log('Response from bgstripegetsessionsbyclient2:', res);
        const listSessions:Array<StripeSession> = res.data;
        console.log('listSessions:', listSessions);
        if (listSessions.length > 0) {
         console.log('Sessions Stripe trouvées pour ce client.');
        for(const session of listSessions){
          const invoiceId = session.invoice;
           console.log('invoiceId :', invoiceId);
           console.log('subscription:', session.subscription);
            console.log('mode:', session.mode);
          if(invoiceId){
            console.log('invoiceId found:', invoiceId);
            this.getStripeInvoiceById(invoiceId);
          }else {
            console.log('No invoiceId found.');
          }
          console.log('Session ID:', session.id, ' - Amount Total:', session.amount_total, ' - Payment Status:', session.payment_status);
        }
      }},
      error: (err) => {
        console.error('Erreur from bgstripegetsessionsbyclient2:', err);
      },
    });
}
  getStripeInvoiceById(invoiceId: any) {
    console.log('getStripeInvoiceById pour le invoiceId :', invoiceId);
    this.http
      .get<StripeInvoice>(  `${this.baseUrl0}/bgstripegetinvoicebyid2?invoiceId=` + invoiceId, {})
      .subscribe({
        next: (res) => {
          console.log('Response from bgstripegetinvoicebyid2:', res);
          const invoice = res ;
        },
        error: (err) => {
          console.error('Erreur from bgstripegetinvoicebyid2:', err);
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



