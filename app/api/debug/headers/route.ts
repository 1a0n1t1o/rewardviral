import { headers } from "next/headers";

export async function GET() {
  // Read request headers from the edge/runtime
  const h = headers();
  const obj: Record<string, string> = {};
  h.forEach((value, key) => {
    obj[key] = value;
  });

  return new Response(JSON.stringify(obj, null, 2), {
    status: 200,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}