import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  // In this project headers() returns Promise<ReadonlyHeaders>; await it
  const h = await headers();

  // ReadonlyHeaders doesn't expose `.entries()` in the type definition here,
  // so build a plain object via `forEach`.
  const obj: Record<string, string> = {};
  h.forEach((value, key) => {
    obj[key] = value;
  });

  return new Response(JSON.stringify(obj, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}