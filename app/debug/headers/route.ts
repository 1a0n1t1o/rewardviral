import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  // In this project headers() returns Promise<ReadonlyHeaders>; await it
  const h = await headers();

  const obj = Object.fromEntries(h.entries());

  return new Response(JSON.stringify(obj, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}