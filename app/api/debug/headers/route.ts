// app/api/debug/headers/route.ts
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export function GET() {
  // headers() is synchronous — do NOT await it
  const h = headers();

  // Avoid forEach typing issues by using entries()
  const obj: Record<string, string> = {};
  for (const [key, value] of h.entries()) {
    obj[key] = value;
  }

  return NextResponse.json(obj, { status: 200 });
}