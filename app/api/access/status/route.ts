import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const roleCookie = req.cookies.get('vr-role')?.value || null;
  const groupCookie = req.cookies.get('vr-group')?.value || null;

  const role = roleCookie === 'staff' ? 'staff' : 'member';
  const groupId = role === 'staff' ? groupCookie ?? null : null;

  // MVP behavior:
  // - Everyone has access and is "authed" (you can tighten later).
  // - Staff is determined purely by the cookie set after a successful claim.
  return NextResponse.json({
    authed: true,
    hasAccess: true,
    accessLevel: role, // "staff" | "member"
    role,
    userId: null,       // We'll wire this to Whop later if you want
    groupId,           // Only set for staff
  });
}