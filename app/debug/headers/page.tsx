import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function pickWhop(h: Headers) {
  const keys = [
    'x-whop-user-id',
    'x-whop-company-id',
    'x-forwarded-host',
    'referer',
    'origin',
    'host',
    'user-agent',
  ] as const;

  const obj: Record<string, string | null> = {};
  for (const k of keys) obj[k] = h.get(k);
  return obj;
}

// 👇 make the component async and await headers()
export default async function DebugHeadersPage() {
  const h = await headers();
  const whop = pickWhop(h);

  return (
    <main style={{ padding: 24 }}>
      <h1>Debug Headers</h1>
      <p>Open this page from Whop (Open in app). If x-whop-user-id is null, the app was not opened from Whop.</p>
      <pre>{JSON.stringify(whop, null, 2)}</pre>
    </main>
  );
}
