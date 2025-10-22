import { headers } from "next/headers";

export const runtime = "nodejs";           // Force Node runtime (not Edge)
export const revalidate = 0;               // Disable caching
export const dynamic = "force-dynamic";    // Ensure fresh headers per request

export async function GET() {
  const h = await headers();

  const whopUserId = h.get("x-whop-user-id");
  const whopCompanyId = h.get("x-whop-company-id");
  const referer = h.get("referer");
  const origin = h.get("origin");
  const host = h.get("host");
  const userAgent = h.get("user-agent");

  // also dump a few common x-forwarded headers for debugging
  const xfProto = h.get("x-forwarded-proto");
  const xfHost = h.get("x-forwarded-host");
  const xfFor = h.get("x-forwarded-for");

  return Response.json({
    "x-whop-user-id": whopUserId ?? null,
    "x-whop-company-id": whopCompanyId ?? null,
    referer: referer ?? null,
    origin: origin ?? null,
    host: host ?? null,
    "user-agent": userAgent ?? null,
    "x-forwarded-proto": xfProto ?? null,
    "x-forwarded-host": xfHost ?? null,
    "x-forwarded-for": xfFor ?? null,
  });
}
