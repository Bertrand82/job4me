import {environmentKeysBack} from "./environnement_keys_back";
/* eslint-disable max-len */
import express, {Request, Response} from "express";
import cors from "cors";
import {allowedOrigins} from "./BgCors";

export const functionBgStripeGetInvoiceById = express();

const stripeSecretKey = environmentKeysBack.qk1+environmentKeysBack.qK2+environmentKeysBack.qk3;

functionBgStripeGetInvoiceById.use(cors({origin: allowedOrigins}));
// eslint-disable-next-line max-len
functionBgStripeGetInvoiceById.get("/", async (req: Request, res: Response) => {
  console.log("Requête get bgStripePayment reçue :", req);
  try {
    const invoiceId = req.query.invoiceId;

    const response = await fetch(`https://api.stripe.com/v1/invoices/${encodeURIComponent(invoiceId as string)}`, {
      headers: {"Authorization": `Bearer ${stripeSecretKey}`},
    });
    const data = await response.json();
    console.log(data);
    res.status(200).json(data);
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({error: "BG Unable to get Invoice."});
  }
});
