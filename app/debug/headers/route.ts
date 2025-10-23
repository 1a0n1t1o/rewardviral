import { getHeaders } from '@/lib/getHeaders';

export async function GET() {
  const h = await getHeaders();

  const obj: Record<string, string> = {};
  // ReadonlyHeaders supports forEach(key, value)
  h.forEach((value, key) => {
    obj[key] = value;
  });

  return new Response(JSON.stringify(obj, null, 2), {
    status: 200,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}