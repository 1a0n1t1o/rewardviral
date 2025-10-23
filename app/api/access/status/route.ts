import { getCurrentUserId } from '@/lib/whopIdentity';
import { getRole } from '@/lib/store';

export async function GET() {
  const userId = await getCurrentUserId();
  const base = { authed: !!userId, userId: userId ?? undefined };

  if (!userId) {
    return Response.json({ ...base, hasAccess: false, accessLevel: 'no_access' }, { headers: { 'content-type': 'application/json; charset=utf-8' } });
  }

  const rec = await getRole(userId);
  const accessLevel = rec.role === 'staff' ? 'staff' : 'member';

  return Response.json(
    {
      ...base,
      hasAccess: true,
      accessLevel,
      role: rec.role,
      groupId: rec.groupId ?? null
    },
    { headers: { 'content-type': 'application/json; charset=utf-8' } }
  );
}