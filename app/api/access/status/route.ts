import { NextResponse } from "next/server";
import { headers as nextHeaders } from "next/headers";
import { whopSdk } from "@/lib/whop-sdk";

export const runtime = "nodejs";
export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Take incoming headers and allow a Bearer token fallback
    const h = new Headers(await nextHeaders());
    const auth = h.get("authorization");
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      const token = auth.slice(7).trim();
      if (token) h.set("x-whop-user-token", token);
    }

    // Verify user from headers (either injected by Whop proxy or our Bearer fallback)
    const { userId } = await whopSdk.verifyUserToken(h);

    const accessPassId = process.env.NEXT_PUBLIC_PREMIUM_ACCESS_PASS_ID;
    if (!accessPassId) {
      return NextResponse.json({
        authed: true,
        hasAccess: false,
        warn: "Missing NEXT_PUBLIC_PREMIUM_ACCESS_PASS_ID",
        userId,
      });
    }

    const hasAccess = await whopSdk.access.checkIfUserHasAccessToAccessPass({
      accessPassId,
      userId,
    });

    return NextResponse.json({ authed: true, hasAccess, userId });
  } catch (e: any) {
    return NextResponse.json(
      {
        authed: false,
        hasAccess: false,
        error:
          e?.message ||
          "You must provide a valid App API Key or a user token when not using the Whop proxy.",
      },
      { status: 200 }
    );
  }
}
