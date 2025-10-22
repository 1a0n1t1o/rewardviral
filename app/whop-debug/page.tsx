"use client";

import { useEffect, useState } from "react";

export default function WhopDebugPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function run() {
      try {
        const res = await fetch("/api/debug/headers", { cache: "no-store" });
        const j = await res.json();
        setData(j);
      } catch (e) {
        setData({ error: (e as any)?.message || "fetch failed" });
      }
    }
    run();
  }, []);

  const inIframe = typeof window !== "undefined" && window.self !== window.top;

  return (
    <div style={{ padding: 24, fontFamily: "ui-sans-serif, system-ui" }}>
      <h1 style={{ fontWeight: 800, fontSize: 24, marginBottom: 12 }}>Whop Debug</h1>
      <p style={{ marginBottom: 8 }}>In iframe: <b>{inIframe ? "yes" : "no"}</b></p>
      <p style={{ marginBottom: 16 }}>Location host: <code>{typeof window !== "undefined" ? window.location.host : ""}</code></p>
      <pre style={{ background: "#111", color: "#0f0", padding: 16, borderRadius: 8, overflowX: "auto" }}>
        {JSON.stringify(data ?? {}, null, 2)}
      </pre>
      <p style={{ marginTop: 16, color: "#777" }}>
        Open this page from Whop: <code>/whop-debug</code>
      </p>
    </div>
  );
}
