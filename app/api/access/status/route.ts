import { NextResponse } from "next/server";
import { getWhopUserId, whopSdk } from "@/lib/whop-server";

type AccessLevel = "staff" | "member" | "no_access";
type AccessJson = {
  authed: boolean;
  hasAccess: boolean;
  accessLevel: AccessLevel;
  userId?: string;
  error?: string;
};

export async function GET() {
  try {
    const userId = getWhopUserId();

    // If not opened from Whop, we can't identify the user.
    if (!userId) {
      const body: AccessJson = {
        authed: false,
        hasAccess: false,
        accessLevel: "no_access",
      };
      return NextResponse.json(body);
    }

    const accessPassId = process.env.NEXT_PUBLIC_PREMIUM_ACCESS_PASS_ID;
    if (!accessPassId) {
      const body: AccessJson = {
        authed: true,
        hasAccess: false,
        accessLevel: "no_access",
        userId,
        error: "Missing NEXT_PUBLIC_PREMIUM_ACCESS_PASS_ID",
      };
      return NextResponse.json(body, { status: 200 });
    }

    const result = await whopSdk.access.checkIfUserHasAccessToAccessPass({
      accessPassId,
      userId,
    });

    // result.hasAccess is authoritative
    const hasAccess = !!result?.hasAccess;

    // Prefer SDK-provided accessLevel if present; otherwise derive it
    const accessLevel: AccessLevel =
      (result as any)?.accessLevel ??
      (hasAccess ? "member" : "no_access");

    const body: AccessJson = {
      authed: true,
      hasAccess,
      accessLevel,
      userId,
    };

    return NextResponse.json(body);
  } catch (e: any) {
    const body: AccessJson = {
      authed: false,
      hasAccess: false,
      accessLevel: "no_access",
      error: e?.message ?? "access check failed",
    };
    return NextResponse.json(body, { status: 500 });
  }
}