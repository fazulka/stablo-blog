import { defineField, defineType } from "sanity";

export default defineType({
  name: "booking",
  title: "Rezervácia",
  type: "document",
  groups: [
    { name: "customer", title: "Zákazník", default: true },
    { name: "payment", title: "Platba" },
    { name: "internal", title: "Interné" }
  ],
  fields: [
    defineField({
      name: "session",
      title: "Termín",
      type: "reference",
      group: "customer",
      to: [{ type: "session" }],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: "customerName",
      title: "Meno a priezvisko",
      type: "string",
      group: "customer",
      validation: Rule => Rule.required()
    }),
    defineField({
      name: "customerEmail",
      title: "E-mail",
      type: "string",
      group: "customer",
      validation: Rule =>
        Rule.required().regex(/^\S+@\S+\.\S+$/, {
          name: "email",
          invert: false
        })
    }),
    defineField({
      name: "customerPhone",
      title: "Telefón",
      type: "string",
      group: "customer"
    }),
    defineField({
      name: "numberOfSeats",
      title: "Počet miest",
      type: "number",
      group: "customer",
      initialValue: 1,
      validation: Rule => Rule.required().min(1).integer()
    }),
    defineField({
      name: "message",
      title: "Správa od zákazníka",
      type: "text",
      rows: 3,
      group: "customer"
    }),
    defineField({
      name: "consentGdpr",
      title: "Súhlas so spracovaním osobných údajov",
      type: "boolean",
      group: "customer",
      initialValue: false,
      validation: Rule => Rule.required()
    }),

    defineField({
      name: "paymentMethod",
      title: "Spôsob platby",
      type: "string",
      group: "payment",
      options: {
        list: [
          { title: "Kartou (Stripe)", value: "card" },
          { title: "Bankovým prevodom", value: "bank_transfer" }
        ],
        layout: "radio"
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: "status",
      title: "Stav rezervácie",
      type: "string",
      group: "payment",
      options: {
        list: [
          { title: "Čaká na platbu", value: "awaiting_payment" },
          { title: "Zaplatené ✓", value: "paid" },
          { title: "Zrušené", value: "cancelled" },
          { title: "Vrátené (refund)", value: "refunded" }
        ],
        layout: "radio"
      },
      initialValue: "awaiting_payment",
      validation: Rule => Rule.required()
    }),
    defineField({
      name: "totalAmount",
      title: "Celková suma (EUR)",
      type: "number",
      group: "payment",
      validation: Rule => Rule.required().min(0)
    }),
    defineField({
      name: "variableSymbol",
      title: "Variabilný symbol",
      type: "string",
      group: "payment",
      description:
        "Generuje sa automaticky pri vytvorení rezervácie pre identifikáciu bankového prevodu.",
      readOnly: true
    }),
    defineField({
      name: "paidAt",
      title: "Dátum zaplatenia",
      type: "datetime",
      group: "payment"
    }),
    defineField({
      name: "stripeSessionId",
      title: "Stripe Session ID",
      type: "string",
      group: "payment",
      readOnly: true
    }),
    defineField({
      name: "stripePaymentIntentId",
      title: "Stripe Payment Intent ID",
      type: "string",
      group: "payment",
      readOnly: true
    }),

    defineField({
      name: "internalNotes",
      title: "Interné poznámky (zákazník nevidí)",
      type: "text",
      rows: 3,
      group: "internal"
    }),
    defineField({
      name: "confirmationEmailSent",
      title: "Potvrdzujúci e-mail odoslaný",
      type: "boolean",
      group: "internal",
      initialValue: false
    })
  ],
  orderings: [
    {
      title: "Najnovšie rezervácie",
      name: "createdDesc",
      by: [{ field: "_createdAt", direction: "desc" }]
    },
    {
      title: "Naposledy upravené",
      name: "updatedDesc",
      by: [{ field: "_updatedAt", direction: "desc" }]
    }
  ],
  preview: {
    select: {
      name: "customerName",
      email: "customerEmail",
      seats: "numberOfSeats",
      status: "status",
      workshop: "session.workshop.title",
      date: "session.dates.0.start"
    },
    prepare({ name, email, seats, status, workshop, date }) {
      const statusLabel = {
        awaiting_payment: "⏳ Čaká",
        paid: "✓ Zaplatené",
        cancelled: "✗ Zrušené",
        refunded: "↩ Vrátené"
      };
      const dateStr = date
        ? new Intl.DateTimeFormat("sk-SK", { dateStyle: "short" }).format(
            new Date(date)
          )
        : "";
      return {
        title: `${name || "—"} (${seats || 1})`,
        subtitle: `${statusLabel[status] || status} · ${workshop || "—"} ${
          dateStr ? `· ${dateStr}` : ""
        }`
      };
    }
  }
});
