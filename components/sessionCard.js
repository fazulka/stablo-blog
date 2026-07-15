import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/lib/sanity/image";
import { formatSessionDate, formatPrice } from "@/lib/format";

const statusBadge = {
  sold_out: {
    label: "Vypredané",
    className: "bg-ink text-paper-50"
  },
  cancelled: {
    label: "Zrušené",
    className: "bg-paper-200 text-ink-muted line-through"
  }
};

export default function SessionCard({ session }) {
  const workshop = session?.workshop;
  if (!workshop) return null;

  const img = workshop.mainImage ? urlForImage(workshop.mainImage) : null;
  const date = session.dates?.[0]?.start;
  const seatsLeft = Math.max(
    0,
    (session.capacity || 0) - (session.bookedSeats || 0)
  );
  const isMulti = (session.dates?.length || 0) > 1;
  const badge = statusBadge[session.status];

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
            className="object-cover transition duration-500 group-hover:scale-105"
            placeholder={workshop.mainImage?.lqip ? "blur" : "empty"}
            blurDataURL={workshop.mainImage?.lqip}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-rose-light to-azure-light text-6xl">
            {workshop.category?.icon || "✨"}
          </div>
        )}

        {badge && (
          <span
            className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${badge.className}`}>
            {badge.label}
          </span>
        )}
        {workshop.category && (
          <span className="absolute right-4 top-4 rounded-full bg-paper-50/95 px-3 py-1 text-xs font-medium text-ink-soft backdrop-blur-sm">
            {workshop.category.icon ? `${workshop.category.icon} ` : ""}
            {workshop.category.title}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="font-display text-2xl text-rose-dark">
          {formatSessionDate(date)}
        </div>
        <h3 className="mt-1 text-xl font-bold leading-tight text-ink">
          <Link
            href={`/workshopy/${workshop.slug}`}
            className="decoration-rose decoration-2 underline-offset-4 hover:underline">
            {workshop.title}
          </Link>
        </h3>

        {workshop.shortDescription && (
          <p className="mt-2 line-clamp-2 text-sm text-ink-muted">
            {workshop.shortDescription}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
          {workshop.duration && <span>⏱ {workshop.duration}</span>}
          {isMulti && <span>📚 {session.dates.length} stretnutí</span>}
          {seatsLeft > 0 && session.status === "open" && (
            <span className="font-medium text-azure-dark">
              {seatsLeft === 1
                ? "Posledné miesto!"
                : `${seatsLeft} voľných miest`}
            </span>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-ink-muted">
              Cena
            </div>
            <div className="text-2xl font-bold text-ink">
              {formatPrice(session.price)}
            </div>
          </div>
          <Link
            href={
              session.status === "open"
                ? `/rezervacia/${session._id}`
                : `/workshopy/${workshop.slug}`
            }
            className={
              session.status === "open" ? "btn-rose" : "btn-outline"
            }>
            {session.status === "open" ? "Rezervovať" : "Detail"}
          </Link>
        </div>
      </div>
    </article>
  );
}
