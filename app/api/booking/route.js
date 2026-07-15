import { NextResponse } from "next/server";
import { getSessionById, getSettings } from "@/lib/sanity/client";
import { assertWriteClient } from "@/lib/sanity/writeClient";
import {
  generateVariableSymbol,
  seatsAvailable,
  sendBookingEmail
} from "@/lib/booking";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function bad(message, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

function validateEmail(value) {
  return typeof value === "string" && /^\S+@\S+\.\S+$/.test(value);
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return bad("Neplatný formát požiadavky.");
  }

  const {
    sessionId,
    customerName,
    customerEmail,
    customerPhone,
    numberOfSeats,
    message,
    paymentMethod,
    consentGdpr
  } = body || {};

  // ─── Validation ───────────────────────────────────────────────────────
  if (!sessionId || typeof sessionId !== "string") {
    return bad("Chýba ID termínu.");
  }
  if (!customerName || customerName.trim().length < 2) {
    return bad("Zadaj svoje meno a priezvisko.");
  }
  if (!validateEmail(customerEmail)) {
    return bad("Zadaj platný e-mail.");
  }
  const seats = Number(numberOfSeats);
  if (!Number.isInteger(seats) || seats < 1 || seats > 20) {
    return bad("Počet miest musí byť celé číslo medzi 1 a 20.");
  }
  if (paymentMethod !== "bank_transfer" && paymentMethod !== "card") {
    return bad("Vyber spôsob platby.");
  }
  const stripe = paymentMethod === "card" ? getStripe() : null;
  if (paymentMethod === "card" && !stripe) {
    return bad(
      "Platba kartou momentálne nie je dostupná. Prosím, použi bankový prevod."
    );
  }
  if (consentGdpr !== true) {
    return bad(
      "Pre dokončenie rezervácie potvrď súhlas so spracovaním údajov."
    );
  }

  // ─── Session + capacity check ────────────────────────────────────────
  const session = await getSessionById(sessionId);
  if (!session) {
    return bad("Termín sa nenašiel.", 404);
  }
  if (session.status !== "open") {
    return bad("Tento termín už nie je dostupný na rezervácie.");
  }
  const available = seatsAvailable(session);
  if (seats > available) {
    return bad(
      `Bohužiaľ, na tento termín už zostáva len ${available} ${
        available === 1 ? "voľné miesto" : "voľných miest"
      }.`
    );
  }

  // ─── Create booking ──────────────────────────────────────────────────
  const writeClient = assertWriteClient();
  const totalAmount = Number((session.price * seats).toFixed(2));
  const variableSymbol = generateVariableSymbol();

  let booking;
  try {
    booking = await writeClient.create({
      _type: "booking",
      session: { _type: "reference", _ref: session._id },
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      customerPhone: (customerPhone || "").trim() || undefined,
      numberOfSeats: seats,
      message: (message || "").trim() || undefined,
      paymentMethod,
      status: "awaiting_payment",
      totalAmount,
      variableSymbol,
      consentGdpr: true,
      confirmationEmailSent: false
    });
  } catch (err) {
    console.error("Failed to create booking:", err);
    return bad(
      "Rezerváciu sa nepodarilo uložiť. Skús to ešte raz, alebo nám napíš.",
      500
    );
  }

  const settings = await getSettings();

  // ─── Card: hand off to Stripe Checkout ───────────────────────────────
  if (paymentMethod === "card") {
    const origin =
      (settings?.url || "").replace(/\/$/, "") ||
      new URL(request.url).origin;
    let checkout;
    try {
      checkout = await stripe.checkout.sessions.create({
        mode: "payment",
        locale: "sk",
        customer_email: booking.customerEmail,
        line_items: [
          {
            quantity: seats,
            price_data: {
              currency: "eur",
              unit_amount: Math.round(session.price * 100),
              product_data: {
                name: session.workshop?.title || "Workshop"
              }
            }
          }
        ],
        metadata: { bookingId: booking._id },
        payment_intent_data: { metadata: { bookingId: booking._id } },
        success_url: `${origin}/rezervacia/dakujeme/${booking._id}?platba=ok`,
        cancel_url: `${origin}/rezervacia/${sessionId}?platba=zrusena`
      });
    } catch (err) {
      console.error("Stripe checkout creation failed:", err);
      // Don't leave an orphan awaiting_payment booking the customer can't pay.
      await writeClient
        .patch(booking._id)
        .set({
          status: "cancelled",
          internalNotes:
            "Automaticky zrušené — vytvorenie Stripe platby zlyhalo."
        })
        .commit()
        .catch(() => {});
      return bad(
        "Platbu kartou sa nepodarilo pripraviť. Skús to ešte raz, alebo použi bankový prevod.",
        502
      );
    }

    await writeClient
      .patch(booking._id)
      .set({ stripeSessionId: checkout.id })
      .commit()
      .catch(err =>
        console.warn("Failed to store Stripe session id:", err)
      );

    return NextResponse.json({
      ok: true,
      bookingId: booking._id,
      checkoutUrl: checkout.url
    });
  }

  // ─── Bank transfer: send payment instructions email ──────────────────
  try {
    await sendBookingEmail({
      type: "bank_transfer_instructions",
      booking,
      session,
      workshop: session.workshop,
      settings
    });
  } catch (err) {
    console.warn("Booking email failed (non-blocking):", err);
  }

  return NextResponse.json({ ok: true, bookingId: booking._id });
}
