import { NextRequest, NextResponse } from "next/server";
import { getWhopUserId } from "@/lib/whop";
import { roleForUser } from "@/lib/rbac";

export async function GET(req: NextRequest) {
  const userId = getWhopUserId(req);
  const role = roleForUser(userId);

  const payload = {
    authed: !!userId,                     // did we resolve *a* user id?
    hasAccess: role !== "no_access",
    hasAccessLevel: role,
    userId: userId ?? null,
  };

  return NextResponse.json(payload);
}