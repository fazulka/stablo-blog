import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/container";
import SessionCard from "@/components/sessionCard";
import { PortableText } from "@/components/portableText";
import {
  TwirlDivider,
  Squiggle,
  DoodleField,
  Sparkle,
  Heart,
  WaveDivider
} from "@/components/dividers";
import { urlForImage } from "@/lib/sanity/image";
import { formatPrice } from "@/lib/format";
import {
  getWorkshopBySlug,
  getAllWorkshopSlugs
} from "@/lib/sanity/client";

const difficultyLabels = {
  beginner: "Pre začiatočníkov",
  intermediate: "Mierne pokročilí",
  advanced: "Pokročilí",
  all: "Pre všetky úrovne"
};

const ageGroupLabels = {
  adults: "Dospelí",
  kids: "Deti",
  all: "Deti aj dospelí"
};

export async function generateStaticParams() {
  const slugs = await getAllWorkshopSlugs();
  return slugs;
}

export async function generateMetadata({ params }) {
  const workshop = await getWorkshopBySlug(params.slug);
  if (!workshop) return {};
  const img = workshop.mainImage ? urlForImage(workshop.mainImage) : null;
  return {
    title: workshop.seoTitle || workshop.title,
    description:
      workshop.seoDescription ||
      workshop.shortDescription ||
      `Tvorivý workshop ${workshop.title} v Tvorivku, Košice.`,
    openGraph: {
      title: workshop.seoTitle || workshop.title,
      description: workshop.seoDescription || workshop.shortDescription,
      images: img?.src ? [{ url: img.src }] : undefined
    }
  };
}

export const revalidate = 60;

