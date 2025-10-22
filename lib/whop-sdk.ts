// lib/whop-sdk.ts
import { headers } from "next/headers";
import { WhopServerSdk } from "@whop/api";

/**
 * Server-side Whop SDK (factory function, do NOT use `new`).
 */
export const whopSdk = WhopServerSdk({
  appApiKey: process.env.WHOP_API_KEY,
  appId: process.env.NEXT_PUBLIC_WHOP_APP_ID,
});

/**
 * Resolve current Whop user id from request headers.
 * Returns null if not opened from Whop or if token is missing/invalid.
 */
export async function getWhopUserId(): Promise<string | null> {
  try {
    const hdrs = await headers();
    const { userId } = await whopSdk.verifyUserToken(hdrs);
    return userId ?? null;
  } catch {
    return null;
  }
}