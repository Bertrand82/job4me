import {environmentKeysBack} from "./environnement_keys_back";
/* eslint-disable max-len */
import express, {Request, Response} from "express";
import cors from "cors";
import {allowedOrigins} from "./BgCors";

/**
 * Créer une session de paiement Stripe pour un client existant
 */
export const functionBgStripeCreateCustomer = express();

const stripeSecretKey = environmentKeysBack.qk1+environmentKeysBack.qK2+environmentKeysBack.qk3;

functionBgStripeCreateCustomer.use(cors({origin: allowedOrigins}));

// eslint-disable-next-line max-len
functionBgStripeCreateCustomer.get("/", async (req: Request, res: Response) => {
  console.log("Requête get bgStripePayment reçue :", req);
  try {
    const STRIPE_API_URL = "https://api.stripe.com/v1/customers";

    const emailCustomer = req.query.email as string;
    const body = new URLSearchParams({
      "email": emailCustomer,
      "metadata[bgUserId]": emailCustomer,
      "metadata[createdBy]": "bgV0001",
    });
    console.log("Client ID Stripe:", emailCustomer);
    const response = await fetch(`${STRIPE_API_URL}`, {
      method: "POST",
      body: body,
      headers: {
        "Authorization": `Bearer ${stripeSecretKey}`,
        "content-type": "application/x-www-form-urlencoded",
      },
    });
    const data = await response.json();
    console.log("data Stripe:", data, emailCustomer); // contient la liste des clients
    // ==> On retourne la réponse Stripe au client
    res.status(200).json(data);
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({error: "Unable to create bgStripe."+err});
  }
});
