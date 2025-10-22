"use server";
import "server-only";
import { headers as nextHeaders } from "next/headers";
import { WhopServerSdk } from "@whop/api";

const apiKey = process.env.WHOP_API_KEY!;
export const whopSdk = WhopServerSdk({ apiKey: apiKey }); // factory, no `new` if SDK exposes a function, otherwise keep `new` as used in your working version

/** Return current Whop user id from request headers (null if not inside Whop). */
export function getWhopUserId(): string | null {
  const h = nextHeaders();
  const id =
    h.get("x-whop-user-id") ||
    h.get("X-Whop-User-Id") ||
    null;
  return id && id !== "null" ? id : null;
}

/** Convenience: get all relevant Whop headers once. */
export function getWhopHeaders() {
  const h = nextHeaders();
  return {
    userId:
      h.get("x-whop-user-id") ||
      h.get("X-Whop-User-Id") ||
      null,
    companyId:
      h.get("x-whop-company-id") ||
      h.get("X-Whop-Company-Id") ||
      null,
    referer: h.get("referer") || h.get("Referer") || null,
  };
}
