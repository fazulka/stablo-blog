import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSettings } from "@/lib/sanity/client";
import { assertWriteClient } from "@/lib/sanity/writeClient";
import { bookingByIdQuery } from "@/lib/sanity/groq";
import { sendBookingEmail } from "@/lib/booking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Stripe webhook — configure in the Stripe dashboard:
 *   URL:    https://tvorivko.sk/api/stripe/webhook
 *   Events: checkout.session.completed, checkout.session.expired
 * Set the endpoint's signing secret as STRIPE_WEBHOOK_SECRET.
 *
 * On successful payment the booking flips to `paid` and the customer gets
 * the confirmation email. `confirmationEmailSent` is set in the same patch
 * as the status change, so the Sanity booking webhook doesn't double-send.
 */
export async function POST(request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json(
      { ok: false, error: "Stripe is not configured" },
      { status: 500 }
    );
  }

  const signature = request.headers.get("stripe-signature");
  const payload = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      secret
    );
  } catch (err) {
    console.error(
      "Stripe signature verification failed:",
      err.message
    );
    return NextResponse.json(
      { ok: false, error: "Invalid signature" },
      { status: 400 }
    );
  }

  if (
    event.type !== "checkout.session.completed" &&
    event.type !== "checkout.session.expired"
  ) {
    return NextResponse.json({ ok: true, ignored: event.type });
  }

  const checkoutSession = event.data.object;
  const bookingId = checkoutSession.metadata?.bookingId;
  if (!bookingId) {
    console.warn(
      "Stripe event without bookingId metadata:",
      event.id
    );
    return NextResponse.json({ ok: true, skipped: true });
  }

  const writeClient = assertWriteClient();
  const booking = await writeClient.fetch(bookingByIdQuery, {
    id: bookingId
  });
  if (!booking) {
    console.warn("Stripe event for unknown booking:", bookingId);
    return NextResponse.json({ ok: true, skipped: true });
  }

  // ─── Checkout expired: release the unpaid booking ────────────────────
  if (event.type === "checkout.session.expired") {
    if (booking.status === "awaiting_payment") {
      await writeClient
        .patch(bookingId)
        .set({
          status: "cancelled",
          internalNotes:
            "Automaticky zrušené — platnosť Stripe platby vypršala bez zaplatenia."
        })
        .commit();
    }
    return NextResponse.json({ ok: true });
  }

  // ─── Payment completed ───────────────────────────────────────────────
  if (booking.status === "paid") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  let emailSent = false;
  try {
    const settings = await getSettings();
    emailSent = await sendBookingEmail({
      type: "payment_confirmed",
      booking,
      session: booking.session,
      workshop: booking.session?.workshop,
      settings
    });
  } catch (err) {
    console.warn("Confirmation email failed (non-blocking):", err);
  }

  // If the email failed, leave confirmationEmailSent false — the Sanity
  // booking webhook fires on this status change and retries it.
  const patch = {
    status: "paid",
    paidAt: new Date().toISOString(),
    confirmationEmailSent: emailSent
  };
  const paymentIntentId =
    typeof checkoutSession.payment_intent === "string"
      ? checkoutSession.payment_intent
      : checkoutSession.payment_intent?.id;
  if (paymentIntentId) {
    patch.stripePaymentIntentId = paymentIntentId;
  }
  await writeClient.patch(bookingId).set(patch).commit();

  return NextResponse.json({ ok: true });
}
