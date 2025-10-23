import { NextResponse } from 'next/server';

/**
 * Debug: return all request headers as JSON.
 * Using req.headers avoids Next.js typing differences for `headers()`.
 */
export async function GET(req: Request) {
  const obj: Record<string, string> = {};

  // Request.headers is always synchronous and supports forEach in all runtimes
  req.headers.forEach((value, key) => {
    obj[key] = value;
  });

  return NextResponse.json(obj, { status: 200 });
}