import {environmentKeysBack} from "./environnement_keys_back";
/* eslint-disable max-len */
import express, {Request, Response} from "express";
import cors from "cors";
import {allowedOrigins} from "./BgCors";

export const functionBgStripeGetSessionsByClient = express();
// const stripeSecretKeyDefault = "DEFAULTSECERETSTRIPEKEY";
// Use environment variable for secret key!
// const stripeSecretKey = process.env.STRIPE_SECRET_KEY || stripeSecretKeyDefault;
const stripeSecretKey = environmentKeysBack.qk1+environmentKeysBack.qK2+environmentKeysBack.qk3;
// const stripe = new Stripe(stripeSecretKey, {apiVersion: "2025-08-27.basil"});
// const stripe = new Stripe(stripeSecretKey);

// const site ="https://job4you-78ed0.web.app";
functionBgStripeGetSessionsByClient.use(cors({origin: allowedOrigins}));

// eslint-disable-next-line max-len
functionBgStripeGetSessionsByClient.get("/", async (req: Request, res: Response) => {
  console.log("Requête get bgStripeGetSessionsByClient reçue :", req);
  try {
    const clientIdStripe = req.query.clientIdStripe;
    // https://api.stripe.com/v1/payment_intents?customer=${clientId}
    const response = await fetch(`https://api.stripe.com/v1/checkout/sessions?customer=${encodeURIComponent(clientIdStripe as string)}`, {
      headers: {"Authorization": `Bearer ${stripeSecretKey}`},
    });
    const data = await response.json();
    console.log(data); // contient la liste des sessions ppour ce client
    // ==> On retourne la réponse Stripe au client
    res.status(200).json(data);
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({error: "Unable to create bgStripe."});
  }
});
