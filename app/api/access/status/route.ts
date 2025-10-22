import { NextResponse } from "next/server";
import { getAccessFromHeaders } from "@/lib/whop";

export const dynamic = "force-dynamic";

export async function GET() {
  const status = await getAccessFromHeaders();
  return NextResponse.json(status, { status: 200 });
}