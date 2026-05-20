import Container from "@/components/container";
import Link from "next/link";
import Image from "next/image";
import { WaveDivider, Squiggle, Sparkle } from "@/components/dividers";

const socialIcon = {
  instagram: (
    <path d="M12 2.2c3.2 0 3.584.012 4.85.07 1.366.062 2.633.336 3.608 1.311.974.975 1.249 2.242 1.311 3.608.058 1.266.07 1.65.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.337 2.633-1.311 3.608-.975.974-2.242 1.249-3.608 1.311-1.266.058-1.65.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.337-3.608-1.311-.974-.975-1.249-2.242-1.311-3.608C2.212 15.584 2.2 15.2 2.2 12s.012-3.584.07-4.85c.062-1.366.336-2.633 1.311-3.608.975-.974 2.242-1.249 3.608-1.311C8.416 2.212 8.8 2.2 12 2.2zm0 5.3a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zm5.85-.85a1.05 1.05 0 1 1-2.1 0 1.05 1.05 0 0 1 2.1 0zM12 9.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z" />
  ),
  facebook: (
    <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.14 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.52 1.49-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.8 8.44-4.94 8.44-9.94z" />
  ),
  tiktok: (
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.06A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.18a8.27 8.27 0 0 0 5 1.51v-3.4a4.85 4.85 0 0 1-2.07-.6Z" />
  )
};

export default function Footer({ settings }) {
  const year = new Date().getFullYear();
  const socials = settings?.social || [];
  return (
    <footer className="mt-24 bg-ink text-paper-100">
      <WaveDivider color="ink" height={60} flip className="-mt-px" />

      <Container large className="!py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Link
              href="/"
              aria-label="Tvorivko domov"
              className="inline-block">
              <Image
                src="/img/logo.png"
                alt="Tvorivko"
                width={3000}
                height={3000}
                sizes="64px"
                className="h-16 w-16 object-contain brightness-0 invert"
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper-100/70">
              Tvorivé workshopy v Košiciach. Príď si vytvoriť niečo
              vlastnými rukami a odísť s úsmevom — a hotovým výtvorom.
            </p>
            <Squiggle className="mt-4 w-24 text-rose" />
          </div>

          <div>
            <h3 className="flex items-center gap-2 font-display text-2xl text-rose-soft">
              <Sparkle className="h-4 w-4 text-rose" /> Navigácia
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/workshopy" className="hover:text-rose-soft">
                  Workshopy
                </Link>
              </li>
              <li>
                <Link href="/kalendar" className="hover:text-rose-soft">
                  Kalendár termínov
                </Link>
              </li>
              <li>
                <Link href="/o-mne" className="hover:text-rose-soft">
                  O mne
                </Link>
              </li>
              <li>
                <Link
                  href="/sukromne-akcie"
                  className="hover:text-rose-soft">
                  Súkromné akcie
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="hover:text-rose-soft">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="flex items-center gap-2 font-display text-2xl text-azure-soft">
              <Sparkle className="h-4 w-4 text-azure" /> Ozvi sa mi
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {settings?.email && (
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    className="hover:text-azure-soft">
                    {settings.email}
                  </a>
                </li>
              )}
              {settings?.phone && (
                <li>
                  <a
                    href={`tel:${settings.phone}`}
                    className="hover:text-azure-soft">
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings?.address && (
                <li className="text-paper-100/70">{settings.address}</li>
              )}
              {!settings?.email && (
                <li>
                  <a
                    href="mailto:ahoj@tvorivko.sk"
                    className="hover:text-azure-soft">
                    ahoj@tvorivko.sk
                  </a>
                </li>
              )}
            </ul>

            {socials.length > 0 && (
              <div className="mt-5 flex items-center gap-3">
                {socials.map(s =>
                  s.url && socialIcon[s.media] ? (
                    <a
                      key={s.media}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.media}
                      className="rounded-full bg-paper-100/10 p-2 transition hover:bg-rose hover:text-ink">
                      <svg
                        className="h-5 w-5 fill-current"
                        viewBox="0 0 24 24">
                        {socialIcon[s.media]}
                      </svg>
                    </a>
                  ) : null
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-paper-100/10 pt-6 text-xs text-paper-100/60 md:flex-row">
          <span>© {year} Tvorivko. Všetky práva vyhradené.</span>
          <span className="font-display text-lg text-rose-soft">
            S láskou v Košiciach
          </span>
        </div>
      </Container>
    </footer>
  );
}
