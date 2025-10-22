// components/GetAccessButton.tsx
"use client";

import { useState } from "react";
import { useIframeSdk } from "@whop/react";

export default function GetAccessButton() {
  const iframeSdk = useIframeSdk();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string>();

  async function handlePurchase() {
    setLoading(true);
    setMsg(undefined);
    try {
      const planId = process.env.NEXT_PUBLIC_PREMIUM_PLAN_ID!;
      const res = await iframeSdk.inAppPurchase({ planId });

      if (res.status === "ok") {
        setMsg(`Success! Receipt: ${res.data.receipt_id}`);
        // soft refresh after purchase so /api/access/status reflects new access
        setTimeout(() => window.location.reload(), 800);
      } else {
        setMsg(res.error || "Purchase failed");
      }
    } catch (e: any) {
      setMsg(e?.message || "Purchase failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handlePurchase}
        disabled={loading}
        className="rounded border px-4 py-2"
      >
        {loading ? "Processing..." : "Get Access"}
      </button>
      {msg && <p className="text-sm opacity-80">{msg}</p>}
    </div>
  );
}