export default async function WorkshopDetailPage({ params }) {
  const workshop = await getWorkshopBySlug(params.slug);
  if (!workshop) notFound();

  const heroImg = workshop.mainImage ? urlForImage(workshop.mainImage) : null;
  const sessions = workshop.upcomingSessions || [];
  const gallery = workshop.gallery || [];
  const minPrice = sessions.length
    ? Math.min(...sessions.map(s => s.price ?? Infinity))
    : null;

  // Wrap sessions with workshop data so SessionCard can render correctly.
  const sessionsWithWorkshop = sessions.map(s => ({
    ...s,
    workshop: {
      _id: workshop._id,
      title: workshop.title,
      slug: workshop.slug,
      shortDescription: workshop.shortDescription,
      duration: workshop.duration,
      mainImage: workshop.mainImage,
      category: workshop.category
    }
  }));

  return (
    <article>
      {/* Breadcrumb */}
      <Container large className="!pb-0 !pt-6">
        <nav className="text-sm text-ink-muted" aria-label="Drobčeková navigácia">
          <Link href="/workshopy" className="hover:text-rose-dark">
            Workshopy
          </Link>
          <span className="mx-2 text-ink-muted/60">›</span>
          <span className="text-ink">{workshop.title}</span>
        </nav>
      </Container>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <DoodleField variant="default" />
        <Container large className="relative !py-10">
          <div className="grid gap-10 lg:grid-cols-5">
            <div className="lg:col-span-3">
              {heroImg?.src && (
                <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] ring-2 ring-rose-soft/30 shadow-sm">
                  <Image
                    src={heroImg.src}
                    alt={workshop.mainImage?.alt || workshop.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 720px"
                    placeholder={workshop.mainImage?.lqip ? "blur" : "empty"}
                    blurDataURL={workshop.mainImage?.lqip}
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center lg:col-span-2">
              {workshop.category && (
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-rose-light px-4 py-1.5 text-sm font-medium text-rose-deep">
                  {workshop.category.icon && (
                    <span>{workshop.category.icon}</span>
                  )}
                  {workshop.category.title}
                </span>
              )}
              <h1 className="mt-4 text-4xl font-bold leading-tight text-ink md:text-5xl">
                {workshop.title}
              </h1>
              <Squiggle className="mt-4 w-28 text-rose" />
              {workshop.shortDescription && (
                <p className="mt-5 text-lg text-ink-soft">
                  {workshop.shortDescription}
                </p>
              )}

              <dl className="mt-6 grid grid-cols-2 gap-3">
                {workshop.duration && (
                  <div className="rounded-2xl bg-paper-50 p-4 ring-1 ring-paper-200">
                    <dt className="text-xs uppercase tracking-wider text-ink-muted">
                      Trvanie
                    </dt>
                    <dd className="mt-0.5 font-semibold text-ink">
                      {workshop.duration}
                    </dd>
                  </div>
                )}
                {workshop.difficulty && (
                  <div className="rounded-2xl bg-paper-50 p-4 ring-1 ring-paper-200">
                    <dt className="text-xs uppercase tracking-wider text-ink-muted">
                      Náročnosť
                    </dt>
                    <dd className="mt-0.5 font-semibold text-ink">
                      {difficultyLabels[workshop.difficulty] ||
                        workshop.difficulty}
                    </dd>
                  </div>
                )}
                {workshop.ageGroup && (
                  <div className="rounded-2xl bg-paper-50 p-4 ring-1 ring-paper-200">
                    <dt className="text-xs uppercase tracking-wider text-ink-muted">
                      Pre koho
                    </dt>
                    <dd className="mt-0.5 font-semibold text-ink">
                      {ageGroupLabels[workshop.ageGroup] || workshop.ageGroup}
                    </dd>
                  </div>
                )}
                {minPrice !== null && Number.isFinite(minPrice) && (
                  <div className="rounded-2xl bg-rose/10 p-4 ring-1 ring-rose-soft">
                    <dt className="text-xs uppercase tracking-wider text-ink-muted">
                      {sessions.length > 1 ? "Cena od" : "Cena"}
                    </dt>
                    <dd className="mt-0.5 text-2xl font-bold text-ink">
                      {formatPrice(minPrice)}
                    </dd>
                  </div>
                )}
              </dl>

              {sessions.length > 0 && (
                <div className="mt-7">
                  <a href="#terminy" className="btn-rose text-base">
                    Vyber si termín ↓
                  </a>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Body + sidebar */}
      <section className="relative bg-paper-100/40">
        <Container large className="!py-16">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {workshop.description ? (
                <div className="max-w-none">
                  <PortableText value={workshop.description} />
                </div>
              ) : (
                <p className="text-ink-soft">{workshop.shortDescription}</p>
              )}
            </div>

            <aside className="space-y-4">
              {workshop.whatYoullMake && (
                <div className="rounded-3xl bg-paper-50 p-6 ring-1 ring-rose-soft/40">
                  <h3 className="flex items-center gap-2 font-display text-2xl text-rose-dark">
                    <Sparkle className="h-4 w-4 text-rose" />
                    Čo si odnesieš
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {workshop.whatYoullMake}
                  </p>
                </div>
              )}

              {workshop.whatToBring && (
                <div className="rounded-3xl bg-paper-50 p-6 ring-1 ring-azure-soft/40">
                  <h3 className="flex items-center gap-2 font-display text-2xl text-azure-dark">
                    <Heart className="h-4 w-4 text-azure" />
                    Čo si priniesť
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {workshop.whatToBring}
                  </p>
                </div>
              )}

              {workshop.includes && workshop.includes.length > 0 && (
                <div className="rounded-3xl bg-paper-50 p-6 ring-1 ring-paper-200">
                  <h3 className="flex items-center gap-2 font-display text-2xl text-rose-dark">
                    <Sparkle className="h-4 w-4 text-rose" />
                    V cene je
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm text-ink-soft">
                    {workshop.includes.map((item, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-rose-dark">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </Container>
      </section>

      {/* Gallery */}
      {gallery.length > 0 && (
        <>
          <WaveDivider color="azure-light" height={50} />
          <section className="relative overflow-hidden bg-azure-light/40">
            <DoodleField variant="azure" />
            <Container large className="relative !py-16">
              <div className="text-center">
                <span className="eyebrow-azure">Galéria</span>
                <h2 className="mt-2 text-3xl font-bold md:text-4xl">
                  Inšpirácia z workshopov
                </h2>
                <TwirlDivider color="azure" width={180} className="mt-4" />
              </div>

              <div className="mt-10 grid auto-rows-[180px] gap-3 sm:grid-cols-2 md:auto-rows-[220px] md:grid-cols-3 lg:grid-cols-4">
                {gallery.map((item, i) => {
                  const img = urlForImage(item);
                  if (!img?.src) return null;
                  const featured = i % 7 === 0;
                  return (
                    <div
                      key={i}
                      className={`group relative overflow-hidden rounded-2xl bg-paper-100 ring-1 ring-paper-200 transition hover:ring-rose-soft ${
                        featured ? "sm:col-span-2 sm:row-span-2" : ""
                      }`}>
                      <Image
                        src={img.src}
                        alt={item.alt || `Fotka ${i + 1}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        placeholder={item.lqip ? "blur" : "empty"}
                        blurDataURL={item.lqip}
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  );
                })}
              </div>
            </Container>
          </section>
          <WaveDivider color="azure-light" height={50} flip />
        </>
      )}

      {/* Sessions */}
      <section
        id="terminy"
        className="relative scroll-mt-20 overflow-hidden bg-rose-light/40">
        <DoodleField variant="rose" />
        <Container large className="relative !py-20">
          <div className="text-center">
            <span className="eyebrow">Najbližšie termíny</span>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">
              Vyber si dátum a rezervuj
            </h2>
            <TwirlDivider color="rose" width={180} className="mt-4" />
          </div>

          {sessions.length === 0 ? (
            <div className="mx-auto mt-10 max-w-xl rounded-3xl border-2 border-dashed border-rose-soft/50 bg-paper-50 p-10 text-center">
              <div className="text-5xl">🌼</div>
              <p className="mt-4 font-display text-2xl text-ink">
                Nové termíny pripravujem
              </p>
              <p className="mt-2 text-ink-muted">
                Napíš mi a ozvem sa hneď, ako budú vonku.
              </p>
              <div className="mt-5">
                <Link href="/kontakt" className="btn-rose">
                  Ozvi sa mi
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sessionsWithWorkshop.map(s => (
                <SessionCard key={s._id} session={s} />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Instructor */}
      {workshop.instructor && (
        <section className="bg-paper">
          <Container large className="!py-16">
            <div className="grid items-center gap-8 md:grid-cols-3">
              <div className="md:col-span-1">
                {workshop.instructor.photo &&
                  (() => {
                    const photo = urlForImage(workshop.instructor.photo);
                    if (!photo?.src) return null;
                    return (
                      <div className="relative aspect-square w-40 overflow-hidden rounded-full ring-2 ring-rose-soft/40 md:w-56">
                        <Image
                          src={photo.src}
                          alt={workshop.instructor.name}
                          fill
                          sizes="224px"
                          className="object-cover"
                        />
                      </div>
                    );
                  })()}
                <span className="eyebrow-azure mt-4 block">Lektor</span>
                <h2 className="mt-1 text-3xl font-bold">
                  {workshop.instructor.name}
                </h2>
              </div>
              <div className="md:col-span-2">
                <p className="text-lg text-ink-soft">
                  {workshop.instructor.shortBio ||
                    `${workshop.instructor.name} ťa workshopom prevedie krok za krokom — všetko ti ukáže a postará sa o materiál aj o pohodlie.`}
                </p>
                <Link
                  href="/o-mne"
                  className="mt-4 inline-block font-semibold text-azure-dark underline decoration-azure decoration-2 underline-offset-4 hover:text-azure-deep">
                  Viac o mne →
                </Link>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Private events teaser */}
      <section className="bg-ink text-paper-50">
        <Container large className="!py-12">
          <div className="flex flex-col items-center gap-5 text-center md:flex-row md:justify-between md:text-left">
            <div>
              <span className="font-display text-2xl text-rose-soft">
                Chceš tento workshop pre vašu skupinu?
              </span>
              <h3 className="mt-1 text-lg font-semibold md:text-xl">
                Pripravím vám ho na mieru — narodeniny, rozlúčka so slobodou
                alebo teambuilding.
              </h3>
            </div>
            <Link href="/sukromne-akcie" className="btn-rose whitespace-nowrap">
              Súkromné akcie →
            </Link>
          </div>
        </Container>
      </section>
    </article>
  );
}
