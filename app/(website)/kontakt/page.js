import Contact from "./contact";
import { getSettings } from "@/lib/sanity/client";

export const metadata = {
  title: "Kontakt",
  description: "Napíš mi do Tvorivka — ahoj@tvorivko.sk alebo cez Instagram."
};

export default async function ContactPage() {
  const settings = await getSettings();
  return <Contact settings={settings} />;
}

export const revalidate = 60;
