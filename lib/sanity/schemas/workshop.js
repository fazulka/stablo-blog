import { defineField, defineType } from "sanity";

export default defineType({
  name: "workshop",
  title: "Workshop",
  type: "document",
  groups: [
    { name: "content", title: "Obsah", default: true },
    { name: "media", title: "Fotky" },
    { name: "details", title: "Detaily" },
    { name: "seo", title: "SEO" }
  ],
  fields: [
    defineField({
      name: "title",
      title: "Názov workshopu",
      type: "string",
      group: "content",
      validation: Rule => Rule.required()
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: "shortDescription",
      title: "Krátky popis (pre karty a náhľady)",
      type: "text",
      rows: 3,
      group: "content",
      validation: Rule => Rule.max(180)
    }),
    defineField({
      name: "description",
      title: "Plný popis",
      type: "blockContent",
      group: "content"
    }),
    defineField({
      name: "mainImage",
      title: "Hlavná fotka",
      type: "image",
      group: "media",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternatívny text",
          description: "Dôležité pre SEO a prístupnosť"
        }
      ],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: "gallery",
      title: "Galéria",
      type: "array",
      group: "media",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "alt", type: "string", title: "Alternatívny text" }
          ]
        }
      ]
    }),
    defineField({
      name: "category",
      title: "Kategória",
      type: "reference",
      group: "details",
      to: [{ type: "category" }],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: "instructor",
      title: "Lektor",
      type: "reference",
      group: "details",
      to: [{ type: "instructor" }]
    }),
    defineField({
      name: "difficulty",
      title: "Náročnosť",
      type: "string",
      group: "details",
      options: {
        list: [
          { title: "Pre začiatočníkov", value: "beginner" },
          { title: "Mierne pokročilí", value: "intermediate" },
          { title: "Pokročilí", value: "advanced" },
          { title: "Pre všetky úrovne", value: "all" }
        ],
        layout: "radio"
      },
      initialValue: "beginner"
    }),
    defineField({
      name: "ageGroup",
      title: "Vekové skupiny",
      type: "string",
      group: "details",
      options: {
        list: [
          { title: "Dospelí", value: "adults" },
          { title: "Deti", value: "kids" },
          { title: "Deti aj dospelí", value: "all" }
        ],
        layout: "radio"
      },
      initialValue: "adults"
    }),
    defineField({
      name: "duration",
      title: "Trvanie (popis)",
      type: "string",
      group: "details",
      description:
        'Napr. "2-3 hodiny" alebo "4 stretnutia po 2 hodinách". Konkrétny začiatok a koniec sa nastavuje pri termíne.'
    }),
    defineField({
      name: "whatYoullMake",
      title: "Čo si odnesieš domov",
      type: "text",
      rows: 3,
      group: "details"
    }),
    defineField({
      name: "whatToBring",
      title: "Čo si priniesť",
      type: "text",
      rows: 3,
      group: "details",
      description: "Nechaj prázdne ak nič netreba — všetko poskytneme."
    }),
    defineField({
      name: "includes",
      title: "V cene je zahrnuté",
      type: "array",
      group: "details",
      of: [{ type: "string" }],
      description: 'Napr. "Všetok materiál", "Káva a koláč", "Návod domov"'
    }),
    defineField({
      name: "featured",
      title: "Zobraziť na úvodnej stránke",
      type: "boolean",
      group: "details",
      initialValue: false
    }),
    defineField({
      name: "seoTitle",
      title: "SEO titulok (voliteľné)",
      type: "string",
      group: "seo"
    }),
    defineField({
      name: "seoDescription",
      title: "SEO popis (voliteľné)",
      type: "text",
      rows: 3,
      group: "seo",
      validation: Rule => Rule.max(200)
    })
  ],
  preview: {
    select: {
      title: "title",
      category: "category.title",
      media: "mainImage"
    },
    prepare({ title, category, media }) {
      return {
        title,
        subtitle: category ? `Kategória: ${category}` : "Bez kategórie",
        media
      };
    }
  }
});
