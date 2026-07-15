import { CogIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "settings",
  title: "Nastavenia stránky",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "brand", title: "Značka & logo", default: true },
    { name: "contact", title: "Kontakt" },
    { name: "bank", title: "Bankové údaje" },
    { name: "social", title: "Sociálne siete" },
    { name: "seo", title: "SEO" },
    { name: "legal", title: "Právne" }
  ],
  fields: [
    defineField({
      name: "title",
      title: "Názov stránky",
      type: "string",
      group: "brand",
      initialValue: "Tvorivko"
    }),
    defineField({
      name: "tagline",
      title: "Slogan / tagline",
      type: "string",
      group: "brand",
      description: 'Krátky text, napr. "Tvorivé workshopy v Košiciach"'
    }),
    defineField({
      name: "url",
      title: "URL stránky",
      type: "url",
      group: "brand",
      initialValue: "https://tvorivko.sk"
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      group: "brand",
      fields: [{ name: "alt", type: "string", title: "Alt text" }]
    }),
    defineField({
      name: "logoLight",
      title: "Logo pre tmavé pozadie (voliteľné)",
      type: "image",
      group: "brand",
      fields: [{ name: "alt", type: "string", title: "Alt text" }]
    }),

    defineField({
      name: "email",
      title: "Kontaktný e-mail",
      type: "string",
      group: "contact",
      initialValue: "ahoj@tvorivko.sk",
      validation: Rule =>
        Rule.regex(/^\S+@\S+\.\S+$/, { name: "email" })
    }),
    defineField({
      name: "phone",
      title: "Telefón",
      type: "string",
      group: "contact"
    }),
    defineField({
      name: "address",
      title: "Adresa štúdia",
      type: "text",
      rows: 2,
      group: "contact"
    }),

    defineField({
      name: "bankAccountHolder",
      title: "Majiteľ účtu",
      type: "string",
      group: "bank",
      description: "Meno alebo názov firmy, ako je vedené v banke"
    }),
    defineField({
      name: "bankAccountIban",
      title: "IBAN",
      type: "string",
      group: "bank",
      description:
        "Bankový účet pre platby prevodom. Posiela sa v inštrukciách k platbe."
    }),
    defineField({
      name: "bankName",
      title: "Názov banky",
      type: "string",
      group: "bank"
    }),
    defineField({
      name: "variableSymbolPrefix",
      title: "Prefix variabilného symbolu",
      type: "string",
      group: "bank",
      description: 'Napr. "TV" — pridá sa pred ID rezervácie.',
      initialValue: "TV"
    }),

    defineField({
      name: "social",
      title: "Sociálne siete",
      type: "array",
      group: "social",
      validation: Rule => Rule.unique(),
      of: [
        {
          type: "object",
          fields: [
            {
              type: "string",
              name: "media",
              title: "Sieť",
              options: {
                list: [
                  { title: "Instagram", value: "instagram" },
                  { title: "Facebook", value: "facebook" },
                  { title: "TikTok", value: "tiktok" },
                  { title: "YouTube", value: "youtube" }
                ]
              }
            },
            { type: "url", name: "url", title: "URL profilu" }
          ],
          preview: { select: { title: "media", subtitle: "url" } }
        }
      ]
    }),

    defineField({
      name: "description",
      title: "SEO popis stránky",
      type: "text",
      rows: 3,
      group: "seo",
      validation: Rule => Rule.min(20).max(200)
    }),
    defineField({
      name: "openGraphImage",
      title: "Open Graph obrázok",
      type: "image",
      group: "seo",
      description: "Obrázok pre náhľady na Facebooku, Instagrame atď."
    }),

    defineField({
      name: "termsAndConditions",
      title: "Obchodné podmienky",
      type: "blockContent",
      group: "legal"
    }),
    defineField({
      name: "privacyPolicy",
      title: "Ochrana osobných údajov",
      type: "blockContent",
      group: "legal"
    }),
    defineField({
      name: "cancellationPolicy",
      title: "Storno podmienky",
      type: "blockContent",
      group: "legal"
    })
  ],
  preview: {
    prepare: () => ({ title: "Nastavenia stránky" })
  }
});
