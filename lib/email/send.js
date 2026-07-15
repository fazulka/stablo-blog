/**
 * Thin wrapper around Resend. Sends from ahoj@tvorivko.sk (override with
 * EMAIL_FROM). When RESEND_API_KEY is missing (local dev), falls back to
 * logging the payload so the booking flow keeps working without keys.
 */

import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

const FROM = process.env.EMAIL_FROM || "Tvorivko <ahoj@tvorivko.sk>";

export const emailEnabled = Boolean(apiKey);

/**
 * Send a single email. Returns true when the email was accepted by Resend
 * (or logged in dev mode), false on failure — callers treat email as
 * non-blocking, so we never throw.
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo
}) {
  if (!resend) {
    console.info("[email-dev]", { to, subject, text });
    return true;
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to,
      subject,
      html,
      text,
      replyTo: replyTo || undefined
    });
    if (error) {
      console.error("Resend error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to send email:", err);
    return false;
  }
}
