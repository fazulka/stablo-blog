/**
 * Rich-text content used for workshop descriptions, about page, instructor bios,
 * and legal pages (terms, privacy, cancellation).
 */
export default {
  title: "Formátovaný text",
  name: "blockContent",
  type: "array",
  of: [
    {
      title: "Block",
      type: "block",
      styles: [
        { title: "Normálny text", value: "normal" },
        { title: "Nadpis H2", value: "h2" },
        { title: "Nadpis H3", value: "h3" },
        { title: "Nadpis H4", value: "h4" },
        { title: "Citát", value: "blockquote" }
      ],
      lists: [
        { title: "Odrážky", value: "bullet" },
        { title: "Číslovaný zoznam", value: "number" }
      ],
      marks: {
        decorators: [
          { title: "Tučné", value: "strong" },
          { title: "Kurzíva", value: "em" },
          { title: "Podčiarknuté", value: "underline" }
        ],
        annotations: [
          {
            title: "URL odkaz",
            name: "link",
            type: "object",
            fields: [
              {
                title: "URL",
                name: "href",
                type: "url"
              },
              {
                title: "Otvoriť v novom okne",
                name: "openInNewTab",
                type: "boolean",
                initialValue: false
              }
            ]
          }
        ]
      }
    },
    {
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternatívny text"
        }
      ]
    }
  ]
};
