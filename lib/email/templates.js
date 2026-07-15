/**
 * Slovak email templates for the booking flow. Each builder returns
 * { subject, html, text } ready for sendEmail(). Inline styles only —
 * email clients ignore stylesheets. Brand palette mirrors
 * tailwind.config.js: ink on paper with rose accents.
 */

import { formatSessionDate } from "@/lib/format";

const COLORS = {
  ink: "#241F35",
  rose: "#E8809E",
  paper: "#FAF6F0",
  border: "#F0E9DD"
};

const exactPriceFormatter = value =>
  new Intl.NumberFormat("sk-SK", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2
  }).format(value);

function firstName(fullName) {
  return (fullName || "").trim().split(/\s+/)[0] || "";
}

function datesListHtml(dates) {
  if (!Array.isArray(dates) || dates.length === 0) return "";
  return dates
    .map(
      d =>
        `<li style="margin:2px 0;">${formatSessionDate(d.start)}</li>`
    )
    .join("");
}

function datesListText(dates) {
  if (!Array.isArray(dates) || dates.length === 0) return "";
  return dates
    .map(d => `  - ${formatSessionDate(d.start)}`)
    .join("\n");
}

function locationLine(location) {
  if (!location) return "";
  return [location.name, location.address, location.city]
    .filter(Boolean)
    .join(", ");
}

function layout({ heading, bodyHtml, settings }) {
  const siteUrl = settings?.url || "https://tvorivko.sk";
  const contactEmail = settings?.email || "ahoj@tvorivko.sk";
  return `
<div style="background:${COLORS.paper};padding:24px 12px;font-family:'Plus Jakarta Sans',Helvetica,Arial,sans-serif;color:${COLORS.ink};">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid ${COLORS.border};border-radius:16px;overflow:hidden;">
    <div style="padding:28px 32px 0;">
      <p style="margin:0;font-size:22px;font-weight:bold;letter-spacing:0.5px;">Tvorivko <span style="color:${COLORS.rose};">☀</span></p>
    </div>
    <div style="padding:20px 32px 28px;font-size:16px;line-height:1.6;">
      <h1 style="font-size:20px;margin:0 0 16px;">${heading}</h1>
      ${bodyHtml}
      <p style="margin:24px 0 0;">Tešíme sa na teba!<br/>Tvorivko</p>
    </div>
    <div style="padding:16px 32px;border-top:1px solid ${COLORS.border};font-size:13px;color:#6B6481;">
      <p style="margin:0;">Máš otázku? Napíš nám na <a href="mailto:${contactEmail}" style="color:${COLORS.ink};">${contactEmail}</a> · <a href="${siteUrl}" style="color:${COLORS.ink};">${siteUrl.replace(/^https?:\/\//, "")}</a></p>
    </div>
  </div>
</div>`;
}

function sessionSummaryHtml({ session, workshop, booking }) {
  const loc = locationLine(session?.location);
  return `
<table style="width:100%;border-collapse:collapse;background:${COLORS.paper};border-radius:8px;margin:16px 0;font-size:15px;" cellpadding="0" cellspacing="0">
  <tr><td style="padding:14px 16px 4px;font-weight:bold;">${workshop?.title || "Workshop"}</td></tr>
  <tr><td style="padding:0 16px;">
    <ul style="margin:6px 0;padding-left:18px;">${datesListHtml(session?.dates)}</ul>
  </td></tr>
  ${loc ? `<tr><td style="padding:0 16px 4px;">📍 ${loc}</td></tr>` : ""}
  <tr><td style="padding:0 16px 14px;">Počet miest: <strong>${booking.numberOfSeats}</strong> · Spolu: <strong>${exactPriceFormatter(booking.totalAmount)}</strong></td></tr>
</table>`;
}

