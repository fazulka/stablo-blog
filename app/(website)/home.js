import Container from "@/components/container";
import SessionCard from "@/components/sessionCard";
import Link from "next/link";
import Image from "next/image";
import {
  WaveDivider,
  ScallopDivider,
  TwirlDivider,
  Squiggle,
  Sparkle,
  Heart,
  Blob,
  DoodleField
} from "@/components/dividers";

export default function Home({ upcomingSessions, categories }) {
  const hasSessions = upcomingSessions && upcomingSessions.length > 0;
  return (
    <>
      <Hero />
      <WaveDivider color="rose-light" height={70} />
      <Categories categories={categories} />
      <WaveDivider color="rose-light" height={70} flip />
      <UpcomingSessions sessions={upcomingSessions} hasSessions={hasSessions} />
      <ScallopDivider color="azure-light" height={50} />
      <AboutTeaser />
      <ScallopDivider color="azure-light" height={50} flip />
      <PartiesTeaser />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-paper">
      <div className="absolute inset-0 bg-duo-glow" aria-hidden />
      <Blob
        className="absolute -right-32 -top-24 h-96 w-96 text-rose-light/60"
      />
      <Blob
        className="absolute -bottom-32 -left-32 h-96 w-96 -scale-x-100 text-azure-light/60"
      />
      <DoodleField variant="default" />

      <Container large className="relative !py-20 md:!py-28">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-light px-4 py-1.5 text-sm font-medium text-rose-deep">
              <Sparkle className="h-3.5 w-3.5 text-rose" />
              Tvorivé workshopy v Košiciach
            </span>
            <h1 className="mt-6 text-5xl font-bold leading-tight text-ink md:text-6xl lg:text-7xl">
              Príď si{" "}
              <span className="font-display text-rose-dark">vytvoriť</span>{" "}
              niečo{" "}
              <span className="font-display text-azure-dark">vlastnými</span>{" "}
              rukami.
            </h1>
            <Squiggle className="mt-5 w-28 text-rose" />
            <p className="mt-6 max-w-lg text-lg text-ink-soft">
              Háčkovanie, makramé, Jesmonite, maľovanie na sklo a viac.
              Útulné štúdio v centre Košíc, materiál v cene, káva s láskou
              a workshop, z ktorého odídeš s hotovým výtvorom.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/kalendar" className="btn-rose text-base">
                Pozri si termíny
              </Link>
              <Link
                href="/workshopy"
                className="btn-outline-rose text-base">
                Všetky workshopy
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-paper-100 ring-2 ring-rose-soft/40">
              <Image
                src="/img/logo.png"
                alt="Tvorivko"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-contain p-8"
              />
              <Sparkle className="absolute right-8 top-8 h-6 w-6 animate-float text-rose" />
              <Sparkle className="absolute bottom-12 left-10 h-4 w-4 animate-float text-azure" />
              <Heart className="absolute right-12 bottom-8 h-5 w-5 animate-wiggle text-rose-soft" />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rotate-[-6deg] rounded-2xl bg-ink px-5 py-3 text-paper-50 shadow-xl md:block">
              <span className="font-display text-2xl text-rose-soft">
                Ahoj, vitaj!
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Categories({ categories }) {
  if (!categories || categories.length === 0) return null;
  return (
    <section className="bg-rose-light">
      <Container large className="!py-12">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="font-display text-2xl text-rose-deep md:text-3xl">
            Tvorím:
          </span>
          {categories.map(cat => (
            <Link
              key={cat._id}
              href={`/workshopy?kategoria=${cat.slug}`}
              className="rounded-full bg-paper-50 px-5 py-2 text-sm font-medium text-ink ring-1 ring-rose-soft/40 transition hover:bg-rose hover:text-white hover:ring-rose">
              {cat.icon && <span className="mr-1.5">{cat.icon}</span>}
              {cat.title}
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

function UpcomingSessions({ sessions, hasSessions }) {
  return (
    <section className="relative overflow-hidden bg-paper">
      <DoodleField variant="rose" />
      <Container large className="relative !py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Najbližšie termíny</span>
            <h2 className="mt-1 text-3xl font-bold md:text-4xl">
              Vyber si workshop a rezervuj si miesto
            </h2>
            <TwirlDivider color="rose" width={180} className="mt-4" />
          </div>
          {hasSessions && (
            <Link
              href="/kalendar"
              className="hidden text-sm font-semibold text-ink-muted hover:text-rose-dark md:inline-block">
              Všetky termíny →
            </Link>
          )}
        </div>

        {hasSessions ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sessions.slice(0, 6).map(s => (
              <SessionCard key={s._id} session={s} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </Container>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-rose-soft/50 bg-paper-50 p-12 text-center">
      <Blob className="absolute -right-16 -top-16 h-48 w-48 text-rose-light/50" />
      <Blob className="absolute -bottom-16 -left-16 h-48 w-48 text-azure-light/50" />
      <div className="relative">
        <div className="text-6xl">🌼</div>
        <h3 className="mt-4 font-display text-4xl text-ink">
          Pripravujem nové termíny
        </h3>
        <p className="mx-auto mt-3 max-w-md text-ink-muted">
          Práve plánujem ďalšie workshopy. Sleduj Instagram alebo mi napíš —
          rada ťa upozorním, keď budú nové termíny vonku.
        </p>
        <div className="mt-6">
          <Link href="/kontakt" className="btn-rose">
            Ozvi sa mi
          </Link>
        </div>
      </div>
    </div>
  );
}

function AboutTeaser() {
  return (
    <section className="relative overflow-hidden bg-azure-light/40">
      <DoodleField variant="azure" />
      <Container large className="relative !py-20">
        <div className="grid items-center gap-12 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-rose-light to-azure-light ring-2 ring-azure-soft/40">
              <div className="flex h-full w-full items-center justify-center font-display text-7xl text-azure-deep/40">
                tvorivko
              </div>
              <Heart className="absolute right-8 top-8 h-6 w-6 animate-float text-rose" />
              <Sparkle className="absolute bottom-10 left-8 h-5 w-5 animate-float text-azure-dark" />
            </div>
          </div>
          <div className="md:col-span-3">
            <span className="eyebrow-azure">Ahoj!</span>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">
              Som Tvorivko — a tvorenie ma robí{" "}
              <span className="font-display text-rose-dark">šťastnou</span>.
            </h2>
            <Squiggle className="mt-4 w-24 text-azure" />
            <p className="mt-5 text-lg text-ink-soft">
              Verím, že každý z nás potrebuje občas spomaliť, dotknúť sa
              materiálu rukami a vytvoriť niečo svoje. V mojich workshopoch
              ti všetko ukážem, prevediem ťa krok za krokom — a stačí ti
              priniesť dobrú náladu.
            </p>
            <div className="mt-6">
              <Link
                href="/o-mne"
                className="text-base font-semibold text-azure-dark underline decoration-azure decoration-2 underline-offset-4 hover:text-azure-deep">
                Viac o mne →
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function PartiesTeaser() {
  const items = [
    {
      icon: "/img/birthday.svg",
      title: "Oslavy narodenín",
      color: "rose"
    },
    {
      icon: "/img/bride.svg",
      title: "Rozlúčky so slobodou",
      color: "azure"
    },
    {
      icon: "/img/group.svg",
      title: "Firemné teambuildingy",
      color: "rose"
    },
    {
      icon: "/img/pregnant.svg",
      title: "Baby shower",
      color: "azure"
    }
  ];
  return (
    <section className="relative overflow-hidden bg-paper">
      <DoodleField variant="default" />
      <Container large className="relative !py-20">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-paper p-10 text-paper-50 shadow-xl md:p-16">
          <Blob className="absolute -bottom-24 -right-24 h-80 w-80 text-rose/15" />
          <Blob className="absolute -top-24 -left-24 h-80 w-80 -scale-x-100 text-azure/20" />
          <div className="relative grid items-center gap-10 md:grid-cols-2">
            <div>
              <span className="font-display text-3xl text-rose-soft">
                Súkromné akcie
              </span>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">
                Workshop pre vašu skupinu — narodeniny, rozlúčka so
                slobodou alebo teambuilding.
              </h2>
              <Squiggle className="mt-4 w-24 text-azure-soft" />
              <p className="mt-5 text-amber-300 100/80">
                Pripravím vám tvorivý zážitok na mieru. Vyberieme spolu
                techniku, ladenie aj výsledný výtvor. Stačí mi povedať,
                koľko vás bude.
              </p>
              <div className="mt-7">
                <Link
                  href="/sukromne-akcie"
                  className="inline-flex items-center gap-2 rounded-full bg-rose px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-dark">
                  Zisti viac →
                </Link>
              </div>
            </div>
            <ul className="grid gap-4">
              {items.map(item => (
                <li
                  key={item.title}
                  className={`flex items-center gap-4 rounded-2xl px-5 py-3 ${
                    item.color === "rose" ? "bg-rose/15" : "bg-azure/20"
                  }`}
                >
                  <img src={item.icon} alt="" className="h-8 w-8" />
                  <span className="font-medium text-paper-50">{item.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
