import { defineField, defineType } from "sanity";

export default defineType({
  name: "session",
  title: "Termín",
  type: "document",
  fields: [
    defineField({
      name: "workshop",
      title: "Workshop",
      type: "reference",
      to: [{ type: "workshop" }],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: "dates",
      title: "Dátumy a časy",
      description:
        "Jeden dátum pre jednorazový workshop. Viac dátumov pre kurz s viacerými stretnutiami (jedna rezervácia = všetky stretnutia).",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "start",
              title: "Začiatok",
              type: "datetime",
              validation: Rule => Rule.required()
            },
            {
              name: "end",
              title: "Koniec",
              type: "datetime",
              validation: Rule => Rule.required()
            }
          ],
          preview: {
            select: { start: "start", end: "end" },
            prepare({ start, end }) {
              if (!start) return { title: "Nový termín" };
              const fmt = new Intl.DateTimeFormat("sk-SK", {
                dateStyle: "medium",
                timeStyle: "short"
              });
              return {
                title: fmt.format(new Date(start)),
                subtitle: end ? `do ${fmt.format(new Date(end))}` : undefined
              };
            }
          }
        }
      ],
      validation: Rule => Rule.required().min(1)
    }),
    defineField({
      name: "location",
      title: "Miesto konania",
      type: "reference",
      to: [{ type: "location" }],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: "price",
      title: "Cena (EUR)",
      type: "number",
      validation: Rule => Rule.required().min(0)
    }),
    defineField({
      name: "capacity",
      title: "Maximálny počet účastníkov",
      type: "number",
      validation: Rule => Rule.required().min(1).integer()
    }),
    defineField({
      name: "minAttendees",
      title: "Minimálny počet účastníkov pre konanie",
      description: "Voliteľné. Ak sa neprihlási dosť ľudí, termín môžeš zrušiť.",
      type: "number",
      validation: Rule => Rule.min(1).integer()
    }),
    defineField({
      name: "status",
      title: "Stav termínu",
      type: "string",
      options: {
        list: [
          { title: "Otvorený na rezervácie", value: "open" },
          { title: "Vypredaný", value: "sold_out" },
          { title: "Zrušený", value: "cancelled" },
          { title: "Skrytý (rozpracovaný)", value: "draft" }
        ],
        layout: "radio"
      },
      initialValue: "open",
      validation: Rule => Rule.required()
    }),
    defineField({
      name: "notes",
      title: "Poznámky pre účastníkov (voliteľné)",
      type: "text",
      rows: 3,
      description: "Zobrazí sa na stránke termínu, napr. čo si priniesť navyše."
    })
  ],
  orderings: [
    {
      title: "Najnovšie najskôr",
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
      workshop: "workshop.title",
      image: "workshop.mainImage",
      firstDate: "dates.0.start",
      status: "status",
      capacity: "capacity"
    },
    prepare({ workshop, image, firstDate, status, capacity }) {
      const labels = {
        open: "Otvorený",
        sold_out: "Vypredaný",
        cancelled: "Zrušený",
        draft: "Rozpracovaný"
      };
      const dateStr = firstDate
        ? new Intl.DateTimeFormat("sk-SK", {
            dateStyle: "medium",
            timeStyle: "short"
          }).format(new Date(firstDate))
        : "bez dátumu";
      return {
        title: workshop || "Termín bez workshopu",
        subtitle: `${dateStr} · ${labels[status] || status} · ${capacity} miest`,
        media: image
      };
    }
  }
});
