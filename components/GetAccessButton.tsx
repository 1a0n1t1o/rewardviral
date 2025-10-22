"use client";

import { useState } from "react";
import { useIframeSdk } from "@whop/react";

/**
 * The Whop inAppPurchase response currently returns { status: "ok", data: { receiptId?: string, ... } }
 * Older flows/samples used `receipt_id`. Support both to be safe.
 */
type InAppPurchaseOK = {
  status: "ok";
  data: Record<string, unknown> & {
    receiptId?: string;
    receipt_id?: string;
    sessionId?: string;
  };
};

type InAppPurchaseERR = {
  status: "error";
  error: string;
};

type InAppPurchaseRes = InAppPurchaseOK | InAppPurchaseERR;

function getReceiptId(data: InAppPurchaseOK["data"] | undefined) {
  if (!data) return undefined;
  // Prefer modern key; fallback to legacy snake_case
  return (data as any).receiptId ?? (data as any).receipt_id ?? undefined;
}

export default function GetAccessButton() {
  const iframeSdk = useIframeSdk();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string>("");

  const handlePurchase = async () => {
    if (!iframeSdk) return;

    setSubmitting(true);
    setMessage("");

    try {
      const res = (await iframeSdk.inAppPurchase({
        planId: process.env.NEXT_PUBLIC_PREMIUM_PLAN_ID!,
      })) as InAppPurchaseRes;

      if (res.status === "ok") {
        const receiptId = getReceiptId(res.data);
        setMessage(
          receiptId ? `Success! Receipt: ${receiptId}` : "Success! Purchase complete."
        );
      } else {
        setMessage(res.error || "Purchase failed.");
      }
    } catch (err: any) {
      console.error("Purchase failed:", err);
      setMessage("Purchase failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={handlePurchase}
        disabled={!iframeSdk || submitting}
        className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Processing…" : "Get Access"}
      </button>
      {message ? <p className="text-sm text-gray-600">{message}</p> : null}
    </div>
  );
}