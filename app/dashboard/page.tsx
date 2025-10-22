"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [status, setStatus] = useState<null | { role: string }>(null);

  useEffect(() => {
    fetch("/api/access/status")
      .then((r) => r.json())
      .then(setStatus)
      .catch(console.error);
  }, []);

  if (!status) return <p>Loading...</p>;

  if (status.role === "staff") {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Welcome, Staff</h1>
        <ul className="mt-4 list-disc pl-4">
          <li>See member submissions (coming soon)</li>
          <li>Moderation actions (coming soon)</li>
          <li>Export data (coming soon)</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome, Member</h1>
      <p className="mt-2">You don't have access to staff tools.</p>
    </div>
  );
}