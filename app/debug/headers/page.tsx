'use client';

import { useEffect, useState } from 'react';

export default function DebugHeadersPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/debug/headers')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(String(e)));
  }, []);

  if (error) return <pre>{error}</pre>;
  if (!data) return <pre>Loading…</pre>;
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
