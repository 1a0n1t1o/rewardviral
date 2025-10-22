// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getWhopDisplayName } from '@/lib/whop-shared';
import GetAccessButton from '@/components/GetAccessButton';
import StaffBadge from '@/components/StaffBadge';

type AccessStatus = {
  authed: boolean;
  hasAccess: boolean;
  userId?: string;
  accessLevel?: string;
  isStaff?: boolean;
  error?: string;
  warn?: string;
};

// Testing notes:
// - Staff user should see: Access Granted + Staff badge + "Staff tools" box + comment form.
// - Non-staff with access: Access Granted (no badge) + comment form.
// - No access: Short message + Get Access button (if plan id is present).
// - After purchase success, page refresh should show Access Granted state.

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
        setStatus({ authed: false, hasAccess: false, error: 'Could not verify access. Please try again.' });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl p-8">
        <h1 className="text-3xl font-bold mb-6">Welcome to Dashboard</h1>
        <div className="rounded border p-4">
          <p className="opacity-70">Loading…</p>
        </div>
      </div>
    );
  }

  if (!status?.authed) {
    return (
      <div className="mx-auto max-w-3xl p-8">
        <h1 className="text-3xl font-bold mb-6">Welcome to Dashboard</h1>
        <div className="rounded border p-4">
          <p className="font-medium">Open from Whop</p>
          <p className="opacity-80 text-sm">
            You must open this app from Whop so we can identify you.
          </p>
        </div>
      </div>
    );
  }

  if (!status.hasAccess) {
    return (
      <div className="mx-auto max-w-3xl p-8">
        <h1 className="text-3xl font-bold mb-6">Welcome to Dashboard</h1>
        <div className="rounded border p-4 space-y-3">
          <div>
            <p className="font-medium">No access yet</p>
            <p className="opacity-80 text-sm">
              Purchase the pass to unlock the dashboard.
            </p>
            {status.warn && <p className="text-yellow-700 text-sm mt-1">{status.warn}</p>}
          </div>
          <GetAccessButton />
        </div>
      </div>
    );
  }

  // Has access - show role-based UI
  const displayName = getWhopDisplayName({ 
    id: status.userId || 'unknown', 
    username: null, 
    name: null 
  });

  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to Dashboard</h1>

      <div className="rounded border p-4 space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold">Access Granted</h2>
          {status.isStaff && <StaffBadge />}
        </div>

        <p className="text-sm text-gray-600">User: {displayName}</p>

        {status.isStaff && (
          <div className="rounded border border-dashed border-gray-300 p-3 bg-gray-50">
            <h3 className="font-medium text-sm mb-2">Staff tools</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• See member submissions (coming soon)</li>
              <li>• Moderation actions (coming soon)</li>
              <li>• Export data (coming soon)</li>
            </ul>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="comment" className="block font-medium text-sm">
            Write a comment…
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full rounded border p-2 text-sm"
            placeholder="Say hello…"
          />
          <button
            onClick={() => {
              setComment('');
              alert('Submitted (demo).');
            }}
            className="rounded border px-3 py-1 text-sm hover:bg-gray-50"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}