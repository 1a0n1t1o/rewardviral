import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  const h = await headers(); // await to satisfy your project's typing
  const obj = Object.fromEntries(h.entries());
  return new Response(JSON.stringify(obj, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}