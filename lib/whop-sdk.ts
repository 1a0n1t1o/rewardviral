import { headers as nextHeaders } from "next/headers";
import { WhopServerSdk } from "@whop/api";

// Create one Whop SDK instance with your app API key (factory function; do NOT use `new`)
export const whopSdk = WhopServerSdk({
  apiKey: process.env.WHOP_API_KEY!,
});

/**
 * Resolve current Whop user id for this request.
 * 1) Prefer x-whop-user-id header (when app is opened from Whop).
 * 2) Fallback to verifying the user token via SDK (works when iframe token is present).
 * Returns null when not running from Whop or user cannot be determined.
 */
export async function getWhopUserId(): Promise<string | null> {
  try {
    const h = nextHeaders();
    const headerId = h.get("x-whop-user-id");
    if (headerId && headerId !== "null") return headerId;
    // Fallback: verify token via SDK (safe to call; returns undefined if not available)
    const verified = await whopSdk.verifyUserToken(h).catch(() => undefined);
    return verified?.userId ?? null;
  } catch {
    return null;
  }
}