function sessionSummaryText({ session, workshop, booking }) {
  const loc = locationLine(session?.location);
  return [
    workshop?.title || "Workshop",
    datesListText(session?.dates),
    loc ? `Miesto: ${loc}` : "",
    `Počet miest: ${booking.numberOfSeats}`,
    `Spolu: ${exactPriceFormatter(booking.totalAmount)}`
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Email #1 — sent right after a bank-transfer booking is created.
 * Contains payment instructions (IBAN + variable symbol).
 */
export function bankTransferInstructionsEmail({
  booking,
  session,
  workshop,
  settings
}) {
  const name = firstName(booking.customerName);
  const iban = settings?.bankAccountIban || "";
  const holder = settings?.bankAccountHolder || "";
  const amount = exactPriceFormatter(booking.totalAmount);

  const subject = `Rezervácia prijatá – ${workshop?.title || "workshop"} (čaká na platbu)`;

  const bodyHtml = `
<p style="margin:0 0 12px;">Ahoj${name ? ` ${name}` : ""},</p>
<p style="margin:0 0 12px;">ďakujeme za rezerváciu! Miesto ti držíme — už len uhradiť platbu prevodom a je to.</p>
${sessionSummaryHtml({ session, workshop, booking })}
<table style="width:100%;border-collapse:collapse;border:2px solid ${COLORS.rose};border-radius:8px;font-size:15px;" cellpadding="0" cellspacing="0">
  <tr><td style="padding:14px 16px 4px;font-weight:bold;">Údaje k platbe</td></tr>
  ${holder ? `<tr><td style="padding:2px 16px;">Príjemca: <strong>${holder}</strong></td></tr>` : ""}
  <tr><td style="padding:2px 16px;">IBAN: <strong>${iban}</strong></td></tr>
  <tr><td style="padding:2px 16px;">Suma: <strong>${amount}</strong></td></tr>
  <tr><td style="padding:2px 16px 14px;">Variabilný symbol: <strong>${booking.variableSymbol}</strong></td></tr>
</table>
<p style="margin:16px 0 0;">Prosíme, uhraď platbu do <strong>3 pracovných dní</strong>, inak miesto uvoľníme ďalším záujemcom. Hneď ako nám platba príde, pošleme ti potvrdenie.</p>`;

  const text = `Ahoj${name ? ` ${name}` : ""},

ďakujeme za rezerváciu! Miesto ti držíme — už len uhradiť platbu prevodom a je to.

${sessionSummaryText({ session, workshop, booking })}

ÚDAJE K PLATBE
${holder ? `Príjemca: ${holder}\n` : ""}IBAN: ${iban}
Suma: ${amount}
Variabilný symbol: ${booking.variableSymbol}

Prosíme, uhraď platbu do 3 pracovných dní, inak miesto uvoľníme ďalším záujemcom. Hneď ako nám platba príde, pošleme ti potvrdenie.

Tešíme sa na teba!
Tvorivko`;

  return {
    subject,
    html: layout({
      heading: "Rezervácia prijatá 🎉",
      bodyHtml,
      settings
    }),
    text
  };
}

/**
 * Email #2 — sent when the booking is marked as paid (bank transfer
 * reconciled in Studio, or Stripe payment succeeded).
 */
export function paymentConfirmedEmail({
  booking,
  session,
  workshop,
  settings
}) {
  const name = firstName(booking.customerName);
  const subject = `Máš to! Rezervácia potvrdená – ${workshop?.title || "workshop"}`;

  const bodyHtml = `
<p style="margin:0 0 12px;">Ahoj${name ? ` ${name}` : ""},</p>
<p style="margin:0 0 12px;">platba prišla v poriadku a tvoje miesto je potvrdené. Hurá!</p>
${sessionSummaryHtml({ session, workshop, booking })}
<p style="margin:16px 0 0;">Všetok materiál a pomôcky budú pripravené na mieste. Ak sa čokoľvek zmení, ozvi sa nám čo najskôr — miesto vieme presunúť alebo ponúknuť niekomu ďalšiemu.</p>`;

  const text = `Ahoj${name ? ` ${name}` : ""},

platba prišla v poriadku a tvoje miesto je potvrdené. Hurá!

${sessionSummaryText({ session, workshop, booking })}

Všetok materiál a pomôcky budú pripravené na mieste. Ak sa čokoľvek zmení, ozvi sa nám čo najskôr.

Tešíme sa na teba!
Tvorivko`;

  return {
    subject,
    html: layout({
      heading: "Rezervácia potvrdená ✓",
      bodyHtml,
      settings
    }),
    text
  };
}
