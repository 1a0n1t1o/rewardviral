"use client";

import { useEffect, useState } from "react";
import GetAccessButton from "@/components/GetAccessButton";
import dynamic from "next/dynamic";
const CheckAccessClient = dynamic(() => import("@/components/CheckAccessClient"), { ssr: false });

type AccessResp =
  | { authed: false; hasAccess: false }
  | { authed: true; hasAccess: boolean; userId: string };

export default function DashboardPage() {
  const [state, setState] = useState<AccessResp | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [text, setText] = useState("");

  async function load() {
    try {
      setErr(null);
      const r = await fetch("/api/access/status", { cache: "no-store" });
      const j = await r.json();
      setState(j);
    } catch (e: any) {
      setErr(e?.message || "Failed to load access");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function submit() {
    const r = await fetch("/api/submissions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text, userId: state && state.authed ? state.userId : "anon" }),
    });
    const j = await r.json();
    if (!r.ok) return alert(j?.error || "Submit failed");
    setText("");
    alert("Submitted!");
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

        {/* Debug panel (remove later): shows authed/hasAccess when opened inside Whop */}
        <div style={{ marginBottom: 16 }}>
          <CheckAccessClient />
        </div>

        {err && <div style={{ color: "crimson" }}>Error: {err}</div>}
        {!state && !err && <div>Loading…</div>}

        {state && !state.authed && (
          <div
            style={{
              border: "1px solid #222",
              borderRadius: 8,
              padding: 12,
            }}
          >
            <strong>Open from Whop:</strong> You must open this app from Whop so we can identify you.
          </div>
        )}

        {state && state.authed && !state.hasAccess && (
          <div
            style={{
              border: "1px solid #222",
              borderRadius: 8,
              padding: 12,
              display: "grid",
              gap: 12,
            }}
          >
            <div>You don't have access yet.</div>
            <GetAccessButton />
          </div>
        )}

        {state && state.authed && state.hasAccess && (
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
              <div><strong>Status:</strong> Access active ✅</div>
              <div><strong>User ID:</strong> {state.userId}</div>
            </div>

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
                background: "transparent",
                cursor: text.trim() ? "pointer" : "not-allowed",
              }}
            >
              Submit
            </button>
          </>
        )}
      </div>
    </main>
  );
}