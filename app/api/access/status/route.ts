import { NextResponse } from "next/server";
import { getWhopUserId, whopSdk } from "@/lib/whop-sdk";

export const runtime = "nodejs";
export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function GET() {
  const userId = await getWhopUserId();
  if (!userId) {
    return NextResponse.json({ authed: false, hasAccess: false }, { status: 200 });
  }

  const accessPassId = process.env.NEXT_PUBLIC_PREMIUM_ACCESS_PASS_ID;
  if (!accessPassId) {
    return NextResponse.json({ authed: true, hasAccess: false, warn: "Missing NEXT_PUBLIC_PREMIUM_ACCESS_PASS_ID" }, { status: 200 });
  }
  const hasAccess = await whopSdk.access.checkIfUserHasAccessToAccessPass({ accessPassId, userId });
  return NextResponse.json({ authed: true, hasAccess, userId }, { status: 200 });
}
