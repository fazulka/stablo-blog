import Container from "@/components/container";
import SessionCard from "@/components/sessionCard";
import Link from "next/link";
import { TwirlDivider, DoodleField } from "@/components/dividers";
import { getUpcomingSessions } from "@/lib/sanity/client";

export const metadata = {
  title: "Kalendár termínov",
  description: "Najbližšie termíny tvorivých workshopov v Tvorivku."
};

export default async function CalendarPage() {
  const sessions = await getUpcomingSessions(60);

  return (
    <section className="relative overflow-hidden">
      <DoodleField variant="azure" />
      <Container large className="relative !py-16">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">Kalendár termínov</span>
          <h1 className="mt-2 text-4xl font-bold md:text-5xl">
            Vyber si dátum, ktorý ti sedí
          </h1>
          <TwirlDivider color="azure" width={200} className="mt-5" />
        </div>

        {sessions.length === 0 ? (
          <div className="mx-auto mt-12 max-w-xl rounded-3xl border-2 border-dashed border-azure-soft/50 bg-paper-50 p-12 text-center">
            <div className="text-6xl">📅</div>
            <p className="mt-4 font-display text-2xl text-ink">
              Pripravujem nové termíny
            </p>
            <p className="mt-2 text-ink-muted">
              Sleduj Instagram, alebo mi{" "}
              <Link href="/kontakt" className="text-azure-dark underline">
                napíš
              </Link>{" "}
              — rada ťa upozorním na nové termíny.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sessions.map(s => (
              <SessionCard key={s._id} session={s} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

export const revalidate = 60;
