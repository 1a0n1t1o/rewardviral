import { NextResponse } from 'next/server';
import { readWhopIdentity } from '@/lib/whopIdentity';

export async function GET(req: Request) {
  const { userId } = await readWhopIdentity(req);

  // You already calculate these from passes/plans. Keep your existing logic:
  const hasAccess = /* your existing pass/plan check here */ true; // placeholder

  let accessLevel: 'no_access' | 'member' | 'staff' = 'no_access';
  let role: 'member' | 'staff' | null = null;
  let groupId: string | null = null;

  if (userId && hasAccess) {
    // TODO: implement cookie-based staff claim check
    accessLevel = 'member';
    role = 'member';
  }

  return NextResponse.json({
    authed: Boolean(userId),
    hasAccess,
    accessLevel,
    role,
    userId,
    groupId,
  });
}