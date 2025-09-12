import express, {Request, Response} from "express";
import cors from "cors";
import {allowedOrigins} from "./BgCors";
import Stripe from "stripe";

export const functionBgStripe = express();

// Use environment variable for secret key!
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_xxx";
const stripe = new Stripe(stripeSecretKey, {apiVersion: "2025-08-27.basil"});

functionBgStripe.use(cors({origin: allowedOrigins}));

// eslint-disable-next-line max-len
functionBgStripe.post("/", async (req: Request, res: Response) => {
  try {
    // In real usage, get priceId and customer details from req.body
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{
        // eslint-disable-next-line max-len
        price: "price_xxx", // TODO: replace with actual price ID from Stripe dashboard
        quantity: 1,
      }],
      success_url: "https://ton-site.com/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://ton-site.com/cancel",
    });
    res.json({url: session.url});
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({error: "Unable to create checkout session."});
  }
});
