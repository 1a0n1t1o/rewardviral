import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const h = Object.fromEntries(new Headers(req.headers).entries());
  const pick = (k: string) => h[k.toLowerCase()] ?? null;
  return NextResponse.json({
    "x-whop-user-id": pick("x-whop-user-id"),
    "x-whop-company-id": pick("x-whop-company-id"),
    referer: pick("referer"),
  });
}
