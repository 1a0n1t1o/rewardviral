"use client";
import { useState } from "react";
import { useIframeSdk } from "@whop/react";

export default function GetAccessButton() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [sdkAvailable, setSdkAvailable] = useState<boolean | null>(null);

  // Safely get iframe SDK with feature detection
  let iframeSdk: any = null;
  try {
    iframeSdk = useIframeSdk();
    if (sdkAvailable === null) {
      setSdkAvailable(!!iframeSdk && typeof iframeSdk === "object");
    }
  } catch (err) {
    if (sdkAvailable === null) {
      setSdkAvailable(false);
    }
  }

  async function handlePurchase() {
    try {
      setLoading(true);
      setMsg(null);

      const planId = process.env.NEXT_PUBLIC_PREMIUM_PLAN_ID;
      if (!planId) {
        setMsg("Missing NEXT_PUBLIC_PREMIUM_PLAN_ID");
        return;
      }

      // Check if SDK is available before attempting purchase
      if (!iframeSdk || !iframeSdk.inAppPurchase) {
        setMsg("Can't load purchase modal. Please allow apps.whop.com or try another browser.");
        return;
      }

      const res = await iframeSdk.inAppPurchase({ planId });

      if (res.status === "ok") {
        // Support both return shapes: {receiptId} (current) and {receipt_id} (legacy),
        // and fall back to {sessionId} if present.
        const d = res.data as {
          receiptId?: string;
          receipt_id?: string;
          sessionId?: string;
        };
        const receipt =
          d?.receiptId ?? d?.receipt_id ?? d?.sessionId ?? "unknown";

        setMsg(`Success! Receipt: ${receipt}`);
      } else {
        setMsg(res.error || "Purchase failed");
      }
    } catch (err: any) {
      setMsg(err?.message || "Purchase failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 6 }}>
      <button
        onClick={handlePurchase}
        disabled={loading || !sdkAvailable}
        style={{
          padding: "10px 16px",
          borderRadius: 8,
          border: "1px solid #333",
          fontWeight: 600,
          background: "transparent",
          cursor: loading || !sdkAvailable ? "not-allowed" : "pointer",
          opacity: !sdkAvailable ? 0.6 : 1,
        }}
      >
        {loading ? "Processing…" : "Get Access"}
      </button>
      {!sdkAvailable && (
        <p style={{ fontSize: 12, color: "#dc2626" }}>
          Can't load purchase modal. Please allow apps.whop.com or try another browser.
        </p>
      )}
      {msg && <p style={{ fontSize: 12, color: "#555" }}>{msg}</p>}
    </div>
  );
}
