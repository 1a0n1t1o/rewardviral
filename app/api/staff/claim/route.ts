import { NextResponse } from 'next/server';
import { readWhopIdentity } from '@/lib/whopIdentity';

function loadClaimCodes() {
  // env holds JSON like: {"group-a":{"code":"GA-2024-..."},"group-b":{"code":"GB-2024-..."}}
  const raw = process.env.CLAIM_CODES ?? '{}';
  try { return JSON.parse(raw) as Record<string,{code:string}>; } catch { return {}; }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = (searchParams.get('code') || '').trim();
  if (!code) {
    return NextResponse.json({ ok:false, error:'missing_code' }, { status: 400 });
  }

  const { userId } = await readWhopIdentity(req);
  if (!userId) {
    // must be called from inside the Whop iframe so the x-whop-user-token header is present
    return NextResponse.json({ ok:false, error:'not_in_whop_iframe' }, { status: 401 });
  }

  const claimCodes = loadClaimCodes();
  let matchedGroup: string | null = null;
  for (const [groupId, entry] of Object.entries(claimCodes)) {
    if (entry?.code?.toLowerCase() === code.toLowerCase()) {
      matchedGroup = groupId;
      break;
    }
  }
  if (!matchedGroup) {
    return NextResponse.json({ ok:false, error:'invalid_code' }, { status: 400 });
  }

  // TODO: implement cookie-based staff claim storage
  return NextResponse.json({ ok:true, groupId: matchedGroup });
}