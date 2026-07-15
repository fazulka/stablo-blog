/**
 * Sanity Studio structure for Tvorivko.
 *
 * Layout:
 *  - Workshops (concepts)
 *  - Termíny (sessions): grouped by status
 *  - Rezervácie (bookings): grouped by status
 *  - Kategórie / Lektori / Miesta konania
 *  - Nastavenia stránky (singleton)
 */

import { type DocumentDefinition } from "sanity";
import { type StructureResolver } from "sanity/desk";

export const singletonPlugin = (types: string[]) => {
  return {
    name: "singletonPlugin",
    document: {
      newDocumentOptions: (prev, { creationContext }) => {
        if (creationContext.type === "global") {
          return prev.filter(
            templateItem => !types.includes(templateItem.templateId)
          );
        }
        return prev;
      },
      actions: (prev, { schemaType }) => {
        if (types.includes(schemaType)) {
          return prev.filter(
            ({ action }) =>
              !["unpublish", "delete", "duplicate"].includes(action)
          );
        }
        return prev;
      }
    }
  };
};

export const pageStructure = (
  singletonTypes: DocumentDefinition[]
): StructureResolver => {
  return S => {
    const settingsSingletons = singletonTypes.map(typeDef =>
      S.listItem()
        .title(typeDef.title || "")
        .icon(typeDef.icon)
        .child(
          S.editor()
            .id(typeDef.name)
            .schemaType(typeDef.name)
            .documentId(typeDef.name)
            .views([S.view.form()])
        )
    );

    return S.list()
      .title("Tvorivko")
      .items([
        // Workshops (concepts)
        S.listItem()
          .title("Workshopy")
          .child(
            S.documentTypeList("workshop")
              .title("Workshopy")
              .defaultOrdering([{ field: "title", direction: "asc" }])
          ),

        // Termíny (sessions) — grouped by status
        S.listItem()
          .title("Termíny")
          .child(
            S.list()
              .title("Termíny")
              .items([
                S.listItem()
                  .title("📅 Všetky otvorené")
                  .child(
                    S.documentList()
                      .title("Otvorené termíny")
                      .filter('_type == "session" && status == "open"')
                      .defaultOrdering([
                        { field: "_createdAt", direction: "desc" }
                      ])
                  ),
                S.listItem()
                  .title("🔴 Vypredané")
                  .child(
                    S.documentList()
                      .title("Vypredané")
                      .filter('_type == "session" && status == "sold_out"')
                      .defaultOrdering([
                        { field: "_createdAt", direction: "desc" }
                      ])
                  ),
                S.listItem()
                  .title("❌ Zrušené")
                  .child(
                    S.documentList()
                      .title("Zrušené")
                      .filter('_type == "session" && status == "cancelled"')
                  ),
                S.listItem()
                  .title("📝 Rozpracované")
                  .child(
                    S.documentList()
                      .title("Rozpracované (skryté)")
                      .filter('_type == "session" && status == "draft"')
                  ),
                S.divider(),
                S.listItem()
                  .title("Všetky termíny")
                  .child(S.documentTypeList("session").title("Všetky termíny"))
              ])
          ),

        // Rezervácie (bookings) — grouped by status
        S.listItem()
          .title("Rezervácie")
          .child(
            S.list()
              .title("Rezervácie")
              .items([
                S.listItem()
                  .title("⏳ Čakajú na platbu")
                  .child(
                    S.documentList()
                      .title("Čakajú na platbu")
                      .filter(
                        '_type == "booking" && status == "awaiting_payment"'
                      )
                      .defaultOrdering([
                        { field: "_createdAt", direction: "desc" }
                      ])
                  ),
                S.listItem()
                  .title("✅ Zaplatené")
                  .child(
                    S.documentList()
                      .title("Zaplatené")
                      .filter('_type == "booking" && status == "paid"')
                      .defaultOrdering([
                        { field: "_createdAt", direction: "desc" }
                      ])
                  ),
                S.listItem()
                  .title("✗ Zrušené / vrátené")
                  .child(
                    S.documentList()
                      .title("Zrušené alebo vrátené")
                      .filter(
                        '_type == "booking" && (status == "cancelled" || status == "refunded")'
                      )
                  ),
                S.divider(),
                S.listItem()
                  .title("Všetky rezervácie")
                  .child(
                    S.documentTypeList("booking").title("Všetky rezervácie")
                  )
              ])
          ),

        S.divider(),

        // Reference data
        S.listItem()
          .title("Kategórie")
          .child(S.documentTypeList("category").title("Kategórie")),
        S.listItem()
          .title("Lektori")
          .child(S.documentTypeList("instructor").title("Lektori")),
        S.listItem()
          .title("Miesta konania")
          .child(S.documentTypeList("location").title("Miesta konania")),

        S.divider(),

        ...settingsSingletons
      ]);
  };
};
