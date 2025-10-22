import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function onlyWhop(h: Headers) {
  const pick = [
    'x-whop-user-id',
    'x-whop-company-id',
    'x-forwarded-host',
    'referer',
    'origin',
    'host',
    'user-agent',
  ];
  const obj: Record<string, string | null> = {};
  for (const k of pick) obj[k] = h.get(k);
  return obj;
}

export default function DebugHeadersPage() {
  const h = headers();
  const whop = onlyWhop(h as unknown as Headers);
  return (
    <main style={{ padding: 24 }}>
      <h1>Debug Headers</h1>
      <p>Open this page from Whop (Open in app). If x-whop-user-id is null, the app is not being opened from Whop or headers are blocked.</p>
      <pre>{JSON.stringify(whop, null, 2)}</pre>
    </main>
  );
}
