import { getCurrentUserId } from '@/lib/whopIdentity';
import { claimStaffCode } from '@/lib/store';

export async function POST(req: Request) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return new Response(JSON.stringify({ error: 'missing user id' }), {
      status: 401,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  }

  const body = await req.json().catch(() => ({}));
  const code = typeof body?.code === 'string' ? body.code.trim() : '';

  if (!code) {
    return new Response(JSON.stringify({ error: 'code required' }), {
      status: 400,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  }

  const result = await claimStaffCode(userId, code);

  return new Response(JSON.stringify(result), {
    status: result?.ok ? 200 : 400,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
