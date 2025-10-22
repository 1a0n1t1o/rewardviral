// components/DashboardGate.tsx
"use client";

import { useEffect, useState } from "react";
import GetAccessButton from "./GetAccessButton";

type Status = { authed: boolean; hasAccess: boolean; userId?: string; warn?: string };

export default function DashboardGate() {
  const [status, setStatus] = useState<Status>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function run() {
      try {
        const res = await fetch("/api/access/status", { cache: "no-store" });
        const json = await res.json();
        setStatus(json);
      } catch (e: any) {
        setError(e?.message || "Failed to load status");
      }
    }
    run();
  }, []);

  if (error) {
    return <p className="text-red-600">Error: {error}</p>;
  }

  if (!status) {
    return <p className="opacity-70">Loading…</p>;
  }

  if (!status.authed) {
    return (
      <div className="rounded border p-4">
        <p className="font-medium">Open from Whop</p>
        <p className="opacity-80 text-sm">
          You must open this app from Whop so we can identify you.
        </p>
      </div>
    );
  }

  if (!status.hasAccess) {
    return (
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
    );
  }

  // Unlocked state — keep it simple
  return (
    <div className="rounded border p-4 space-y-2">
      <p className="font-medium">Access Granted</p>
      <p className="opacity-80 text-sm">User: {status.userId}</p>
      <div className="space-y-2">
        <textarea
          placeholder="Write a comment…"
          className="w-full rounded border p-2"
          rows={4}
        />
        <button className="rounded border px-4 py-2">Submit</button>
      </div>
    </div>
  );
}
