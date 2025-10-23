import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export function GET() {
  const h = headers();                    // NOT awaited
  const obj: Record<string, string> = {};
  // Headers in Next.js implement forEach
  h.forEach((value, key) => {
    obj[key] = value;
  });
  return NextResponse.json(obj, { status: 200 });
}