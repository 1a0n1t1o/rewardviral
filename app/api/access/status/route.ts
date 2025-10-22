import { NextResponse } from "next/server";

type HasAccessResult =
  | { __typename: "HasAccessResult"; hasAccess: true; accessLevel: "staff" | "member" }
  | { __typename: "HasAccessResult"; hasAccess: false; accessLevel: "no_access" };

export async function GET(req: Request) {
  // Whop injects this when your app is opened inside their iframe
  const userId = req.headers.get("x-whop-user-id");

  // Not opened from Whop (or not logged in on Whop)
  if (!userId) {
    return NextResponse.json({ authed: false, hasAccess: false, hasAccessLevel: "no_access" } satisfies {
      authed: false;
      hasAccess: false;
      hasAccessLevel: "no_access";
    });
  }

  const staffId = process.env.NEXT_PUBLIC_WHOP_AGENT_USER_ID ?? "";

  const isStaff = userId === staffId;

  // Simple 2-role RBAC:
  // - Staff: always true
  // - Member: any authed non-staff user => true
  const result: HasAccessResult = isStaff
    ? { __typename: "HasAccessResult", hasAccess: true, accessLevel: "staff" }
    : { __typename: "HasAccessResult", hasAccess: true, accessLevel: "member" };

  return NextResponse.json({
    authed: true,
    hasAccess: result.hasAccess,
    hasAccessLevel: result.accessLevel,
    userId,
  });
}