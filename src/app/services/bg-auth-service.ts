import { Injectable, signal } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  sendPasswordResetEmail,
} from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class BgAuthService {
  private userSignal = signal<User | null>(null);


  stripeCustomer!: StripeCustomer | null;
  constructor(public auth: Auth) {
    onAuthStateChanged(this.auth, (user) => {
      this.userSignal.set(user);
    });
    this.stripeCustomer = this.getStripeCustomerFromLocal();
  }

  get currentUser() {
    return this.userSignal.asReadonly();
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login(email: string, password: string) {
    console.log('AAA Tentative de connexion avec email :', email);
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {

    this.stripeCustomer = null;
    this.saveStripeCustomerInLocal();
    return signOut(this.auth);
  }

  sendPasswordResetEmail2(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  loginWithGoogle() {
    const provider = new GoogleAuthProvider();

    signInWithPopup(this.auth, provider)
      .then((result) => {
        // L'utilisateur est connecté
        const user = result.user;
        console.log('Connecté :', user.email);
      })
      .catch((error) => {
        console.error('Erreur lors de la connexion :', error);
        window.alert(error.message);
      });
  }

  saveStripeCustomerInLocal() {
    localStorage.setItem('stripeCustomer', JSON.stringify(this.stripeCustomer));
  }
  getStripeCustomerFromLocal(): StripeCustomer | null {
    const stripeCustomer = localStorage.getItem('stripeCustomer');
    return stripeCustomer ? JSON.parse(stripeCustomer) : null;
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

