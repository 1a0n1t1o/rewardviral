import { NextResponse } from "next/server";
import { getWhopUserId, whopSdk } from "@/lib/whop-server";

type AccessJson = {
  authed: boolean;
  hasAccess: boolean;
  accessLevel?: "staff" | "member" | "no_access";
  userId?: string;
  error?: string;
  warn?: string;
};

// GET /api/access/status
export async function GET() {
  try {
    // 1) Identify user from Whop iframe headers
    const userId = getWhopUserId();
    if (!userId) {
      const body: AccessJson = {
        authed: false,
        hasAccess: false,
      };
      return NextResponse.json(body, { status: 200 });
    }

    // 2) Access Pass id from env (public or private is fine, we just need a consistent source)
    const accessPassId = process.env.NEXT_PUBLIC_PREMIUM_ACCESS_PASS_ID;
    if (!accessPassId) {
      const body: AccessJson = {
        authed: true,
        hasAccess: false,
        userId,
        warn: "Missing NEXT_PUBLIC_PREMIUM_ACCESS_PASS_ID",
      };
      return NextResponse.json(body, { status: 200 });
    }

    // 3) Ask Whop if this user has access to the pass
    const result = await whopSdk.access.checkIfUserHasAccessToAccessPass({
      userId,
      accessPassId,
    });

    const accessLevel: AccessJson["accessLevel"] =
      result?.hasAccess ? (result?.isStaff ? "staff" : "member") : "no_access";

    const body: AccessJson = {
      authed: true,
      hasAccess: !!result?.hasAccess,
      accessLevel,
      userId,
    };

    return NextResponse.json(body, { status: 200 });
  } catch (e: unknown) {
    const msg =
      e && typeof e === "object" && "message" in e
        ? String((e as any).message)
        : "access check failed";
    const body: AccessJson = {
      authed: false,
      hasAccess: false,
      error: msg,
    };
    return NextResponse.json(body, { status: 500 });
  }
}