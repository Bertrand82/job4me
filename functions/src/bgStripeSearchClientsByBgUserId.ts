import {environmentKeysBack} from "./environnement_keys_back";
/* eslint-disable max-len */
import express, {Request, Response} from "express";
import cors from "cors";
import {allowedOrigins} from "./BgCors";

export const functionBgStripeSearchClientsByBgUserId = express();
const stripeSecretKey = environmentKeysBack.qk1+environmentKeysBack.qK2+environmentKeysBack.qk3;

functionBgStripeSearchClientsByBgUserId.use(cors({origin: allowedOrigins}));

// eslint-disable-next-line max-len
functionBgStripeSearchClientsByBgUserId.get("/", async (req: Request, res: Response) => {
  console.log("Requête get bgStripe reçue :", req);
  try {
    const email = req.query.email;

    const params = new URLSearchParams({
      query: `metadata['bgUserId']:'${email}'`,
    });
    const url = `https://api.stripe.com/v1/customers/search?${params.toString()}`;

    const response = await fetch(url, {
      headers: {"Authorization": `Bearer ${stripeSecretKey}`},
      method: "GET",
    });
    const data = await response.json();
    console.log("searcCustomersById", data); // contient la liste des clients
    // ==> On retourne la réponse Stripe au client
    res.status(200).json(data);
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({error: "Unable to create bgStripe."});
  }
});
