import Container from "@/components/container";
import Image from "next/image";
import Link from "next/link";
import {
  WaveDivider,
  TwirlDivider,
  Squiggle,
  Sparkle,
  Heart,
  Blob,
  DoodleField
} from "@/components/dividers";

export const metadata = {
  title: "Súkromné akcie",
  description:
    "Tvorivé workshopy na mieru — narodeniny, rozlúčky so slobodou, firemné teambuildingy v Košiciach."
};

const useCases = [
  {
    image: "/img/birthday.svg",
    alt: "Narodeniny",
    title: "Oslavy narodenín",
    text: "Pre dospelých aj pre deti — namiesto bežnej oslavy si zatvoríme spolu.",
    accent: "rose"
  },
  {
    image: "/img/bride.svg",
    alt: "Rozlucka so slobodou",
    title: "Rozlúčky so slobodou",
    text: "Pripravím vám tvorivý zážitok s prossecom a kávou — výtvor si odnesiete domov.",
    accent: "azure"
  },
  {
    image: "/img/group.svg",
    alt: "Kolegovia",
    title: "Firemné teambuildingy",
    text: "Veľký pôsobivý zážitok pre tím — z workshopu odídete inšpirovaní a oddýchnutí.",
    accent: "rose"
  },
  {
    image: "/img/pregnant.svg",
    alt: "Babatko",
    title: "Baby shower",
    text: "Tvorivé stretnutie pre nastávajúcu mamičku a jej kamarátky.",
    accent: "azure"
  }
];

export default function PrivateEventsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-rose-light">
        <Blob className="absolute -right-24 -top-24 h-72 w-72 text-rose-soft/40" />
        <Blob className="absolute -bottom-24 -left-24 h-72 w-72 text-azure-soft/30" />
        <DoodleField variant="default" />
        <Container large className="relative !py-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">Súkromné akcie</span>
            <h1 className="mt-2 text-4xl font-bold md:text-5xl">
              Workshop na mieru pre{" "}
              <span className="font-display text-rose-dark">
                vašu skupinu
              </span>
            </h1>
            <Squiggle className="mx-auto mt-5 w-32 text-azure" />
            <p className="mx-auto mt-5 max-w-xl text-lg text-ink-soft">
              Hľadáte zážitok, ktorý spojí vašu skupinu? Vyberieme
              spolu techniku, ladenie aj výsledný výtvor. Ja pripravím
              všetko — vy len prídete a tvoríte.
            </p>
            <div className="mt-7">
              <Link href="/kontakt" className="btn-rose text-base">
                Pošli mi dopyt
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <WaveDivider color="rose-light" height={70} flip />

      <section className="relative overflow-hidden">
        <DoodleField />
        <Container large className="relative !py-16">
          <div className="grid gap-6 md:grid-cols-2">
            {useCases.map(uc => (
              <div
                key={uc.title}
                className={`relative overflow-hidden rounded-3xl bg-paper-50 p-8 ring-1 transition hover:-translate-y-0.5 hover:shadow-md ${
                  uc.accent === "rose"
                    ? "ring-rose-soft/40 hover:ring-rose"
                    : "ring-azure-soft/40 hover:ring-azure"
                }`}>
                <Image
                  src={uc.image}
                  alt={uc.alt}
                  width={50}
                  height={50}
                />
                <h3 className="mt-3 text-2xl font-bold">
                  {uc.title}
                </h3>
                <p className="mt-2 text-ink-soft">{uc.text}</p>
                <Squiggle
                  className={`mt-4 w-20 ${
                    uc.accent === "rose" ? "text-rose" : "text-azure"
                  }`}
                />
              </div>
            ))}
          </div>

          <TwirlDivider color="rose" width={240} className="my-14" />

          <div className="relative overflow-hidden rounded-[2.5rem] bg-amber-300/30 p-10 text-paper-50 md:p-14">
            <Blob className="absolute -bottom-24 -right-24 h-72 w-72 text-rose/15" />
            <Blob className="absolute -top-24 left-24 h-72 w-72 text-rose/15" />
            <h2 className="font-display text-4xl text-rose-soft md:text-5xl">
              Ako to funguje
            </h2>
            <ol className="relative mt-6 grid gap-6 md:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Napíšete mi",
                  text: "Kedy, koľko vás bude, aké ladenie máte v hlave.",
                  icon: Sparkle,
                  color: "text-rose-soft"
                },
                {
                  step: "2",
                  title: "Doladíme detaily",
                  text: "Vyberieme spolu techniku, miesto a cenu.",
                  icon: Heart,
                  color: "text-azure-soft"
                },
                {
                  step: "3",
                  title: "Tvoríme",
                  text: "Prídete s úsmevom, ja sa postarám o zvyšok. Odídete s hotovým výtvorom.",
                  icon: Sparkle,
                  color: "text-rose-soft"
                }
              ].map(item => {
                const Icon = item.icon;
                return (
                  <li key={item.step}>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-display text-3xl ${item.color}`}>
                        {item.step}.
                      </span>
                      <Icon className={`h-4 w-4 ${item.color}`} />
                    </div>
                    <h4 className="mt-2 text-lg font-semibold">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-sm text-rose">
                      {item.text}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>
        </Container>
      </section>
    </>
  );
}