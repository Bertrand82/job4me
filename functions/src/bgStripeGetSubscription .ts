import {environmentKeysBack} from "./environnement_keys_back";
/* eslint-disable max-len */
import express, {Request, Response} from "express";
import cors from "cors";
import {allowedOrigins} from "./BgCors";

/**
 *
https://api.stripe.com/v1/billing_portal/sessions/XXX
Usage:
Accéder à une session du Customer Portal Stripe.
Objectif:
Permettre à un utilisateur de gérer son abonnement: annuler, modifier, changer de carte, consulter ses factures, etc.
Fonctionnement:
Tu crées une session du portail client via Stripe(POST /v1/billing_portal/sessions) et tu obtiens une URL unique.
L’URL /v1/billing_portal/sessions/XXX permet de récupérer une session existante (via GET).
Exemple d’utilisation:
L’utilisateur veut se désabonner, changer son mode de paiement, voir l’historique de ses paiements.
A ne pas confondre avec : https://api.stripe.com/v1/checkout/sessions?customer=xxx qui permet de payer une facture ou un abonnement.
 */
export const functionBgStripeGetSubscription = express();

const stripeSecretKey = environmentKeysBack.qk1+environmentKeysBack.qK2+environmentKeysBack.qk3;

functionBgStripeGetSubscription.use(cors({origin: allowedOrigins}));

// Parse JSON bodies
functionBgStripeGetSubscription.use(express.json());
functionBgStripeGetSubscription.use(express.urlencoded({extended: true})); // Pour parser les formulaires
// eslint-disable-next-line max-len
functionBgStripeGetSubscription.get("/", async (req: Request, res: Response) => {
  console.log("Requete post functionBgStripeGetSubscription recue req:", req);
  console.log("Requete post functionBgStripeGetSubscription recue req.query.clientId:"+ req.query.subscriptionId);
  try {
    const subscriptionId = (req.query.subscriptionId as string) ?? "";
    console.log("Requete post functionBgStripeGetSession subscriptionId :", subscriptionId);


    const response = await fetch(`https://api.stripe.com/v1/subscriptions/${subscriptionId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const data = await response.json();
    console.log(data);
    res.status(200).json(data);
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({error: "BG Unable to create session."});
  }
});
