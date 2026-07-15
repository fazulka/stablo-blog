/**
 * Server-only Stripe client. Lazily constructed so the app builds and the
 * bank-transfer flow keeps working without Stripe keys configured.
 */

import Stripe from "stripe";

let stripe = null;

export function getStripe() {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) return null;
    stripe = new Stripe(key);
  }
  return stripe;
}

export const stripeEnabled = () =>
  Boolean(process.env.STRIPE_SECRET_KEY);
