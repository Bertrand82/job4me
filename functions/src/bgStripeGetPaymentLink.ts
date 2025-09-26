import {environmentKeysBack} from "./environnement_keys_back";
/* eslint-disable max-len */
import express, {Request, Response} from "express";
import cors from "cors";
import {allowedOrigins} from "./BgCors";

export const functionBgStripeGetPaymentLink = express();

const stripeSecretKey = environmentKeysBack.qk1+environmentKeysBack.qK2+environmentKeysBack.qk3;

functionBgStripeGetPaymentLink.use(cors({origin: allowedOrigins}));

// eslint-disable-next-line max-len
functionBgStripeGetPaymentLink.get("/", async (req: Request, res: Response) => {
  console.log("Requête get bgStripePayment reçue :", req);
  try {
    const STRIPE_API_URL = "https://api.stripe.com/v1/payment_links";
    const clientIdStripe = req.query.clientIdStripe;
    const priceIdStripe = req.query.priceIdStripe as string;
    const emailCustomer = req.query.email as string;
    const succesUrl = req.query.succesUrl as string;
    const cancelUrl = req.query.cancelUrl as string;
    const body = new URLSearchParams({
      "line_items[0][price]": priceIdStripe,
      "line_items[0][quantity]": "1",
      "after_completion[type]": "redirect",
      "customer": emailCustomer,
      "success_url": succesUrl,
      "cancel_url": cancelUrl,
    // Associer l'email au paiement (optionnel, mais Stripe recommande de créer un customer d'abord)
    // 'customer_email': customerEmail, // Stripe n'accepte pas customer_email ici directement
    });
    console.log("Client ID Stripe:", clientIdStripe);
    // https://api.stripe.com/v1/payment_intents?customer=${clientId}
    const response = await fetch(`${STRIPE_API_URL}`, {
      method: "POST",
      body: body,
      headers: {
        "Authorization": `Bearer ${stripeSecretKey}`,
        "content-type": "application/x-www-form-urlencoded",
      },
    });
    const data = await response.json();
    console.log(data); // contient la liste des clients
    // ==> On retourne la réponse Stripe au client
    res.status(200).json(data);
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({error: "Unable to create bgStripe."});
  }
});
