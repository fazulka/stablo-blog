/**
 * Booking helpers — variable symbol generation, capacity math, email stubs.
 */

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

/**
 * Stub email sender. Logs payloads to the dev console for now. Will be
 * replaced with Resend once API keys are configured. Returns true on
 * success so callers can record `confirmationEmailSent`.
 */
export async function sendBookingEmail({ type, booking, session, workshop, settings }) {
  if (!type || !booking) {
    return false;
  }
  // TODO: integrate Resend once RESEND_API_KEY is set.
  console.info("[email-stub]", {
    type,
    to: booking.customerEmail,
    bookingId: booking._id,
    variableSymbol: booking.variableSymbol,
    amount: booking.totalAmount,
    workshop: workshop?.title,
    paymentMethod: booking.paymentMethod
  });
  return true;
}
