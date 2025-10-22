import { NextResponse } from "next/server";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export function GET() {
  const h = Object.fromEntries(headers().entries());
  return NextResponse.json({
    "x-whop-user-id": h["x-whop-user-id"] ?? null,
    "x-whop-company-id": h["x-whop-company-id"] ?? null,
    referer: h["referer"] ?? null,
    host: h["host"] ?? null,
  });
}