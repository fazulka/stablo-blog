/**
 * Server-only Sanity client with write access. Uses the API write token from
 * env (never exposed to the browser). Use this for mutations (creating
 * bookings, updating statuses). Read-only queries should still use the
 * regular `client` from `./client.ts`.
 */

import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./config";

const token = process.env.SANITY_API_WRITE_TOKEN;

export const writeClient =
  projectId && token
    ? createClient({
        projectId,
        dataset,
        apiVersion,
        useCdn: false,
        token,
        perspective: "published"
      })
    : null;

export function assertWriteClient() {
  if (!writeClient) {
    throw new Error(
      "Sanity write client is not configured. Set SANITY_API_WRITE_TOKEN in .env.local."
    );
  }
  return writeClient;
}
