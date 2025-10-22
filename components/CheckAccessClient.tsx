"use client";

import { useEffect, useMemo, useState } from "react";
import { useIframeSdk } from "@whop/react";

type Status =
  | { loading: true }
  | { loading: false; error?: string; data?: any; note?: string; debug?: any };

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
      // Collect debug info
      const debug = {
        inIframe,
        hasIframeSdk: !!iframeSdk,
        sdkMethods: iframeSdk ? Object.keys(iframeSdk) : [],
        userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "unknown",
        location: typeof window !== "undefined" ? window.location.href : "unknown",
        referrer: typeof document !== "undefined" ? document.referrer : "unknown",
      };

      // Not in Whop iframe → don't touch the SDK; show hint with debug
      if (!inIframe) {
        setStatus({
          loading: false,
          note: "Open from Whop: You must open this app from Whop so we can identify you.",
          debug,
        });
        return;
      }

      // Check if SDK is properly mounted
      if (!iframeSdk) {
        setStatus({
          loading: false,
          error: "WhopProvider not mounted or SDK failed to initialize. Check console for errors.",
          debug,
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
        let tokenError: string | undefined;

        if (getToken) {
          try {
            token = await getToken.call(iframeSdk);
          } catch (e: any) {
            // SDK present but failed to return a token
            token = undefined;
            tokenError = e?.message || "Token fetch failed";
          }
        } else {
          tokenError = "No token method available on SDK";
        }

        const res = await fetch("/api/access/status", {
          method: "GET",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          cache: "no-store",
        });

        const data = await res.json();
        if (!cancelled) {
          setStatus({ 
            loading: false, 
            data: {
              ...data,
              tokenPresent: !!token,
              tokenError,
            },
            debug 
          });
        }
      } catch (e: any) {
        if (!cancelled)
          setStatus({
            loading: false,
            error:
              e?.message ||
              "Could not contact /api/access/status. If you're using privacy/ad blockers, allow apps.whop.com.",
            debug,
          });
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [iframeSdk, inIframe]);

  if (status.loading) return <p>Checking access…</p>;

  // Not in iframe → friendly notice with debug
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
        <div style={{ marginBottom: 8 }}>{status.note}</div>
        {status.debug && (
          <details style={{ fontSize: 12, color: "#666" }}>
            <summary>Debug info</summary>
            <pre style={{ marginTop: 4, fontSize: 10, overflowX: "auto" }}>
              {JSON.stringify(status.debug, null, 2)}
            </pre>
          </details>
        )}
      </div>
    );
  }

  if (status.error) {
    return (
      <div>
        <pre style={{ color: "crimson", whiteSpace: "pre-wrap", marginBottom: 8 }}>
          {status.error}
        </pre>
        {status.debug && (
          <details style={{ fontSize: 12, color: "#666" }}>
            <summary>Debug info</summary>
            <pre style={{ marginTop: 4, fontSize: 10, overflowX: "auto" }}>
              {JSON.stringify(status.debug, null, 2)}
            </pre>
          </details>
        )}
      </div>
    );
  }

  return (
    <div>
      <pre
        style={{
          background: "#111",
          color: "#0f0",
          padding: 12,
          borderRadius: 8,
          overflowX: "auto",
          marginBottom: 8,
        }}
      >
        {JSON.stringify(status.data ?? {}, null, 2)}
      </pre>
      {status.debug && (
        <details style={{ fontSize: 12, color: "#666" }}>
          <summary>Debug info</summary>
          <pre style={{ marginTop: 4, fontSize: 10, overflowX: "auto" }}>
            {JSON.stringify(status.debug, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
