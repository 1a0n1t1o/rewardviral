import Link from "next/link";
import { getAccessFromHeaders, type AccessLevel } from "@/lib/whop";

export default async function DashboardPage() {
  const status = await getAccessFromHeaders();
  const passId = process.env.NEXT_PUBLIC_PREMIUM_ACCESS_PASS_ID;

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
  status: { authed: boolean; accessLevel: AccessLevel; userId: string | null };
  passId?: string;
}) {
  if (status.accessLevel === "staff") {
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

  if (status.accessLevel === "member") {
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

  return (
    <section className="rounded border p-4">
      <p className="mb-2 font-medium">Welcome to Dashboard</p>
      <p className="text-sm text-gray-700">
        You don&apos;t have access yet. If a &quot;Get Access&quot; button is available below, use it to purchase.
        Otherwise contact support.
      </p>
      {passId ? (
        <Link
          href={`https://whop.com/checkout/${passId}`}
          className="mt-4 inline-block rounded bg-black px-3 py-2 text-white"
        >
          Get Access
        </Link>
      ) : null}
    </section>
  );
}