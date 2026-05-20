import { defineField, defineType } from "sanity";

export default defineType({
  name: "instructor",
  title: "Lektor",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Meno",
      type: "string",
      validation: Rule => Rule.required()
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 }
    }),
    defineField({
      name: "photo",
      title: "Fotka",
      type: "image",
      options: { hotspot: true }
    }),
    defineField({
      name: "shortBio",
      title: "Krátky popis (1-2 vety)",
      type: "text",
      rows: 2
    }),
    defineField({
      name: "bio",
      title: "O lektorovi (dlhšie)",
      type: "blockContent"
    }),
    defineField({
      name: "instagram",
      title: "Instagram URL",
      type: "url"
    })
  ],
  preview: {
    select: { title: "name", media: "photo" }
  }
});
