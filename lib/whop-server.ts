import "server-only";
import { headers as nextHeaders } from "next/headers";
import { WhopServerSdk } from "@whop/sdk";

export const whopSdk = WhopServerSdk({ apiKey: process.env.WHOP_API_KEY! });

export function getWhopUserId(): string | null {
  const h = nextHeaders();
  const id =
    h.get("x-whop-user-id") ||
    h.get("X-Whop-User-Id") ||
    null;
  return id && id !== "null" ? id : null;
}

export function getWhopCompanyId(): string | null {
  const h = nextHeaders();
  const id =
    h.get("x-whop-company-id") ||
    h.get("X-Whop-Company-Id") ||
    null;
  return id && id !== "null" ? id : null;
}

export function getWhopMeta() {
  const h = nextHeaders();
  return {
    referer: h.get("referer") || h.get("Referer") || null,
    userAgent: h.get("user-agent") || h.get("User-Agent") || null,
  };
}