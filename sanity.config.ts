import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./lib/sanity/schemas";
import { projectId, dataset } from "./lib/sanity/config";
import settings from "./lib/sanity/schemas/settings";
import {
  pageStructure,
  singletonPlugin
} from "./lib/sanity/plugins/settings";
import { unsplashImageAsset } from "sanity-plugin-asset-source-unsplash";

export const PREVIEWABLE_DOCUMENT_TYPES: string[] = ["workshop"];

export default defineConfig({
  name: "default",
  title: "Tvorivko Studio",
  basePath: "/studio",
  projectId,
  dataset,

  plugins: [
    deskTool({
      structure: pageStructure([settings])
    }),
    singletonPlugin(["settings"]),
    visionTool(),
    unsplashImageAsset()
  ],

  schema: {
    types: schemaTypes
  }
});
