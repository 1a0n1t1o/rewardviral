// app/api/access/status/route.ts
import { NextResponse } from 'next/server';
import { getWhopUserId, whopSdk } from '@/lib/whop-sdk';
import { isStaffLevel } from '@/lib/rbac';

export async function GET() {
  try {
    const userId = await getWhopUserId().catch(() => null);

    if (!userId) {
      return NextResponse.json({ authed: false, hasAccess: false });
    }

    // Your existing access check:
    const accessPassId = process.env.NEXT_PUBLIC_PREMIUM_ACCESS_PASS_ID;
    if (!accessPassId) {
      return NextResponse.json({
        authed: true,
        hasAccess: false,
        warn: 'Missing NEXT_PUBLIC_PREMIUM_ACCESS_PASS_ID',
      });
    }

    const res = await whopSdk.access.checkIfUserHasAccessToAccessPass({
      accessPassId,
      userId,
    });

    // Try to read an access level returned by your SDK (optional property)
    const accessLevel =
      // @ts-ignore – some SDKs include this nested
      res?.accessLevel ||
      // older shape you've logged from /debug previously:
      // res?.data?.accessLevel ||
      (res?.hasAccess ? 'member' : 'no_access');

    return NextResponse.json({
      authed: true,
      hasAccess: !!res?.hasAccess,
      userId,
      accessLevel,
      isStaff: isStaffLevel(accessLevel),
    });
  } catch (e: any) {
    return NextResponse.json(
      { authed: false, hasAccess: false, error: e?.message || 'access check failed' },
      { status: 500 }
    );
  }
}