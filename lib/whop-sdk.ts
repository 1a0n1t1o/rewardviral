// Server-only Whop SDK helper
// NOTE: WhopServerSdk is a factory function. Do NOT use `new`.
// The option name is `apiKey` (camelCase).
// This file must only run on the server.
"use server";

import { headers as nextHeaders } from "next/headers";
import { WhopServerSdk } from "@whop/api";

// Create one SDK instance with your app API key
export const whopSdk = WhopServerSdk({
  apiKey: process.env.WHOP_API_KEY!,
});

/**
 * Best-effort helper to read current Whop user id from request headers.
 * Will be null when the app isn't opened from Whop.
 */
export function getWhopUserId(): string | null {
  try {
    const h = nextHeaders();
    const id = h.get("x-whop-user-id");
    return id && id !== "null" ? id : null;
  } catch {
    return null;
  }
}