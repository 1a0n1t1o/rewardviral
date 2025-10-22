// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type AccessStatus = {
  authed: boolean;
  hasAccess: boolean;
  userId?: string;
  accessLevel?: string;
  isStaff?: boolean;
  error?: string;
  warn?: string;
};

export default function DashboardPage() {
  const [status, setStatus] = useState<AccessStatus>();
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/access/status', { cache: 'no-store' });
        const j = (await r.json()) as AccessStatus;
        setStatus(j);
      } catch (e) {
        setStatus({ authed: false, hasAccess: false, error: 'Failed to load status' });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div style={{ padding: 24 }}>Loading…</div>;
  }

  if (!status?.authed) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Welcome to Dashboard</h2>
        <div style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8, maxWidth: 720 }}>
          <strong>Open from Whop:</strong> You must open this app from Whop so we can identify you.
        </div>
      </div>
    );
  }

  if (!status.hasAccess) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Welcome to Dashboard</h2>
        <div style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8, maxWidth: 720 }}>
          <p style={{ marginBottom: 12 }}>
            You don't have access yet. If a "Get Access" button is available below, use it to
            purchase. Otherwise contact support.
          </p>
          {/* Render your existing GetAccessButton if present in your project */}
          {/* <GetAccessButton experienceId="..." /> */}
        </div>
      </div>
    );
  }

  // has access – branch on role
  const roleBadge = status.isStaff ? 'Staff' : 'Member';

  return (
    <div style={{ padding: 24 }}>
      <h2>Welcome to Dashboard</h2>

      <div
        style={{
          border: '1px solid #ddd',
          padding: 16,
          borderRadius: 8,
          maxWidth: 900,
          display: 'grid',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
          <span style={{ fontWeight: 600 }}>Access Granted</span>
          <span
            style={{
              fontSize: 12,
              padding: '2px 8px',
              borderRadius: 999,
              background: status.isStaff ? '#e8f5e9' : '#e3f2fd',
              border: `1px solid ${status.isStaff ? '#4caf50' : '#2196f3'}`,
              color: status.isStaff ? '#2e7d32' : '#1565c0',
            }}
          >
            {roleBadge}
          </span>
        </div>

        <div style={{ color: '#555' }}>User: {status.userId}</div>

        {status.isStaff && (
          <section
            style={{
              border: '1px dashed #bbb',
              borderRadius: 8,
              padding: 12,
              background: '#fafafa',
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Staff tools</div>
            <ul style={{ margin: 0, paddingInlineStart: 18 }}>
              <li>See member submissions (coming soon)</li>
              <li>Moderation actions (coming soon)</li>
              <li>Export data (coming soon)</li>
            </ul>
          </section>
        )}

        <section>
          <label htmlFor="comment" style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>
            Write a comment…
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={5}
            style={{ width: '100%', maxWidth: 900 }}
            placeholder="Say hello…"
          />
          <div style={{ marginTop: 8 }}>
            <button
              onClick={() => {
                // Keep it local for now (no backend). You can wire to an API later.
                setComment('');
                alert('Submitted (demo).');
              }}
              style={{
                padding: '6px 12px',
                border: '1px solid #333',
                borderRadius: 6,
                background: '#fff',
              }}
            >
              Submit
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}