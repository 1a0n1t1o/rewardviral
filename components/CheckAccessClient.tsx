"use client";

import { useEffect, useMemo, useState } from "react";
import { useIframeSdk } from "@whop/react";

type Status =
  | { loading: true }
  | { loading: false; error?: string; data?: any; note?: string };

function isInIframe(): boolean {
  try {
    return typeof window !== "undefined" && window.self !== window.top;
  } catch {
    return false;
  }
}

export default function CheckAccessClient() {
  const iframeSdk = useIframeSdk();
  const [status, setStatus] = useState<Status>({ loading: true });

  const inIframe = useMemo(isInIframe, []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      // Not in Whop iframe → don't touch the SDK; show hint
      if (!inIframe) {
        setStatus({
          loading: false,
          note:
            "Open from Whop: You must open this app from Whop so we can identify you.",
        });
        return;
      }

      try {
        // Some blockers can prevent SDK initialization; guard everything
        const getToken =
          (iframeSdk as any)?.getUserToken ||
          (iframeSdk as any)?.userToken ||
          null;

        let token: string | undefined;
        if (getToken) {
          try {
            token = await getToken.call(iframeSdk);
          } catch (e: any) {
            // SDK present but failed to return a token
            token = undefined;
          }
        }

        const res = await fetch("/api/access/status", {
          method: "GET",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          cache: "no-store",
        });

        const data = await res.json();
        if (!cancelled) setStatus({ loading: false, data });
      } catch (e: any) {
        if (!cancelled)
          setStatus({
            loading: false,
            error:
              e?.message ||
              "Could not contact /api/access/status. If you're using privacy/ad blockers, allow apps.whop.com.",
          });
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [iframeSdk, inIframe]);

  if (status.loading) return <p>Checking access…</p>;

  // Not in iframe → friendly notice
  if (status.note) {
    return (
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 12,
          background: "#fafafa",
        }}
      >
        {status.note}
      </div>
    );
  }

  if (status.error) {
    return (
      <pre style={{ color: "crimson", whiteSpace: "pre-wrap" }}>
        {status.error}
      </pre>
    );
  }

  return (
    <pre
      style={{
        background: "#111",
        color: "#0f0",
        padding: 12,
        borderRadius: 8,
        overflowX: "auto",
      }}
    >
      {JSON.stringify(status.data ?? {}, null, 2)}
    </pre>
  );
}
