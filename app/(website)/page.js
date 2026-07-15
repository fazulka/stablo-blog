import Home from "./home";
import { getUpcomingSessions, getAllCategories } from "@/lib/sanity/client";

export default async function IndexPage() {
  const [upcomingSessions, categories] = await Promise.all([
    getUpcomingSessions(6),
    getAllCategories()
  ]);
  return (
    <Home upcomingSessions={upcomingSessions} categories={categories} />
  );
}

export const revalidate = 60;
