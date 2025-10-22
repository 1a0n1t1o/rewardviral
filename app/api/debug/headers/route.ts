import { NextResponse } from "next/server";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  const h = await headers();
  return NextResponse.json({
    "x-whop-user-id": h.get("x-whop-user-id") ?? null,
    "x-whop-company-id": h.get("x-whop-company-id") ?? null,
    referer: h.get("referer") ?? null,
    host: h.get("host") ?? null,
  });
}