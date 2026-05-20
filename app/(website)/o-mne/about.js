import Container from "@/components/container";
import Link from "next/link";
import {
  TwirlDivider,
  Squiggle,
  Heart,
  DoodleField
} from "@/components/dividers";

export default function About() {
  return (
    <section className="relative overflow-hidden">
      <DoodleField variant="default" />
      <Container large className="relative !py-20">
        <div className="mx-auto max-w-3xl">
          <span className="eyebrow">Ahoj!</span>
          <h1 className="mt-2 text-4xl font-bold leading-tight md:text-5xl">
            O <span className="font-display text-rose-dark">Tvorivku</span>
          </h1>
          <TwirlDivider
            color="rose"
            width={180}
            className="my-6 !justify-start"
          />

          <div className="prose prose-lg mt-8 max-w-none text-ink-soft">
            <p>
              Tvorivko je moje útulné štúdio v Košiciach, kde sa stretávame,
              tvoríme a smejeme. Workshopy robím pre ľudí, ktorí potrebujú
              spomaliť, dotknúť sa materiálu rukami a odísť domov s niečím,
              čo si vytvorili sami.
            </p>
            <p>
              Učím{" "}
              <span className="font-semibold text-rose-dark">háčkovanie</span>,{" "}
              <span className="font-semibold text-azure-dark">makramé</span>,
              prácu s{" "}
              <span className="font-semibold text-rose-dark">Jesmonite</span>,{" "}
              <span className="font-semibold text-azure-dark">
                maľovanie na sklo
              </span>
              , pečiatkovanie tašiek a ďalšie tvorivé techniky. Workshopy
              vediem pre začiatočníkov aj pokročilejších — pre dospelých aj
              pre deti.
            </p>
            <p>
              Materiál a všetko potrebné dostaneš na mieste, stačí ti
              priniesť dobrú náladu. Káva, koláč a kus tvorivého spomalenia
              sú v cene.
            </p>
            <p className="flex items-center gap-2 font-display text-3xl not-italic text-ink">
              Teším sa, že prídeš tvoriť so mnou.{" "}
              <Heart className="h-7 w-7 animate-wiggle text-rose" />
            </p>
          </div>

          <Squiggle className="mt-8 w-32 text-azure" />

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/kalendar" className="btn-rose">
              Najbližšie termíny
            </Link>
            <Link href="/kontakt" className="btn-outline-rose">
              Ozvi sa mi
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
