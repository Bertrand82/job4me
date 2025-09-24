/* eslint-disable max-len */
import express, {Request, Response} from "express";
import cors from "cors";
import {allowedOrigins} from "./BgCors";


export const functionBgStripe = express();
// const stripeSecretKeyDefault = "DEFAULTSECERETSTRIPEKEY";
// Use environment variable for secret key!
// const stripeSecretKey = process.env.STRIPE_SECRET_KEY || stripeSecretKeyDefault;
const stripeSecretKey = "sk_test_51S673mI256EUPY44B5XOVWv7G3WvmxNYepC3Nayxuilh9mytpwwU5EexdC2LQRUrznxQMY2PkSRjgQEFTxnWxM4w00E4UkwyH4";
// const stripe = new Stripe(stripeSecretKey, {apiVersion: "2025-08-27.basil"});
// const stripe = new Stripe(stripeSecretKey);

// const site ="https://job4you-78ed0.web.app";
functionBgStripe.use(cors({origin: allowedOrigins}));

// eslint-disable-next-line max-len
functionBgStripe.get("/", async (req: Request, res: Response) => {
  console.log("Requête get bgStripe reçue :", req);
  try {
    const email = req.query.email;

    const response = await fetch(`https://api.stripe.com/v1/customers?email=${encodeURIComponent(email as string)}`, {
      headers: {"Authorization": `Bearer ${stripeSecretKey}`},
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
