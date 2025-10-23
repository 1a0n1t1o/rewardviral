import { headers } from "next/headers";

export async function GET() {
  // In some environments headers() is typed as Promise<ReadonlyHeaders>
  const h = (await headers()) as unknown as Headers;

  // Build a plain object without relying on fromEntries typings
  const out: Record<string, string> = {};
  // Use .entries() and coerce tuple types to [string, string]
  // to avoid Iterator<unknown> TS friction across runtimes.
  for (const [k, v] of (h as any).entries() as Iterable<[string, string]>) {
    out[String(k)] = String(v);
  }

  return new Response(JSON.stringify(out, null, 2), {
    status: 200,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}