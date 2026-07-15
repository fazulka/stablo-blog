/**
 * Booking helpers — variable symbol generation, capacity math, emails.
 */

import { sendEmail } from "@/lib/email/send";
import {
  bankTransferInstructionsEmail,
  paymentConfirmedEmail
} from "@/lib/email/templates";

/**
 * Generate a 10-digit numeric variable symbol used by Slovak banks to
 * identify a transfer. Format: last 10 digits of current timestamp.
 * Collisions are extremely unlikely for low-volume bookings (one VS per
 * second). If we ever scale up, swap in a counter or hash-based approach.
 */
export function generateVariableSymbol() {
  return String(Date.now()).slice(-10);
}

/**
 * How many seats are still available on a session. `bookedSeats` is the
 * sum of `numberOfSeats` from paid bookings (computed in GROQ).
 */
export function seatsAvailable(session) {
  if (!session) return 0;
  const capacity = session.capacity ?? 0;
  const booked = session.bookedSeats ?? 0;
  return Math.max(0, capacity - booked);
}

const EMAIL_BUILDERS = {
  bank_transfer_instructions: bankTransferInstructionsEmail,
  payment_confirmed: paymentConfirmedEmail
};

/**
 * Build and send a booking email via Resend. Returns true on success so
 * callers can record `confirmationEmailSent`. Never throws — email is
 * non-blocking for the booking flow.
 */
export async function sendBookingEmail({
  type,
  booking,
  session,
  workshop,
  settings
}) {
  if (!booking?.customerEmail) {
    return false;
  }
  const build = EMAIL_BUILDERS[type];
  if (!build) {
    console.warn(`Unknown booking email type: ${type}`);
    return false;
  }
  const { subject, html, text } = build({
    booking,
    session,
    workshop,
    settings
  });
  return sendEmail({
    to: booking.customerEmail,
    subject,
    html,
    text,
    replyTo: settings?.email
  });
}
