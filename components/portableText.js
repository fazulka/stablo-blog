import Image from "next/image";
import { PortableText as PortableTextReact } from "@portabletext/react";
import { urlForImage } from "@/lib/sanity/image";

const components = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-12 text-3xl font-bold text-ink first:mt-0 md:text-4xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-10 text-2xl font-bold text-ink first:mt-0">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-8 text-xl font-bold text-ink first:mt-0">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-4 border-rose pl-6 font-display text-2xl text-ink-soft">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="mt-4 leading-relaxed text-ink-soft first:mt-0">
        {children}
      </p>
    )
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-ink">{children}</strong>
    ),
    em: ({ children }) => <em>{children}</em>,
    underline: ({ children }) => <span className="underline">{children}</span>,
    link: ({ children, value }) => {
      const newTab = value?.openInNewTab;
      return (
        <a
          href={value?.href}
          target={newTab ? "_blank" : undefined}
          rel={newTab ? "noopener noreferrer" : undefined}
          className="text-rose-dark underline decoration-rose decoration-2 underline-offset-2 hover:text-rose-deep">
          {children}
        </a>
      );
    }
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-4 list-disc space-y-1.5 pl-6 text-ink-soft marker:text-rose">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mt-4 list-decimal space-y-1.5 pl-6 text-ink-soft marker:font-bold marker:text-rose-dark">
        {children}
      </ol>
    )
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>
  },
  types: {
    image: ({ value }) => {
      const img = urlForImage(value);
      if (!img?.src) return null;
      return (
        <figure className="my-8 overflow-hidden rounded-2xl">
          <Image
            src={img.src}
            alt={value?.alt || ""}
            width={img.width || 1200}
            height={img.height || 800}
            sizes="(max-width: 768px) 100vw, 800px"
            className="h-auto w-full object-cover"
          />
          {value?.alt && (
            <figcaption className="mt-2 text-center text-sm text-ink-muted">
              {value.alt}
            </figcaption>
          )}
        </figure>
      );
    }
  }
};

export function PortableText({ value }) {
  if (!value) return null;
  return <PortableTextReact value={value} components={components} />;
}
