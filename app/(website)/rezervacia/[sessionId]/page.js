import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/container";
import BookingForm from "./bookingForm";
import {
  Squiggle,
  Sparkle,
  DoodleField
} from "@/components/dividers";
import { urlForImage } from "@/lib/sanity/image";
import { formatLongDate, formatTimeRange, formatPrice } from "@/lib/format";
import { seatsAvailable } from "@/lib/booking";
import { getSessionById } from "@/lib/sanity/client";

export const metadata = {
  title: "Rezervácia",
  description: "Rezervuj si miesto na tvorivom workshope v Tvorivku.",
  robots: { index: false, follow: false }
};

export const dynamic = "force-dynamic";

export default async function ReservationPage({ params }) {
  const session = await getSessionById(params.sessionId);
  if (!session) notFound();

  const workshop = session.workshop;
  const heroImg = workshop?.mainImage ? urlForImage(workshop.mainImage) : null;
  const available = seatsAvailable(session);
  const dates = session.dates || [];
  const isMulti = dates.length > 1;
  const closed = session.status !== "open";
  const fullyBooked = !closed && available <= 0;

  return (
    <section className="relative overflow-hidden">
      <DoodleField variant="default" />
      <Container large className="relative !py-12">
        <nav
          className="text-sm text-ink-muted"
          aria-label="Drobčeková navigácia">
          <Link href="/workshopy" className="hover:text-rose-dark">
            Workshopy
          </Link>
          {workshop?.slug && (
            <>
              <span className="mx-2 text-ink-muted/60">›</span>
              <Link
                href={`/workshopy/${workshop.slug}`}
                className="hover:text-rose-dark">
                {workshop.title}
              </Link>
            </>
          )}
          <span className="mx-2 text-ink-muted/60">›</span>
          <span className="text-ink">Rezervácia</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-5">
          {/* Form column */}
          <div className="lg:col-span-3">
            <span className="eyebrow">Rezervácia</span>
            <h1 className="mt-2 text-4xl font-bold leading-tight md:text-5xl">
              Dokonči si{" "}
              <span className="font-display text-rose-dark">miesto</span>
            </h1>
            <Squiggle className="mt-4 w-28 text-rose" />

            {closed ? (
              <ClosedNotice session={session} workshop={workshop} />
            ) : fullyBooked ? (
              <FullNotice workshop={workshop} />
            ) : (
              <div className="mt-8">
                <BookingForm
                  sessionId={session._id}
                  price={session.price}
                  available={available}
                  workshopTitle={workshop?.title || ""}
                />
              </div>
            )}
          </div>

          {/* Summary column */}
          <aside className="lg:col-span-2">
            <div className="sticky top-24 overflow-hidden rounded-3xl bg-paper-50 ring-1 ring-paper-200">
              {heroImg?.src && (
                <div className="relative aspect-[4/3] bg-paper-100">
                  <Image
                    src={heroImg.src}
                    alt={workshop?.mainImage?.alt || workshop?.title || ""}
                    fill
                    sizes="(max-width: 1024px) 100vw, 400px"
                    placeholder={workshop?.mainImage?.lqip ? "blur" : "empty"}
                    blurDataURL={workshop?.mainImage?.lqip}
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-2xl font-bold leading-tight">
                  {workshop?.title}
                </h2>
                {workshop?.shortDescription && (
                  <p className="mt-2 text-sm text-ink-muted">
                    {workshop.shortDescription}
                  </p>
                )}

                <div className="mt-5 space-y-3 border-t border-paper-200 pt-5 text-sm">
                  {dates.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-ink-muted">
                        <Sparkle className="h-3.5 w-3.5 text-rose" />
                        {isMulti
                          ? `${dates.length} stretnutí`
                          : "Termín"}
                      </div>
                      <ul className="mt-1 space-y-1 font-medium text-ink">
                        {dates.map((d, i) => (
                          <li key={i}>
                            {formatLongDate(d.start)}
                            <span className="text-ink-muted">
                              {" · "}
                              {formatTimeRange(d.start, d.end)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {session.location && (
                    <div>
                      <div className="text-xs uppercase tracking-wider text-ink-muted">
                        Miesto
                      </div>
                      <div className="mt-0.5 font-medium text-ink">
                        {session.location.name}
                      </div>
                      {session.location.address && (
                        <div className="text-ink-muted">
                          {session.location.address}
                          {session.location.city
                            ? `, ${session.location.city}`
                            : ""}
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <div className="text-xs uppercase tracking-wider text-ink-muted">
                      Cena za osobu
                    </div>
                    <div className="mt-0.5 text-xl font-bold text-ink">
                      {formatPrice(session.price)}
                    </div>
                  </div>

                  {available > 0 && (
                    <p className="text-xs text-azure-dark">
                      {available === 1
                        ? "Posledné voľné miesto!"
                        : `${available} voľných miest`}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}

function ClosedNotice({ session, workshop }) {
  const isCancelled = session.status === "cancelled";
  return (
    <div className="mt-8 rounded-3xl border-2 border-dashed border-ink-muted/30 bg-paper-50 p-8 text-center">
      <div className="text-5xl">{isCancelled ? "❌" : "💤"}</div>
      <h2 className="mt-4 font-display text-3xl text-ink">
        {isCancelled ? "Termín bol zrušený" : "Termín už nie je dostupný"}
      </h2>
      <p className="mt-3 text-ink-muted">
        Pozri si iné termíny tohto workshopu alebo mi napíš.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {workshop?.slug && (
          <Link
            href={`/workshopy/${workshop.slug}`}
            className="btn-outline-rose">
            Iné termíny
          </Link>
        )}
        <Link href="/kontakt" className="btn-rose">
          Ozvi sa mi
        </Link>
      </div>
    </div>
  );
}

function FullNotice({ workshop }) {
  return (
    <div className="mt-8 rounded-3xl border-2 border-dashed border-rose-soft/50 bg-paper-50 p-8 text-center">
      <div className="text-5xl">🪑</div>
      <h2 className="mt-4 font-display text-3xl text-ink">Vypredané</h2>
      <p className="mt-3 text-ink-muted">
        Tento termín je už plný. Napíš mi a dám ti vedieť o ďalšom.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {workshop?.slug && (
          <Link
            href={`/workshopy/${workshop.slug}`}
            className="btn-outline-rose">
            Iné termíny
          </Link>
        )}
        <Link href="/kontakt" className="btn-rose">
          Ozvi sa mi
        </Link>
      </div>
    </div>
  );
}
