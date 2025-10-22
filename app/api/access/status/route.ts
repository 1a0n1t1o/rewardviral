import { NextResponse } from 'next/server';

const STAFF_ID = process.env.NEXT_PUBLIC_WHOP_AGENT_USER_ID ?? '';

export async function GET(req: Request) {
  // Read from the request headers (no next/headers needed)
  const userId = req.headers.get('x-whop-user-id');

  if (!userId) {
    return NextResponse.json({
      authed: false,
      hasAccess: false,
      accessLevel: 'no_access',
    });
  }

  const isStaff = userId === STAFF_ID;

  return NextResponse.json({
    authed: true,
    hasAccess: true,
    accessLevel: isStaff ? 'staff' : 'member',
    userId,
  });
}
