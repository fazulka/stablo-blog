import About from "./about";
import { getSettings } from "@/lib/sanity/client";

export const metadata = {
  title: "O mne",
  description: "O Tvorivku — kto stojí za workshopmi v Košiciach."
};

export default async function AboutPage() {
  const settings = await getSettings();
  return <About settings={settings} />;
}

export const revalidate = 60;
