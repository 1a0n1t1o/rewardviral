import React from "react";
import { getIdentity } from "@/lib/identity";

export default function DashboardPage() {
  const identity = getIdentity();

  if (!identity.hasAccess) {
    return (
      <div className="prose max-w-3xl">
        <h1>Welcome to Dashboard</h1>
        <div className="border rounded p-4">
          You don&apos;t have access yet. If a &quot;Get Access&quot; button is available below,
          use it to purchase. Otherwise contact support.
        </div>
      </div>
    );
  }

  // Member view (simple mode)
  return (
    <div className="prose max-w-3xl">
      <h1>Welcome to Dashboard</h1>
      <p className="mt-2">You&apos;re in! (Simple mode: everyone is a member.)</p>
      <ul className="mt-4">
        <li>Role: {identity.role}</li>
        <li>Access level: {identity.accessLevel}</li>
        <li>User ID: {identity.userId ?? "unknown"}</li>
        <li>Group ID: {identity.groupId ?? "none"}</li>
      </ul>
    </div>
  );
}