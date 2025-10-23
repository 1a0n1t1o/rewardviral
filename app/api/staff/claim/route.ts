import { getCurrentUserId } from '@/lib/whopIdentity';
import { claimStaffCode } from '@/lib/store';

export async function POST(req: Request) {
  const userId = getCurrentUserId();
  if (!userId) {
    return new Response(JSON.stringify({ ok: false, error: 'Not authed' }), { status: 401, headers: { 'content-type': 'application/json; charset=utf-8' } });
  }

  const body = await req.json().catch(() => null) as { code?: string } | null;
  const code = body?.code?.trim();
  if (!code) {
    return new Response(JSON.stringify({ ok: false, error: 'Missing code' }), { status: 400, headers: { 'content-type': 'application/json; charset=utf-8' } });
  }

  const result = await claimStaffCode(userId, code);
  if (!result.ok) {
    return new Response(JSON.stringify(result), { status: 400, headers: { 'content-type': 'application/json; charset=utf-8' } });
  }

  return new Response(JSON.stringify(result), { status: 200, headers: { 'content-type': 'application/json; charset=utf-8' } });
}
