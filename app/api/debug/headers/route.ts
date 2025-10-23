import { headers } from "next/headers";

export async function GET() {
  // In some Next.js typings, headers() is Promise<ReadonlyHeaders>
  const h = await headers();

  // Convert to a plain object safely
  const all = Object.fromEntries(Array.from(h.entries()));

  return new Response(JSON.stringify(all, null, 2), {
    status: 200,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}