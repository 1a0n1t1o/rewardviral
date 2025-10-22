import { NextRequest, NextResponse } from "next/server";
import { setDebugUserCookie } from "@/lib/whop";

export async function POST(req: NextRequest) {
  const data = await req.json().catch(() => ({} as any));
  const userId = typeof data?.user === "string" ? data.user : null;

  const res = NextResponse.json({ ok: true, user: userId });
  setDebugUserCookie(res, userId);
  return res;
}
