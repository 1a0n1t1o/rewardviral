import { NextResponse } from "next/server";
import { getIdentity } from "@/lib/identity";

export async function GET() {
  const identity = getIdentity();
  return NextResponse.json(identity);
}