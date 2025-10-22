// app/api/webhooks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

/**
 * Whop sends a signature header. We'll verify against WHOP_WEBHOOK_SECRET.
 * If WHOP_WEBHOOK_SECRET is not set (dev), we accept the event but warn.
 */

const SECRET = process.env.WHOP_WEBHOOK_SECRET || "";

function verifySignature(payload: string, signature: string | null): boolean {
  if (!SECRET) {
    // Dev mode fallback – accept but log a warning.
    console.warn("[webhooks] WHOP_WEBHOOK_SECRET not set; skipping signature verification.");
    return true;
  }
  if (!signature) return false;

  // Standard HMAC SHA256 verification
  const hmac = createHmac("sha256", SECRET);
  hmac.update(payload, "utf8");
  const digest = Buffer.from(hmac.digest("hex"));
  const given = Buffer.from(signature);

  // Avoid subtle timing leaks
  if (digest.length !== given.length) return false;
  return timingSafeEqual(digest, given);
}

export async function POST(req: NextRequest) {
  // IMPORTANT: read raw body text for HMAC
  const bodyText = await req.text();
  const sig = headers().get("whop-signature"); // If Whop uses a different name, update here.

  const ok = verifySignature(bodyText, sig);
  if (!ok) {
    return NextResponse.json({ ok: false, error: "invalid signature" }, { status: 401 });
  }

  // Parse JSON AFTER verification
  let event: unknown;
  try {
    event = JSON.parse(bodyText);
  } catch {
    return NextResponse.json({ ok: false, error: "invalid JSON" }, { status: 400 });
  }

  // TODO: Handle events you care about.
  // For now we simply acknowledge.
  // Example:
  // if ((event as any)?.type === "subscription.created") { ... }

  return NextResponse.json({ ok: true });
}

// Next 13/14/15 route settings – keep it dynamic (webhook must not be statically optimized)
export const dynamic = "force-dynamic";