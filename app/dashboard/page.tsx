// Simple, null-safe dashboard gate that never throws on missing headers/IDs.
import Link from "next/link";

type AccessStatus = {
  authed: boolean;
  hasAccess: boolean;
  accessLevel: "no_access" | "member" | "staff";
  role: "member" | "staff" | null;
  userId: string | null;
  groupId: string | null;
};

export const dynamic = "force-dynamic";

async function getAccess(): Promise<AccessStatus> {
  try {
    // Relative fetch is fine in a Next.js Server Component.
    const res = await fetch("/api/access/status", { cache: "no-store" });
    if (!res.ok) {
      return {
        authed: false,
        hasAccess: false,
        accessLevel: "no_access",
        role: null,
        userId: null,
        groupId: null,
      };
    }
    const data = (await res.json()) as AccessStatus;
    // Coerce any missing fields so we never crash rendering.
    return {
      authed: !!data.authed,
      hasAccess: !!data.hasAccess,
      accessLevel: (data.accessLevel ?? "no_access") as AccessStatus["accessLevel"],
      role: (data.role ?? null) as AccessStatus["role"],
      userId: data.userId ?? null,
      groupId: data.groupId ?? null,
    };
  } catch {
    return {
      authed: false,
      hasAccess: false,
      accessLevel: "no_access",
      role: null,
      userId: null,
      groupId: null,
    };
  }
}

export default async function DashboardPage() {
  const access = await getAccess();

  // 1) If the user does not have access, show the same "Get Access" gate message
  //    instead of throwing.
  if (!access.hasAccess) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-semibold mb-4">Welcome to Dashboard</h1>
        <div className="rounded border p-4 text-sm">
          <p className="mb-2">
            You don't have access yet. If a <em>"Get Access"</em> button is available,
            use it to purchase. Otherwise contact support.
          </p>
          <Link href="/" className="underline">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  // 2) Member or Staff – render a simple, null-safe dashboard.
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
      <p className="text-sm text-neutral-500 mb-6">
        Role: <b>{access.role ?? "member"}</b>{" "}
        {access.groupId ? (
          <> · Group: <b>{access.groupId}</b></>
        ) : null}
      </p>

      {/* Example: never assume userId or groupId exists */}
      <section className="rounded border p-4 space-y-2">
        <div>
          <span className="font-medium">User ID:</span>{" "}
          <code>{access.userId ?? "none"}</code>
        </div>
        <div>
          <span className="font-medium">Access Level:</span>{" "}
          <code>{access.accessLevel}</code>
        </div>
      </section>
    </main>
  );
}