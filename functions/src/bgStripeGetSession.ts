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
export const functionBgStripeGetSession = express();

const stripeSecretKey = environmentKeysBack.qk1+environmentKeysBack.qK2+environmentKeysBack.qk3;

functionBgStripeGetSession.use(cors({origin: allowedOrigins}));

// Parse JSON bodies
functionBgStripeGetSession.use(express.json());
functionBgStripeGetSession.use(express.urlencoded({extended: true})); // Pour parser les formulaires
// eslint-disable-next-line max-len
functionBgStripeGetSession.post("/", async (req: Request, res: Response) => {
  console.log("Requete post functionBgStripeGetSession recue req:", req);
  console.log("Requete post functionBgStripeGetSession recue req.body:", req.body);
  console.log("Requete post functionBgStripeGetSession recue req.body.clientId:"+ req.body.clientId);
  try {
    const stripeClientId = (req.body.clientId as string) ?? "";
    const urlRetour = (req.body.urlRetour as string) ?? "https://tonsitebg.com/retour"; // adapte cette URL à ton besoin
    console.log("Requete post functionBgStripeGetSession stripeClientId :", stripeClientId);
    console.log("Requete post functionBgStripeGetSession urlRetour :", urlRetour);
    const params = new URLSearchParams({
      customer: stripeClientId,
      return_url: urlRetour,
    });

    const response = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    const data = await response.json();
    console.log(data);
    res.status(200).json(data);
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({error: "BG Unable to create session."});
  }
});
