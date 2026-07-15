import Container from "@/components/container";
import {
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon
} from "@heroicons/react/24/outline";
import {
  TwirlDivider,
  Squiggle,
  DoodleField
} from "@/components/dividers";

const FALLBACK_EMAIL = "ahoj@tvorivko.sk";

export default function Contact({ settings }) {
  const email = settings?.email || FALLBACK_EMAIL;
  const phone = settings?.phone;
  const address = settings?.address;

  return (
    <section className="relative overflow-hidden">
      <DoodleField variant="azure" />
      <Container large className="relative !py-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow-azure">Kontakt</span>
          <h1 className="mt-2 text-4xl font-bold md:text-5xl">
            Napíš mi alebo zavolaj
          </h1>
          <TwirlDivider color="azure" width={200} className="mt-5" />
          <p className="mx-auto mt-5 max-w-xl text-lg text-ink-soft">
            Máš otázku k workshopu, plánuješ súkromnú akciu, alebo si
            jednoducho chceš pohovoriť o tvorení? Som tu pre teba.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2">
          <a
            href={`mailto:${email}`}
            className="group flex items-center gap-4 rounded-3xl bg-paper-50 p-6 ring-1 ring-rose-soft/40 transition hover:bg-rose-light hover:ring-rose">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose/20 text-rose-dark group-hover:bg-rose group-hover:text-white">
              <EnvelopeIcon className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-ink-muted">
                E-mail
              </div>
              <div className="font-semibold text-ink">{email}</div>
            </div>
          </a>

          {phone && (
            <a
              href={`tel:${phone}`}
              className="group flex items-center gap-4 rounded-3xl bg-paper-50 p-6 ring-1 ring-azure-soft/40 transition hover:bg-azure-light hover:ring-azure">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-azure/20 text-azure-dark group-hover:bg-azure group-hover:text-white">
                <PhoneIcon className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-ink-muted">
                  Telefón
                </div>
                <div className="font-semibold text-ink">{phone}</div>
              </div>
            </a>
          )}

          {address && (
            <div className="flex items-center gap-4 rounded-3xl bg-paper-50 p-6 ring-1 ring-paper-200 sm:col-span-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose/20 text-rose-dark">
                <MapPinIcon className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-ink-muted">
                  Štúdio
                </div>
                <div className="whitespace-pre-line font-semibold text-ink">
                  {address}
                </div>
              </div>
            </div>
          )}
        </div>

        <Squiggle className="mx-auto mt-10 w-24 text-rose" />

        <p className="mx-auto mt-6 max-w-xl text-center text-sm text-ink-muted">
          Najlepšie ma chytíš cez e-mail alebo Instagram. Odpoviem ti zvyčajne
          do 24 hodín — niekedy som len pri tvorení a nestíham telefón.
        </p>
      </Container>
    </section>
  );
}
