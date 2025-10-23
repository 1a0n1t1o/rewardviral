"use client";
import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optional: send to your logging if you add one later
    // console.error(error);
  }, [error]);

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold mb-3">Something went wrong</h1>
      <p className="mb-4 text-sm text-neutral-500">
        {error.message || "A server-side exception occurred while loading this page."}
        {error.digest ? <> (Digest: {error.digest})</> : null}
      </p>
      <button
        onClick={() => reset()}
        className="rounded border px-3 py-1 text-sm hover:bg-neutral-50"
      >
        Try again
      </button>
    </main>
  );
}
