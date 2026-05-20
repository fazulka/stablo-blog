import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/lib/sanity/image";

const difficultyShort = {
  beginner: "Začiatočníci",
  intermediate: "Mierne pokročilí",
  advanced: "Pokročilí",
  all: "Všetky úrovne"
};

const ageGroupShort = {
  adults: "Dospelí",
  kids: "Deti",
  all: "Deti aj dospelí"
};

export default function WorkshopCard({ workshop }) {
  if (!workshop) return null;
  const img = workshop.mainImage ? urlForImage(workshop.mainImage) : null;
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl bg-paper-50 ring-1 ring-paper-200 transition hover:-translate-y-0.5 hover:shadow-lg hover:ring-rose-soft">
      <Link
        href={`/workshopy/${workshop.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-paper-100">
        {img?.src ? (
          <Image
            src={img.src}
            alt={workshop.mainImage?.alt || workshop.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder={workshop.mainImage?.lqip ? "blur" : "empty"}
            blurDataURL={workshop.mainImage?.lqip}
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-rose-light to-azure-light text-6xl">
            {workshop.category?.icon || "✨"}
          </div>
        )}

        {workshop.category && (
          <span className="absolute right-4 top-4 rounded-full bg-paper-50/95 px-3 py-1 text-xs font-medium text-ink-soft backdrop-blur-sm">
            {workshop.category.icon ? `${workshop.category.icon} ` : ""}
            {workshop.category.title}
          </span>
        )}
        {workshop.featured && (
          <span className="absolute left-4 top-4 rounded-full bg-rose px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
            ★ Top
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-bold leading-tight text-ink">
          <Link
            href={`/workshopy/${workshop.slug}`}
            className="decoration-rose decoration-2 underline-offset-4 hover:underline">
            {workshop.title}
          </Link>
        </h3>

        {workshop.shortDescription && (
          <p className="mt-2 line-clamp-3 text-sm text-ink-soft">
            {workshop.shortDescription}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
          {workshop.duration && <span>⏱ {workshop.duration}</span>}
          {workshop.difficulty && (
            <span>· {difficultyShort[workshop.difficulty]}</span>
          )}
          {workshop.ageGroup && workshop.ageGroup !== "adults" && (
            <span>· {ageGroupShort[workshop.ageGroup]}</span>
          )}
        </div>

        <div className="mt-5">
          <Link
            href={`/workshopy/${workshop.slug}`}
            className="inline-flex items-center gap-1 font-semibold text-rose-dark hover:text-rose-deep">
            Detail a termíny →
          </Link>
        </div>
      </div>
    </article>
  );
}
