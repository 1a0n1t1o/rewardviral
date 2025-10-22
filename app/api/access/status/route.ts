import { headers } from 'next/headers';
import { getCachedRole, setCachedRole } from '@/lib/role-cache';
import { resolveRoleFromWhop } from '@/lib/whop-check';

type Role = 'no_access' | 'member' | 'staff';
export const dynamic = 'force-dynamic';

// Simple base64 decoder for JWT payloads
function decodeJwtPayload(token: string): any | null {
  try {
    const base64 = token.split('.')[1];
    const json = Buffer.from(base64, 'base64').toString('utf8');
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export async function GET() {
  const h = await headers();

  const jwt = h.get('x-whop-user-token');
  let userId: string | null = null;

  if (jwt) {
    const payload = decodeJwtPayload(jwt);
    if (payload?.sub) {
      userId = payload.sub; // Whop user ID
    }
  }

  if (!userId) {
    return Response.json(
      {
        authed: false,
        hasAccess: false,
        hasAccessLevel: 'no_access',
        message:
          'Missing or invalid x-whop-user-token header. Check Whop app settings.',
      },
      { headers: { 'cache-control': 'no-store' } }
    );
  }

  let role: Role | null = getCachedRole(userId);
  if (!role) {
    role = await resolveRoleFromWhop(userId);
    setCachedRole(userId, role);
  }

  return Response.json(
    {
      authed: true,
      hasAccess: role !== 'no_access',
      hasAccessLevel: role,
      userId,
    },
    { headers: { 'cache-control': 'no-store' } }
  );
}