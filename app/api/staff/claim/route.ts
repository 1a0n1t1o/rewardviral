import { NextRequest, NextResponse } from 'next/server';

type ClaimCodes = Record<string, string>; // code -> groupId

function readClaimCodes(): ClaimCodes {
  try {
    const raw = process.env.CLAIM_CODES || '{}';
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed as ClaimCodes;
  } catch {}
  return {};
}

export async function POST(req: NextRequest) {
  let code = '';
  try {
    const body = await req.json();
    code = (body?.code || '').trim();
  } catch {
    // ignore
  }

  const codes = readClaimCodes();
  const groupId = codes[code];

  if (!groupId) {
    return NextResponse.json(
      { ok: false, error: 'invalid_code' },
      { status: 400 }
    );
  }

  // Mark as staff and remember group
  const res = NextResponse.json({ ok: true, role: 'staff', groupId });
  // httpOnly so JS can't read them; lax is fine for app use
  res.cookies.set('vr-role', 'staff', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  res.cookies.set('vr-group', groupId, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}