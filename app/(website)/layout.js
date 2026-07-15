import { getSettings } from "@/lib/sanity/client";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

const FALLBACK_TITLE = "Tvorivko — tvorivé workshopy v Košiciach";
const FALLBACK_DESCRIPTION =
  "Tvorivé workshopy v Košiciach: háčkovanie, makramé, Jesmonite, maľovanie na sklo a viac. Príď si vytvoriť niečo vlastnými rukami.";

async function sharedMetaData() {
  const settings = await getSettings();

  return {
    metadataBase: new URL(settings?.url || "https://tvorivko.sk"),
    title: {
      default: settings?.title || FALLBACK_TITLE,
      template: `%s | ${settings?.title || "Tvorivko"}`
    },
    description: settings?.description || FALLBACK_DESCRIPTION,
    keywords: [
      "tvorivé workshopy",
      "Košice",
      "Tvorivko",
      "háčkovanie",
      "makramé",
      "Jesmonite",
      "maľovanie na sklo",
      "kurzy",
      "workshop"
    ],
    openGraph: {
      title: settings?.title || FALLBACK_TITLE,
      description: settings?.description || FALLBACK_DESCRIPTION,
      locale: "sk_SK",
      type: "website",
      images: [
        {
          url: "/img/opengraph.jpg",
          width: 1200,
          height: 630
        }
      ]
    },
    robots: {
      index: true,
      follow: true
    }
  };
}

export async function generateMetadata() {
  return await sharedMetaData();
}

export default async function Layout({ children }) {
  const settings = await getSettings();
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </div>
  );
}
