import "server-only";
import { headers as nextHeaders } from "next/headers";
import { WhopServerSdk } from "@whop/api";

const apiKey = process.env.WHOP_API_KEY!;
export const whopSdk = new WhopServerSdk({ apiKey: apiKey }); // if our SDK is a factory, call the factory instead

export function getWhopUserId(): string | null {
  const h = nextHeaders();
  const id =
    h.get("x-whop-user-id") ||
    h.get("X-Whop-User-Id") ||
    null;
  return id && id !== "null" ? id : null;
}

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
