"use client";

import { useEffect, useState } from "react";

type MeResp =
  | { authed: false; user: null }
  | { authed: true; user: { id: string; name: string } };

export default function DashboardPage() {
  const [me, setMe] = useState<MeResp | null>(null);
  const [count, setCount] = useState<number>(0);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const [meRes, cRes] = await Promise.all([
        fetch("/api/whop/me", { cache: "no-store" }),
        fetch("/api/submissions", { cache: "no-store" }),
      ]);
      const meJson = await meRes.json();
      const cJson = await cRes.json();
      setMe(meJson);
      setCount(cJson?.count ?? 0);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function submit() {
    try {
      const userId =
        (me && me.authed && me.user?.id) ? me.user.id : "anon";
      const r = await fetch("/api/submissions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text, userId }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Submit failed");
      setText("");
      setCount(j?.count ?? count);
    } catch (e: any) {
      alert(e?.message ?? "Submit failed");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{ width: 520, maxWidth: "100%", display: "grid", gap: 16 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>Welcome to Dashboard</h1>

        {loading ? (
          <div>Loading…</div>
        ) : error ? (
          <div style={{ color: "crimson" }}>Error: {error}</div>
        ) : (
          <>
            <div
              style={{
                padding: 12,
                border: "1px solid #222",
                borderRadius: 8,
                display: "grid",
                gap: 6,
              }}
            >
              <div><strong>User:</strong> {me?.authed ? me.user.name : "Not authenticated"}</div>
              <div><strong>Submissions:</strong> {count}</div>
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write a comment…"
                rows={4}
                style={{ padding: 10, borderRadius: 8, border: "1px solid #333" }}
              />
              <button
                onClick={submit}
                disabled={!text.trim()}
                style={{
                  padding: "10px 16px",
                  borderRadius: 8,
                  border: "1px solid #333",
                  fontWeight: 600,
                  cursor: text.trim() ? "pointer" : "not-allowed",
                  background: "transparent",
                }}
              >
                Submit
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}