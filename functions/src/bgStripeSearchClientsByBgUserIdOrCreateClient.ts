import {environmentKeysBack} from "./environnement_keys_back";
/* eslint-disable max-len */
import express, {Request, Response} from "express";
import cors from "cors";
import {allowedOrigins} from "./BgCors";
import {createStripeCustomer} from "./bgStripeCreateCustomer";

export const functionBgStripeSearchClientsByBgUserIdOrCreateClient = express();
const stripeSecretKey = environmentKeysBack.qk1+environmentKeysBack.qK2+environmentKeysBack.qk3;

functionBgStripeSearchClientsByBgUserIdOrCreateClient.use(cors({origin: allowedOrigins}));

// eslint-disable-next-line max-len
functionBgStripeSearchClientsByBgUserIdOrCreateClient.get("/", async (req: Request, res: Response) => {
  console.log("Requête get bgStripe reçue :", req);
  try {
    const email = req.query.email as string || "";

    const params = new URLSearchParams({
      query: `metadata['bgUserId']:'${email}'`,
    });
    const url = `https://api.stripe.com/v1/customers/search?${params.toString()}`;

    const response = await fetch(url, {
      headers: {"Authorization": `Bearer ${stripeSecretKey}`},
      method: "GET",
    });
    const data = await response.json();
    const ListClients: Array<unknown> = data.data;
    if (ListClients.length > 0) {
      res.status(200).json(ListClients[0]);
    } else {
      // Si aucun client n'est trouvé, on en crée un nouveau
      const newClient = await createStripeCustomer(email);
      res.status(201).json(newClient);
    }
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({error: "Unable to create bgStripe."});
  }
});
