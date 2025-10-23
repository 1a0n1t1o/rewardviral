'use client';

import { useState } from 'react';

export default function StaffClaim() {
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const res = await fetch('/api/staff/claim', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ code })
    });
    const json = await res.json();
    if (json.ok) setMsg(`✅ Staff access granted for group: ${json.groupId}`);
    else setMsg(`❌ ${json.error || 'Failed to claim'}`);
  }

  return (
    <div style={{ borderTop: '1px solid #ddd', marginTop: 24, paddingTop: 16 }}>
      <h3>Get staff access</h3>
      <form onSubmit={submit} style={{ display: 'flex', gap: 8 }}>
        <input
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="Enter staff code"
          style={{ padding: 8, border: '1px solid #ccc', borderRadius: 4, minWidth: 220 }}
        />
        <button type="submit" style={{ padding: '8px 12px' }}>Claim</button>
      </form>
      {msg && <p style={{ marginTop: 8 }}>{msg}</p>}
    </div>
  );
}
