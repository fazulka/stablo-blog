"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format";

const baseInput =
  "w-full rounded-2xl border-2 border-paper-200 bg-paper-50 px-4 py-3 text-ink placeholder:text-ink-muted/60 focus:border-rose-soft focus:outline-none focus:ring-2 focus:ring-rose/30";
const errorInput =
  "border-rose-dark focus:border-rose-dark focus:ring-rose/40";
const labelClass = "mb-1.5 block text-sm font-medium text-ink";

export default function BookingForm({
  sessionId,
  price,
  available,
  workshopTitle
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      numberOfSeats: 1,
      message: "",
      paymentMethod: "bank_transfer",
      consentGdpr: false
    }
  });

  const seats = Number(watch("numberOfSeats")) || 1;
  const paymentMethod = watch("paymentMethod");
  const total = price && seats ? price * seats : 0;

  const onSubmit = async values => {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          customerName: values.customerName,
          customerEmail: values.customerEmail,
          customerPhone: values.customerPhone,
          numberOfSeats: Number(values.numberOfSeats),
          message: values.message,
          paymentMethod: values.paymentMethod,
          consentGdpr: values.consentGdpr === true
        })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setServerError(data.error || "Niečo sa pokazilo. Skús to ešte raz.");
        setSubmitting(false);
        return;
      }
      router.push(`/rezervacia/dakujeme/${data.bookingId}`);
    } catch (err) {
      console.error(err);
      setServerError(
        "Spojenie zlyhalo. Skontroluj internet a skús to ešte raz."
      );
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="customerName" className={labelClass}>
            Meno a priezvisko *
          </label>
          <input
            id="customerName"
            type="text"
            autoComplete="name"
            placeholder="Eva Nováková"
            className={`${baseInput} ${errors.customerName ? errorInput : ""}`}
            {...register("customerName", {
              required: "Zadaj svoje meno",
              minLength: { value: 2, message: "Príliš krátke meno" }
            })}
          />
          {errors.customerName && (
            <p className="mt-1 text-sm text-rose-dark">
              {errors.customerName.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="customerEmail" className={labelClass}>
            E-mail *
          </label>
          <input
            id="customerEmail"
            type="email"
            autoComplete="email"
            placeholder="eva@email.sk"
            className={`${baseInput} ${
              errors.customerEmail ? errorInput : ""
            }`}
            {...register("customerEmail", {
              required: "Zadaj e-mail",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Neplatný e-mail"
              }
            })}
          />
          {errors.customerEmail && (
            <p className="mt-1 text-sm text-rose-dark">
              {errors.customerEmail.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="customerPhone" className={labelClass}>
            Telefón (voliteľné)
          </label>
          <input
            id="customerPhone"
            type="tel"
            autoComplete="tel"
            placeholder="+421 ..."
            className={baseInput}
            {...register("customerPhone")}
          />
        </div>

        <div>
          <label htmlFor="numberOfSeats" className={labelClass}>
            Počet miest *
          </label>
          <input
            id="numberOfSeats"
            type="number"
            min={1}
            max={available}
            className={`${baseInput} ${
              errors.numberOfSeats ? errorInput : ""
            }`}
            {...register("numberOfSeats", {
              required: true,
              min: { value: 1, message: "Aspoň 1 miesto" },
              max: {
                value: available,
                message: `Maximálne ${available} miest`
              },
              valueAsNumber: true
            })}
          />
          {errors.numberOfSeats && (
            <p className="mt-1 text-sm text-rose-dark">
              {errors.numberOfSeats.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Odkaz pre lektora (voliteľné)
        </label>
        <textarea
          id="message"
          rows={3}
          placeholder="Niečo, čo by som mala vedieť? Alergie, špeciálne želania..."
          className={baseInput}
          {...register("message")}
        />
      </div>

      <fieldset className="space-y-3">
        <legend className={labelClass}>Spôsob platby *</legend>

        <label
          className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition ${
            paymentMethod === "bank_transfer"
              ? "border-rose bg-rose-light/40"
              : "border-paper-200 bg-paper-50 hover:border-rose-soft"
          }`}>
          <input
            type="radio"
            value="bank_transfer"
            className="mt-1 accent-rose"
            {...register("paymentMethod", { required: true })}
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-ink">Bankový prevod</span>
              <span className="rounded-full bg-paper-50 px-2 py-0.5 text-xs text-ink-muted ring-1 ring-paper-200">
                Odporúčané
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-soft">
              Po odoslaní ti pošlem IBAN a variabilný symbol. Miesto rezervujem
              hneď, ako dorazí platba.
            </p>
          </div>
        </label>

        <label
          className="flex cursor-not-allowed items-start gap-3 rounded-2xl border-2 border-paper-200 bg-paper-100/60 p-4 opacity-60">
          <input
            type="radio"
            value="card"
            disabled
            className="mt-1 accent-rose"
            {...register("paymentMethod")}
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-ink">Kartou (Stripe)</span>
              <span className="rounded-full bg-azure-light px-2 py-0.5 text-xs font-medium text-azure-deep">
                Čoskoro
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-soft">
              Pripravujem — pridám hneď, ako bude pripravený platobný účet.
            </p>
          </div>
        </label>
      </fieldset>

      <label className="flex items-start gap-3 text-sm text-ink-soft">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 accent-rose"
          {...register("consentGdpr", {
            required: "Pre dokončenie potvrď súhlas"
          })}
        />
        <span>
          Súhlasím so spracovaním osobných údajov za účelom rezervácie. *
          {errors.consentGdpr && (
            <span className="block text-rose-dark">
              {errors.consentGdpr.message}
            </span>
          )}
        </span>
      </label>

      <div className="rounded-2xl bg-rose/10 p-5 ring-1 ring-rose-soft">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-ink-muted">
              Spolu
            </div>
            <div className="text-3xl font-bold text-ink">
              {formatPrice(total)}
            </div>
            <div className="text-xs text-ink-muted">
              {seats} × {formatPrice(price)}
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="btn-rose text-base disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? "Odosielam..." : "Dokončiť rezerváciu"}
          </button>
        </div>
      </div>

      {serverError && (
        <div
          role="alert"
          className="rounded-2xl border-2 border-rose-dark/40 bg-rose-light/40 p-4 text-sm text-rose-deep">
          {serverError}
        </div>
      )}

      <p className="text-xs text-ink-muted">
        Odoslaním rezervácie potvrdzuješ, že si si prečítala podmienky zrušenia
        a refundácie. Workshop: <strong>{workshopTitle}</strong>.
      </p>
    </form>
  );
}
