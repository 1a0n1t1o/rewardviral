'use client';
import { useState } from 'react';

export function StaffClaimBox() {
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function claim(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch('/api/staff/claim', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Claim failed');
      setMsg('Staff access granted. Refresh the page.');
    } catch (err:any) {
      setMsg(err?.message || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ marginTop: 16 }}>
      <h3>Get Staff Access</h3>
      <form onSubmit={claim}>
        <input
          placeholder="Enter staff code"
          value={code}
          onChange={(e)=>setCode(e.target.value)}
        />
        <button disabled={busy || !code}>Claim</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}
