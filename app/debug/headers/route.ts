import { getHeaders } from '@/lib/getHeaders';

export async function GET() {
  const h = await getHeaders();

  const obj: Record<string, string> = {};
  // Explicit parameter types to satisfy noImplicitAny
  h.forEach((value: string, key: string) => {
    obj[key] = value;
  });

  return new Response(JSON.stringify(obj, null, 2), {
    status: 200,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}