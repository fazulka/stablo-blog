import { apiVersion, dataset, projectId, useCdn } from "./config";
import {
  settingsQuery,
  allWorkshopsQuery,
  featuredWorkshopsQuery,
  workshopBySlugQuery,
  workshopSlugsQuery,
  upcomingSessionsQuery,
  sessionByIdQuery,
  allCategoriesQuery,
  bookingByIdQuery
} from "./groq";
import { createClient } from "next-sanity";

if (!projectId) {
  console.error(
    "The Sanity Project ID is not set. Check your environment variables."
  );
}

export const client = projectId
  ? createClient({ projectId, dataset, apiVersion, useCdn })
  : null;

export const fetcher = async ([query, params]: [string, Record<string, unknown>]) => {
  return client ? client.fetch(query, params) : [];
};

// ─── Settings ──────────────────────────────────────────────────────────────
export async function getSettings() {
  if (!client) return {};
  return (await client.fetch(settingsQuery)) || {};
}

// ─── Workshops ─────────────────────────────────────────────────────────────
export async function getAllWorkshops() {
  if (!client) return [];
  return (await client.fetch(allWorkshopsQuery)) || [];
}

export async function getFeaturedWorkshops() {
  if (!client) return [];
  return (await client.fetch(featuredWorkshopsQuery)) || [];
}

export async function getWorkshopBySlug(slug: string) {
  if (!client) return null;
  return (await client.fetch(workshopBySlugQuery, { slug })) || null;
}

export async function getAllWorkshopSlugs() {
  if (!client) return [];
  const slugs: string[] = (await client.fetch(workshopSlugsQuery)) || [];
  return slugs.map(slug => ({ slug }));
}

// ─── Sessions ──────────────────────────────────────────────────────────────
export async function getUpcomingSessions(limit = 50) {
  if (!client) return [];
  return (await client.fetch(upcomingSessionsQuery, { limit })) || [];
}

export async function getSessionById(id: string) {
  if (!client) return null;
  return (await client.fetch(sessionByIdQuery, { id })) || null;
}

// ─── Categories ────────────────────────────────────────────────────────────
export async function getAllCategories() {
  if (!client) return [];
  return (await client.fetch(allCategoriesQuery)) || [];
}

// ─── Bookings ────────────────────────────────────────────────────────────
export async function getBookingById(id: string) {
  if (!client) return null;
  return (await client.fetch(bookingByIdQuery, { id })) || null;
}
