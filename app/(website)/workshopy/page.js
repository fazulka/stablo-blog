import Container from "@/components/container";
import Link from "next/link";
import { TwirlDivider, DoodleField } from "@/components/dividers";
import WorkshopCard from "@/components/workshopCard";
import { getAllWorkshops } from "@/lib/sanity/client";

export const metadata = {
  title: "Workshopy",
  description:
    "Všetky tvorivé workshopy v Tvorivku — háčkovanie, makramé, Jesmonite, maľovanie na sklo a viac."
};

export default async function WorkshopsPage() {
  const workshops = await getAllWorkshops();

  return (
    <section className="relative overflow-hidden">
      <DoodleField variant="rose" />
      <Container large className="relative !py-16">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">Workshopy</span>
          <h1 className="mt-2 text-4xl font-bold md:text-5xl">
            Vyber si techniku, ktorá ťa baví
          </h1>
          <TwirlDivider color="rose" width={200} className="mt-5" />
          <p className="mx-auto mt-5 max-w-xl text-lg text-ink-soft">
            Háčkovanie, makramé, práca s Jesmonite, maľovanie na sklo a
            ďalšie. Klikni na workshop a uvidíš všetky najbližšie termíny.
          </p>
        </div>

        {workshops.length === 0 ? (
          <div className="mx-auto mt-12 max-w-xl rounded-3xl border-2 border-dashed border-rose-soft/50 bg-paper-50 p-12 text-center">
            <div className="text-6xl">🧶</div>
            <p className="mt-4 font-display text-2xl text-ink">
              Práve pridávam workshopy do CMS-ka...
            </p>
            <p className="mt-2 text-ink-muted">
              Pozri sa medzitým na{" "}
              <Link href="/o-mne" className="text-rose-dark underline">
                O mne
              </Link>
              , alebo mi{" "}
              <Link href="/kontakt" className="text-rose-dark underline">
                napíš
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {workshops.map(w => (
              <WorkshopCard key={w._id} workshop={w} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

export const revalidate = 60;
