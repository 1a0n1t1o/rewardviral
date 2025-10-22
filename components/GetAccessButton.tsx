"use client";
import { useState } from "react";
import { useIframeSdk } from "@whop/react";

export default function GetAccessButton() {
  const iframeSdk = useIframeSdk();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handlePurchase() {
    try {
      setLoading(true);
      setMsg(null);

      const res = await iframeSdk.inAppPurchase({
        planId: process.env.NEXT_PUBLIC_PREMIUM_PLAN_ID!,
      });

      if (res.status === "ok") {
        setMsg(`Success! Receipt: ${res.data.receipt_id}`);
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
        disabled={loading}
        style={{
          padding: "10px 16px",
          borderRadius: 8,
          border: "1px solid #333",
          fontWeight: 600,
          background: "transparent",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Processing…" : "Get Access"}
      </button>
      {msg && <p style={{ fontSize: 12, color: "#555" }}>{msg}</p>}
    </div>
  );
}
