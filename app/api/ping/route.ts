export const runtime = "nodejs";
export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(`pong ${Date.now()}`, {
    headers: { "cache-control": "no-store" },
  });
}
