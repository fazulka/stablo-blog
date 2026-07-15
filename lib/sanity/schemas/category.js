import { defineField, defineType } from "sanity";

export default defineType({
  name: "category",
  title: "Kategória workshopu",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Názov",
      type: "string",
      validation: Rule => Rule.required()
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: "description",
      title: "Krátky popis",
      type: "text",
      rows: 3
    }),
    defineField({
      name: "icon",
      title: "Emoji / ikona",
      description: "Voliteľný emoji znak pre vizuál karty, napr. 🧶, 🪴, 🎨",
      type: "string",
      validation: Rule => Rule.max(4)
    }),
    defineField({
      name: "color",
      title: "Farba štítku",
      type: "string",
      options: {
        list: [
          { title: "Ružová", value: "rose" },
          { title: "Modrá", value: "azure" },
          { title: "Krémová (papier)", value: "paper" },
          { title: "Tmavá (ink)", value: "ink" }
        ],
        layout: "radio"
      },
      initialValue: "rose"
    }),
    defineField({
      name: "image",
      title: "Obrázok kategórie (voliteľné)",
      type: "image",
      options: { hotspot: true }
    }),
    defineField({
      name: "order",
      title: "Poradie zobrazenia",
      type: "number",
      initialValue: 100
    })
  ],
  orderings: [
    {
      title: "Podľa poradia",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }]
    }
  ],
  preview: {
    select: { title: "title", icon: "icon", media: "image" },
    prepare({ title, icon, media }) {
      return {
        title: icon ? `${icon}  ${title}` : title,
        media
      };
    }
  }
});
