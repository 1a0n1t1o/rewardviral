import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const STAFF_ID = process.env.NEXT_PUBLIC_WHOP_AGENT_USER_ID; // user_...

export async function GET() {
  const h = headers();
  const userId = h.get('x-whop-user-id');

  // If this is null, the app is not being opened from Whop (or headers are blocked).
  if (!userId) {
    return NextResponse.json({
      authed: false,
      hasAccess: false,
      accessLevel: 'no_access',
    });
  }

  const isStaff = STAFF_ID && userId === STAFF_ID;
  return NextResponse.json({
    authed: true,
    hasAccess: true,
    accessLevel: isStaff ? 'staff' : 'member',
    userId,
  });
}