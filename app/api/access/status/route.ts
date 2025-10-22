import { headers } from 'next/headers';
import { getCachedRole, setCachedRole } from '@/lib/role-cache';
import { resolveRoleFromWhop } from '@/lib/whop-check';

type Role = 'no_access' | 'member' | 'staff';

// Ensure this API route is always dynamic and never statically cached
export const dynamic = 'force-dynamic';

export async function GET() {
  // In this project, `headers()` is typed as Promise<ReadonlyHeaders>.
  // Await it to satisfy TS and the Vercel build.
  const h = await headers();
  const userId = h.get('x-whop-user-id');

  if (!userId) {
    return Response.json(
      { authed: false, hasAccess: false, hasAccessLevel: 'no_access' },
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