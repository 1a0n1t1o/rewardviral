import { NextResponse } from "next/server";
import { getAccessFromHeaders } from "@/lib/whop";

export const dynamic = "force-dynamic";

export function GET() {
  const status = getAccessFromHeaders();
  return NextResponse.json(status, { status: 200 });
}