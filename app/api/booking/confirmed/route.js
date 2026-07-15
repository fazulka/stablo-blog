import { NextResponse } from "next/server";
import { getSettings } from "@/lib/sanity/client";
import { assertWriteClient } from "@/lib/sanity/writeClient";
import { bookingByIdQuery } from "@/lib/sanity/groq";
import { sendBookingEmail } from "@/lib/booking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Called by a Sanity webhook whenever a booking document changes. If the
 * booking is paid and the customer hasn't received a confirmation email
 * yet, send it and mark `confirmationEmailSent`. Idempotent — repeated
 * deliveries for the same booking are no-ops.
 *
 * Webhook setup (sanity.io/manage → API → Webhooks):
 *   URL:    https://tvorivko.sk/api/booking/confirmed
 *   Filter: _type == "booking" && status == "paid" && confirmationEmailSent != true
 *   HTTP header: x-webhook-secret: <SANITY_WEBHOOK_SECRET>
 *   Projection: { _id }
 */
export async function POST(request) {
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  const provided =
    request.headers.get("x-webhook-secret") ||
    new URL(request.url).searchParams.get("secret");
  if (!secret || provided !== secret) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const bookingId = body?._id;
  if (!bookingId || typeof bookingId !== "string") {
    return NextResponse.json(
      { ok: false, error: "Missing _id" },
      { status: 400 }
    );
  }

  // Fetch through the write client (no CDN) so we see the status change
  // that triggered the webhook, not a stale cached copy.
  const writeClient = assertWriteClient();
  const booking = await writeClient.fetch(bookingByIdQuery, {
    id: bookingId
  });
  if (!booking) {
    return NextResponse.json(
      { ok: false, error: "Booking not found" },
      { status: 404 }
    );
  }

  if (booking.status !== "paid" || booking.confirmationEmailSent) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const settings = await getSettings();
  const sent = await sendBookingEmail({
    type: "payment_confirmed",
    booking,
    session: booking.session,
    workshop: booking.session?.workshop,
    settings
  });

  if (!sent) {
    // Leave confirmationEmailSent false so the next webhook delivery (or a
    // manual status re-save in Studio) retries the email.
    return NextResponse.json(
      { ok: false, error: "Email failed to send" },
      { status: 502 }
    );
  }

  await writeClient
    .patch(bookingId)
    .set({
      confirmationEmailSent: true,
      paidAt: booking.paidAt || new Date().toISOString()
    })
    .commit();

  return NextResponse.json({ ok: true });
}
