"use client";

import { useEffect, useState } from "react";
import { useIframeSdk } from "@whop/react";

export default function CheckAccessClient() {
  const iframeSdk = useIframeSdk();
  const [state, setState] = useState<any>({ loading: true });

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        // Try to get a Whop user token from the iframe SDK.
        // Different SDK versions name this differently; try both.
        const token =
          (await (iframeSdk as any)?.getUserToken?.()) ??
          (await (iframeSdk as any)?.userToken?.());

        const res = await fetch("/api/access/status", {
          method: "GET",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          cache: "no-store",
        });
        const data = await res.json();
        if (!cancelled) setState({ loading: false, data });
      } catch (e: any) {
        if (!cancelled) setState({ loading: false, error: e?.message || "failed" });
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [iframeSdk]);

  if (state.loading) return <p>Checking access…</p>;
  if (state.error) return <pre style={{ color: "crimson" }}>{state.error}</pre>;
  return (
    <pre style={{ background: "#111", color: "#0f0", padding: 12, borderRadius: 8 }}>
      {JSON.stringify(state.data, null, 2)}
    </pre>
  );
}
