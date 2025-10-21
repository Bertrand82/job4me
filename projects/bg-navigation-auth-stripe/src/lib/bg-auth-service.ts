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



export interface StripeInvoice {
  id: string;
  object: string;
  account_country: string;
  account_name: string;
  account_tax_ids: string[] | null;
  amount_due: number;
  amount_overpaid: number;
  amount_paid: number;
  amount_remaining: number;
  amount_shipping: number;
  application: string | null;
  attempt_count: number;
  attempted: boolean;
  auto_advance: boolean;
  automatic_tax: {
    disabled_reason: string | null;
    enabled: boolean;
    liability: string | null;
    provider: string | null;
    status: string | null;
  };
  automatically_finalizes_at: number | null;
  billing_reason: string;
  collection_method: string;
  created: number;
  currency: string;
  custom_fields: any | null;
  customer: string;
  customer_address: any | null;
  customer_email: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  customer_shipping: any | null;
  customer_tax_exempt: string;
  customer_tax_ids: any[];
  default_payment_method: string | null;
  default_source: string | null;
  default_tax_rates: any[];
  description: string | null;
  discounts: any[];
  due_date: number | null;
  effective_at: number;
  ending_balance: number;
  footer: string | null;
  from_invoice: any | null;
  hosted_invoice_url: string | null;
  invoice_pdf: string | null;
  issuer: {
    type: string;
  };
  last_finalization_error: any | null;
  latest_revision: any | null;
  lines: {
    object: string;
    data: Array<{
      id: string;
      object: string;
      amount: number;
      currency: string;
      description: string;
      discount_amounts: any[];
      discountable: boolean;
      discounts: any[];
      invoice: string;
      livemode: boolean;
      metadata: Record<string, any>;
      parent: {
        invoice_item_details: any | null;
        subscription_item_details?: {
          invoice_item: string | null;
          proration: boolean;
          proration_details: {
            credited_items: any | null;
          };
          subscription: string;
          subscription_item: string;
        };
        type: string;
      };
      period: {
        end: number;
        start: number;
      };
      pretax_credit_amounts: any[];
      pricing: {
        price_details?: {
          price: string;
          product: string;
        };
        type: string;
        unit_amount_decimal: string;
      };
      quantity: number;
      taxes: any[];
    }>;
    has_more: boolean;
    total_count: number;
    url: string;
  };
  livemode: boolean;
  metadata: Record<string, any>;
  next_payment_attempt: number | null;
  number: string;
  on_behalf_of: string | null;
  parent: {
    quote_details: any | null;
    subscription_details?: {
      metadata: Record<string, any>;
      subscription: string;
    };
    type: string;
  };
  payment_settings: {
    default_mandate: string | null;
    payment_method_options: {
      acss_debit: any | null;
      bancontact: any | null;
      card?: {
        request_three_d_secure: string;
      };
      customer_balance: any | null;
      konbini: any | null;
      sepa_debit: any | null;
      us_bank_account: any | null;
    };
    payment_method_types: string[] | null;
  };
  period_end: number;
  period_start: number;
  post_payment_credit_notes_amount: number;
  pre_payment_credit_notes_amount: number;
  receipt_number: string | null;
  rendering: any | null;
  shipping_cost: any | null;
  shipping_details: any | null;
  starting_balance: number;
  statement_descriptor: string | null;
  status: string;
  status_transitions: {
    finalized_at: number | null;
    marked_uncollectible_at: number | null;
    paid_at: number | null;
    voided_at: number | null;
  };
  subtotal: number;
  subtotal_excluding_tax: number;
  test_clock: any | null;
  total: number;
  total_discount_amounts: any[];
  total_excluding_tax: number;
  total_pretax_credit_amounts: any[];
  total_taxes: any[];
  webhooks_delivered_at: number | null;
}

export interface StripeSession {
  id: string;
  object: string;
  adaptive_pricing: {
    enabled: boolean;
  };
  after_expiration: any | null;
  allow_promotion_codes: boolean | null;
  amount_subtotal: number;
  amount_total: number;
  automatic_tax: {
    enabled: boolean;
    liability: any | null;
    provider: any | null;
    status: any | null;
  };
  billing_address_collection: any | null;
  branding_settings: {
    background_color: string;
    border_style: string;
    button_color: string;
    display_name: string;
    font_family: string;
    icon: string | null;
    logo: string | null;
  };
  cancel_url: string;
  client_reference_id: string | null;
  client_secret: string | null;
  collected_information: {
    business_name: string | null;
    individual_name: string | null;
    shipping_details: any | null;
  };
  consent: any | null;
  consent_collection: any | null;
  created: number;
  currency: string;
  currency_conversion: any | null;
  custom_fields: any[];
  custom_text: {
    after_submit: string | null;
    shipping_address: string | null;
    submit: string | null;
    terms_of_service_acceptance: string | null;
  };
  customer: string;
  customer_creation: string | null;
  customer_details: {
    address: {
      city: string | null;
      country: string | null;
      line1: string | null;
      line2: string | null;
      postal_code: string | null;
      state: string | null;
    };
    business_name: string | null;
    email: string | null;
    individual_name: string | null;
    name: string | null;
    phone: string | null;
    tax_ids: any[];
  };
  customer_email: string | null;
  discounts: any[];
  expires_at: number;
  invoice: string | null;
  invoice_creation: {
    enabled: boolean;
    invoice_data: {
      account_tax_ids: string[] | null;
      custom_fields: any | null;
      description: string | null;
      footer: string | null;
      issuer: any | null;
      metadata: Record<string, any>;
      rendering_options: any | null;
    };
  };
  livemode: boolean;
  locale: string | null;
  metadata: {
    [key: string]: string;
  };
  mode: string;
  origin_context: any | null;
  payment_intent: string | null;
  payment_link: string | null;
  payment_method_collection: string;
  payment_method_configuration_details: {
    id: string;
    parent: string | null;
  };
  payment_method_options: {
    card: {
      request_three_d_secure: string;
    };
  };
  payment_method_types: string[];
  payment_status: string;
  permissions: any | null;
  phone_number_collection: {
    enabled: boolean;
  };
  recovered_from: any | null;
  saved_payment_method_options: {
    allow_redisplay_filters: string[];
    payment_method_remove: string;
    payment_method_save: string | null;
  };
  setup_intent: string | null;
  shipping_address_collection: any | null;
  shipping_cost: any | null;
  shipping_options: any[];
  status: string;
  submit_type: string | null;
  subscription: string | null;
  success_url: string;
  total_details: {
    amount_discount: number;
    amount_shipping: number;
    amount_tax: number;
  };
  ui_mode: string;
  url: string | null;
  wallet_options: any | null;
}

