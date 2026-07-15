import { defineField, defineType } from "sanity";

export default defineType({
  name: "location",
  title: "Miesto konania",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Názov miesta",
      type: "string",
      validation: Rule => Rule.required()
    }),
    defineField({
      name: "address",
      title: "Adresa",
      type: "string",
      validation: Rule => Rule.required()
    }),
    defineField({
      name: "city",
      title: "Mesto",
      type: "string",
      initialValue: "Košice"
    }),
    defineField({
      name: "mapUrl",
      title: "Odkaz na mapu (Google Maps)",
      type: "url"
    }),
    defineField({
      name: "directions",
      title: "Ako sa tam dostať / parkovanie",
      type: "text",
      rows: 3
    })
  ],
  preview: {
    select: { title: "name", subtitle: "address" }
  }
});
