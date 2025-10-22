"use client";

import { useEffect, useMemo, useState } from "react";
import { useIframeSdk } from "@whop/react";

type AccessData = {
  authed?: boolean;
  hasAccess?: boolean;
  warn?: string;
  error?: string;
  userId?: string;
};

function getIframeFlag(): boolean {
  try { return typeof window !== "undefined" && window.self !== window.top; }
  catch { return false; }
}

export default function CheckAccessClient() {
  const sdk = useIframeSdk();
  const inIframe = useMemo(getIframeFlag, []);
  const [info, setInfo] = useState<{
    loading: boolean;
    inIframe: boolean;
    providerMounted: boolean;
    token?: string;
    error?: string;
    data?: AccessData;
  }>({ loading: true, inIframe, providerMounted: false });

  useEffect(() => {
    let cancelled = false;

    async function run() {
      // If not in iframe, we don't try to use the SDK at all
      if (!inIframe) {
        setInfo((p) => ({ ...p, loading: false, providerMounted: !!sdk, error: undefined }));
        return;
      }

      try {
        // Provider check: useIframeSdk() should return an object. We guard anyway.
        const providerMounted = !!sdk && typeof sdk === "object";
        let token: string | undefined;

        // Avoid hard assumptions about SDK methods; try a few safely.
        const candidates = [
          (sdk as any)?.getUserToken,       // common
          (sdk as any)?.userToken,          // some builds expose a prop
          (sdk as any)?.user?.getToken,     // nested user helper
        ].filter(Boolean);

        for (const fn of candidates) {
          try {
            const maybe = await Promise.resolve(fn.call ? fn.call(sdk) : fn());
            if (typeof maybe === "string" && maybe.length > 0) {
              token = maybe;
              break;
            }
          } catch {
            // ignore and try next candidate
          }
        }

        // Ask server if we're authed & have access (token optional)
        const res = await fetch("/api/access/status", {
          method: "GET",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          cache: "no-store",
        });

        const data = (await res.json()) as AccessData;

        if (!cancelled) {
          setInfo({
            loading: false,
            inIframe,
            providerMounted,
            token,
            data,
            error: undefined,
          });
        }
      } catch (e: any) {
        if (!cancelled) {
          setInfo({
            loading: false,
            inIframe,
            providerMounted: !!sdk,
            error:
              e?.message ||
              "Client failed talking to /api/access/status. If you use privacy blockers, allow apps.whop.com & whop.com.",
          });
        }
      }
    }

    run();
    return () => { cancelled = true; };
  }, [sdk, inIframe]);

  const box = {
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: 12,
    background: "#fafafa",
  } as const;

  if (info.loading) return <p>Checking access…</p>;

  // Not in iframe ⇒ friendly hint (no crash)
  if (!info.inIframe) {
    return (
      <>
        <div style={{ color: "#dc2626", marginBottom: 10 }}>
          {/* If the provider threw earlier, SafeSection would catch; now we render safely. */}
          {/* Keep this notice visible, it's expected when opened outside Whop. */}
          Open from Whop: You must open this app from Whop so we can identify you.
        </div>
        <div style={box}>
          <strong>Debug</strong>
          <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
{JSON.stringify({ inIframe: info.inIframe, providerMounted: info.providerMounted }, null, 2)}
          </pre>
        </div>
      </>
    );
  }

  // Inside iframe
  if (info.error) {
    return (
      <>
        <div style={{ color: "#dc2626", marginBottom: 10 }}>
          {info.error}
        </div>
        <div style={box}>
          <strong>Debug</strong>
          <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
{JSON.stringify({ inIframe: info.inIframe, providerMounted: info.providerMounted, token: !!info.token }, null, 2)}
          </pre>
        </div>
      </>
    );
  }

  return (
    <div style={box}>
      <strong>Access status</strong>
      <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
{JSON.stringify(
  {
    inIframe: info.inIframe,
    providerMounted: info.providerMounted,
    hasToken: !!info.token,
    server: info.data ?? {},
  },
  null,
  2
)}
      </pre>
    </div>
  );
}
