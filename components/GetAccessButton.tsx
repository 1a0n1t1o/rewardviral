"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

interface GetAccessButtonProps {
  variant?: "solid" | "ghost";
}

export default function GetAccessButton({ variant = "solid" }: GetAccessButtonProps) {
  const iframeSdk = useIframeSdk();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string>("");

  // Don't render if plan ID is not set
  if (!process.env.NEXT_PUBLIC_PREMIUM_PLAN_ID) {
    return null;
  }

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
        // Soft refresh after purchase
        setTimeout(() => router.refresh(), 800);
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

  const baseClasses = "rounded-lg px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50";
  const variantClasses = variant === "ghost" 
    ? "border border-gray-300 hover:bg-gray-50" 
    : "bg-blue-600 text-white hover:bg-blue-700";

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={handlePurchase}
        disabled={!iframeSdk || submitting}
        className={`${baseClasses} ${variantClasses}`}
        aria-live="polite"
      >
        {submitting ? (
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Processing…
          </span>
        ) : (
          "Get Access"
        )}
      </button>
      {message ? <p className="text-sm text-gray-600">{message}</p> : null}
    </div>
  );
}