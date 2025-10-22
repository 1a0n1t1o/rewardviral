import { headers } from 'next/headers';

export async function GET() {
  const h = headers();
  const obj = Object.fromEntries(h.entries());
  return new Response(JSON.stringify(obj, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}