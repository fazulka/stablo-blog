import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/container";
import {
  Squiggle,
  Sparkle,
  Heart,
  TwirlDivider,
  DoodleField
} from "@/components/dividers";
import { urlForImage } from "@/lib/sanity/image";
import {
  formatLongDate,
  formatTimeRange,
  formatPrice
} from "@/lib/format";
import { getBookingById, getSettings } from "@/lib/sanity/client";

export const metadata = {
  title: "Ďakujem za rezerváciu",
  robots: { index: false, follow: false }
};

export const dynamic = "force-dynamic";

export default async function BookingConfirmationPage({ params }) {
  const [booking, settings] = await Promise.all([
    getBookingById(params.bookingId),
    getSettings()
  ]);

  if (!booking) notFound();

  const session = booking.session;
  const workshop = session?.workshop;
  const dates = session?.dates || [];
  const heroImg = workshop?.mainImage ? urlForImage(workshop.mainImage) : null;
  const isPaid = booking.status === "paid";
  const isBankTransfer = booking.paymentMethod === "bank_transfer";

  return (
    <section className="relative overflow-hidden">
      <DoodleField variant="default" />
      <Container large className="relative !py-12">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <span className="eyebrow">Ďakujem!</span>
            <h1 className="mt-2 text-4xl font-bold leading-tight md:text-5xl">
              {isPaid ? (
                <>
                  Rezervácia je{" "}
                  <span className="font-display text-rose-dark">potvrdená</span>
                </>
              ) : (
                <>
                  Skoro{" "}
                  <span className="font-display text-rose-dark">hotovo</span>
                </>
              )}
            </h1>
            <TwirlDivider color="rose" width={200} className="mt-5" />
            <p className="mx-auto mt-5 max-w-xl text-lg text-ink-soft">
              {isPaid
                ? "Tešíme sa na teba! Detaily si nájdeš nižšie a aj v e-maile."
                : "Tvoja rezervácia je uložená. Stačí ešte zaplatiť — nižšie nájdeš všetky detaily."}
            </p>
          </div>

          {/* Booking summary */}
          <div className="mt-10 overflow-hidden rounded-3xl bg-paper-50 ring-1 ring-paper-200">
            <div className="grid gap-0 md:grid-cols-3">
              {heroImg?.src && (
                <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[220px]">
                  <Image
                    src={heroImg.src}
                    alt={workshop?.mainImage?.alt || workshop?.title || ""}
                    fill
                    sizes="(max-width: 768px) 100vw, 350px"
                    placeholder={workshop?.mainImage?.lqip ? "blur" : "empty"}
                    blurDataURL={workshop?.mainImage?.lqip}
                    className="object-cover"
                  />
                </div>
              )}
              <div className="md:col-span-2 p-6 md:p-8">
                <h2 className="text-2xl font-bold leading-tight">
                  {workshop?.title}
                </h2>
                <dl className="mt-5 space-y-4 text-sm">
                  {dates.length > 0 && (
                    <div>
                      <dt className="flex items-center gap-2 text-xs uppercase tracking-wider text-ink-muted">
                        <Sparkle className="h-3.5 w-3.5 text-rose" />
                        {dates.length > 1
                          ? `${dates.length} stretnutí`
                          : "Termín"}
                      </dt>
                      <dd className="mt-1 space-y-1 font-medium text-ink">
                        {dates.map((d, i) => (
                          <div key={i}>
                            {formatLongDate(d.start)}
                            <span className="text-ink-muted">
                              {" · "}
                              {formatTimeRange(d.start, d.end)}
                            </span>
                          </div>
                        ))}
                      </dd>
                    </div>
                  )}

                  {session?.location && (
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-ink-muted">
                        Miesto
                      </dt>
                      <dd className="mt-0.5 font-medium text-ink">
                        {session.location.name}
                      </dd>
                      {session.location.address && (
                        <dd className="text-ink-muted">
                          {session.location.address}
                          {session.location.city
                            ? `, ${session.location.city}`
                            : ""}
                        </dd>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-ink-muted">
                        Meno
                      </dt>
                      <dd className="mt-0.5 font-medium text-ink">
                        {booking.customerName}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-ink-muted">
                        Počet miest
                      </dt>
                      <dd className="mt-0.5 font-medium text-ink">
                        {booking.numberOfSeats}
                      </dd>
                    </div>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* Payment instructions */}
          {!isPaid && isBankTransfer && (
            <PaymentInstructions booking={booking} settings={settings} />
          )}

          {isPaid && (
            <div className="mt-8 rounded-3xl bg-rose/10 p-6 ring-1 ring-rose-soft md:p-8">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-rose p-2 text-white">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    Tvoje miesto je zarezervované ✓
                  </h3>
                  <p className="mt-2 text-ink-soft">
                    Pošlem ti pripomienkový e-mail pár dní pred workshopom. Ak
                    by si potrebovala čokoľvek upraviť, napíš mi.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Next steps */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/workshopy" className="btn-outline-rose">
              Pozri si ďalšie workshopy
            </Link>
            <Link href="/kontakt" className="btn-rose">
              Mám otázku
            </Link>
          </div>

          <p className="mt-8 text-center text-xs text-ink-muted">
            Číslo rezervácie:{" "}
            <span className="font-mono">{booking._id.slice(-12)}</span>
          </p>
        </div>
      </Container>
    </section>
  );
}

function PaymentInstructions({ booking, settings }) {
  const iban = settings?.bankAccountIban;
  const accountHolder = settings?.bankAccountHolder;
  const bankName = settings?.bankName;
  const hasBank = Boolean(iban);

  return (
    <div className="mt-8 overflow-hidden rounded-3xl bg-rose-light/40 ring-2 ring-rose-soft">
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-rose-dark p-2 text-white">
            <Sparkle className="h-5 w-5 text-white" />
          </div>
          <h3 className="font-display text-3xl text-ink">
            Inštrukcie k platbe
          </h3>
        </div>

        {hasBank ? (
          <>
            <p className="mt-3 text-ink-soft">
              Pošli platbu na tento účet — hneď ako dorazí, potvrdím ti
              rezerváciu e-mailom.
            </p>

            <dl className="mt-6 grid gap-3 sm:grid-cols-2">
              <InfoCell label="Suma" value={formatPrice(booking.totalAmount)} highlight />
              <InfoCell
                label="Variabilný symbol"
                value={booking.variableSymbol}
                mono
                highlight
              />
              <InfoCell label="IBAN" value={iban} mono className="sm:col-span-2" />
              {accountHolder && (
                <InfoCell label="Majiteľ účtu" value={accountHolder} />
              )}
              {bankName && <InfoCell label="Banka" value={bankName} />}
            </dl>

            <div className="mt-5 rounded-2xl bg-paper-50 p-4 text-sm text-ink-soft ring-1 ring-paper-200">
              <p className="font-semibold text-ink">Dôležité:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>
                  Použi presne variabilný symbol{" "}
                  <strong>{booking.variableSymbol}</strong> — podľa neho
                  identifikujem tvoju platbu.
                </li>
                <li>
                  Inštrukcie ti pošlem aj na e-mail{" "}
                  <strong>{booking.customerEmail}</strong>.
                </li>
              </ul>
            </div>
          </>
        ) : (
          <div className="mt-3 rounded-2xl bg-paper-50 p-5 ring-1 ring-paper-200">
            <p className="text-ink-soft">
              Inštrukcie k platbe ti pošlem e-mailom na{" "}
              <strong>{booking.customerEmail}</strong> v priebehu pár hodín.
            </p>
            <p className="mt-2 text-xs text-ink-muted">
              (Bankové údaje ešte nie sú nastavené v CMS — vyplníš ich v
              Nastaveniach stránky a inštrukcie sa zobrazia automaticky.)
            </p>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <InfoCell
                label="Suma"
                value={formatPrice(booking.totalAmount)}
                highlight
              />
              <InfoCell
                label="Variabilný symbol"
                value={booking.variableSymbol}
                mono
                highlight
              />
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCell({ label, value, mono, highlight, className = "" }) {
  return (
    <div
      className={`rounded-2xl p-4 ring-1 ${
        highlight
          ? "bg-paper-50 ring-rose-soft"
          : "bg-paper-50 ring-paper-200"
      } ${className}`}>
      <div className="text-xs uppercase tracking-wider text-ink-muted">
        {label}
      </div>
      <div
        className={`mt-0.5 ${highlight ? "text-xl font-bold" : "font-medium"} text-ink ${
          mono ? "font-mono" : ""
        }`}>
        {value}
      </div>
    </div>
  );
}
