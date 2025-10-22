"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type AccessStatus = {
  authed: boolean;
  hasAccess: boolean;
  hasAccessLevel: "staff" | "member" | "no_access";
  userId?: string | null;
};

export default function DashboardPage() {
  const [status, setStatus] = useState<AccessStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const passId = process.env.NEXT_PUBLIC_PREMIUM_ACCESS_PASS_ID;

  useEffect(() => {
    fetch("/api/access/status")
      .then((res) => res.json())
      .then((data) => {
        setStatus(data);
        setLoading(false);
      })
      .catch(() => {
        setStatus({
          authed: false,
          hasAccess: false,
          hasAccessLevel: "no_access",
          userId: null,
        });
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-semibold mb-6">Welcome to Dashboard</h1>
        <p className="text-sm text-gray-600">Loading...</p>
      </main>
    );
  }

  if (!status) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-semibold mb-6">Welcome to Dashboard</h1>
        <p className="text-sm text-red-600">Error loading access status</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold mb-6">Welcome to Dashboard</h1>
      <RoleBlock status={status} passId={passId} />
    </main>
  );
}

function RoleBlock({
  status,
  passId,
}: {
  status: AccessStatus;
  passId?: string;
}) {
  if (status.hasAccessLevel === "staff") {
    return (
      <section className="rounded border p-4">
        <p className="mb-2 font-medium">
          Access Granted{" "}
          <span className="ml-2 rounded bg-green-100 px-2 py-0.5 text-xs text-green-800">Staff</span>
        </p>
        <p className="mb-4 text-sm text-gray-600">User: {status.userId}</p>
        <div className="rounded border border-dashed bg-gray-50 p-4 text-sm">
          <p className="font-medium mb-1">Staff tools</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>See member submissions (coming soon)</li>
            <li>Moderation actions (coming soon)</li>
            <li>Export data (coming soon)</li>
          </ul>
        </div>
      </section>
    );
  }

  if (status.hasAccessLevel === "member") {
    return (
      <section className="rounded border p-4">
        <p className="mb-2 font-medium">Access Granted</p>
        <p className="mb-4 text-sm text-gray-600">User: {status.userId}</p>
        <label className="block text-sm font-medium mb-1">Write a comment…</label>
        <textarea className="w-full rounded border p-2 h-28" placeholder="Say hello..." />
        <button className="mt-3 rounded bg-black px-3 py-2 text-white">Submit</button>
      </section>
    );
  }

  const appId = process.env.NEXT_PUBLIC_WHOP_APP_ID!;
  const planId = process.env.NEXT_PUBLIC_PREMIUM_PLAN_ID!; // or use PRODUCT_ID if you prefer Option B

  const checkoutUrl = `https://whop.com/checkout/${planId}?app_id=${appId}`;
  // If you prefer product instead of plan:
  // const checkoutUrl = `https://whop.com/checkout/${process.env.NEXT_PUBLIC_PREMIUM_ACCESS_PASS_ID!}?app_id=${appId}`;

  return (
    <section className="rounded border p-4">
      <p className="mb-2 font-medium">Welcome to Dashboard</p>
      <p className="text-sm text-gray-700">
        You don&apos;t have access yet. If a &quot;Get Access&quot; button is available below, use it to purchase.
        Otherwise contact support.
      </p>
      <a
        href={checkoutUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center rounded border px-3 py-2 text-sm font-medium hover:bg-muted"
      >
        Get Access
      </a>
    </section>
  );
}