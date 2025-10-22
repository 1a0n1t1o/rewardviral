import { headers } from 'next/headers';
import { getCachedRole, setCachedRole } from '@/lib/role-cache';
import { resolveRoleFromWhop } from '@/lib/whop-check';

type Role = 'no_access' | 'member' | 'staff';

export async function GET() {
  const h = headers();
  const userId = h.get('x-whop-user-id');

  if (!userId) {
    return Response.json({
      authed: false,
      hasAccess: false,
      hasAccessLevel: 'no_access',
    });
  }

  let role: Role | null = getCachedRole(userId);
  if (!role) {
    role = await resolveRoleFromWhop(userId);
    setCachedRole(userId, role);
  }

  return Response.json({
    authed: true,
    hasAccess: role !== 'no_access',
    hasAccessLevel: role,
    userId,
  });
}