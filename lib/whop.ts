import { NextRequest, NextResponse } from "next/server";

/** Header Whop injects when your app is loaded inside Whop iFrame */
const WHOP_USER_HEADER = "x-whop-user-id";

/**
 * Read the Whop user id from:
 * 1) the Whop iframe header (production use)
 * 2) a "debug_user" cookie (local/dev or manual impersonation)
 * 3) a ?user= query param (quick manual override)
 */
export function getWhopUserId(req: NextRequest): string | null {
  // 1) real header in Whop iframe
  const fromHeader = req.headers.get(WHOP_USER_HEADER);
  if (fromHeader && fromHeader !== "null") return fromHeader;

  // 2) quick dev override via cookie
  const fromCookie = req.cookies.get("debug_user")?.value;
  if (fromCookie) return fromCookie;

  // 3) one-off override via query param
  const fromQuery = req.nextUrl.searchParams.get("user");
  if (fromQuery) return fromQuery;

  return null;
}

/** Helper to set or clear the debug_user cookie (for manual impersonation) */
export function setDebugUserCookie(res: NextResponse, userId: string | null) {
  if (userId) {
    res.cookies.set("debug_user", userId, { httpOnly: false, sameSite: "lax", path: "/" });
  } else {
    res.cookies.set("debug_user", "", { maxAge: 0, path: "/" });
  }
}
