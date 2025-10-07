import {environmentKeysBack} from "./environnement_keys_back";
/* eslint-disable max-len */
import express, {Request, Response} from "express";
import cors from "cors";
import {allowedOrigins} from "./BgCors";

export const functionBgStripeGetInvoiceFromPaymentIntent = express();
const stripeSecretKey = environmentKeysBack.qk1+environmentKeysBack.qK2+environmentKeysBack.qk3;

functionBgStripeGetInvoiceFromPaymentIntent.use(cors({origin: allowedOrigins}));

// eslint-disable-next-line max-len
functionBgStripeGetInvoiceFromPaymentIntent.get("/", async (req: Request, res: Response) => {
  console.log("Requête functionBgStripeGetInvoiceFromPaymentIntent reçue :", req);
  try {
    const email = req.query.email;
    const paymentIntentId = req.query.paymentIntentId;
    console.log("bg 000000000000000000 email:", email);
    console.log("bg 000000000000000000 paymentIntentId:", paymentIntentId);
    const data = await getLastChargeFromPaymentIntent(paymentIntentId as string);
    console.log("searcCustomersById", data); // contient la liste des clients
    // ==> On retourne la réponse Stripe au client
    res.status(200).json(data);
  } catch (err) {
    console.error("bg Error functionBgStripe error get in voice from intentId  :", err);
    res.status(500).json({error: "Bg Y Unable to create invoice.", err: err, paymentIntentId: req.query.paymentIntentId});
  }
});

const STRIPE_API_KEY = stripeSecretKey; // Remplace par ta clé secrète

/**
 * Retrieves the Stripe invoice associated with a given PaymentIntent ID.
 * @param {string} paymentIntentId - The ID of the Stripe PaymentIntent.
 * @return {Promise<any>} The invoice object from Stripe.
 * @throws Error if no charge or invoice is associated with the PaymentIntent.
 */
async function getLastChargeFromPaymentIntent(paymentIntentId: string) {
  const objectRetourned = {charge: null, paymentIntent: null, log: "No bg Log Yet"};
  // 1. Récupérer le PaymentIntent
  const paymentIntentRes = await fetch(
    `https://api.stripe.com/v1/payment_intents/${paymentIntentId}`,
    {
      headers: {
        Authorization: `Bearer ${STRIPE_API_KEY}`,
      },
    }
  );
  try {
    const paymentIntent = await paymentIntentRes.json();
    objectRetourned.paymentIntent = paymentIntent;
    console.log("bg B PaymentIntent récupéré :", paymentIntent);
    const chargeId = paymentIntent.latest_charge;
    if (!chargeId) {
      console.log("bg Z Aucune charge associée au PaymentIntent.");
      objectRetourned.log = "bg Z Aucune charge associée au PaymentIntent.";
      return objectRetourned;
    }
    console.log("bg A ChargeId récupéré :", chargeId);
    // 2. Récupérer la Charge
    const chargeRes = await fetch(
      `https://api.stripe.com/v1/charges/${chargeId}`,
      {
        headers: {
          Authorization: `Bearer ${STRIPE_API_KEY}`,
        },
      }
    );
    const charge = await chargeRes.json();

    objectRetourned.charge = charge;
    console.log("bg A Charge récupérée :\n", charge);


    return objectRetourned;
  } catch (err) {
    console.error("bg Stripe error in getInvoiceFromPaymentIntent:", err);
    objectRetourned.log = "bg Stripe error in getInvoiceFromPaymentIntent:"+err;
    return objectRetourned; // Renvoyer l'objet contenant les erreurs
  }
}
