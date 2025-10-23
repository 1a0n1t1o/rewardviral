export type AccessStatus = {
  authed: boolean;
  hasAccess: boolean;
  accessLevel: 'no_access' | 'member' | 'staff';
  role: 'member' | 'staff' | null;
  userId: string | null;
  groupId: string | null;
};

async function getWhopUserIdFromToken(userToken: string): Promise<string | null> {
  if (!userToken) return null;
  // Ask Whop who this token belongs to (no need to verify JWT ourselves)
  const res = await fetch('https://api.whop.com/api/v2/me', {
    headers: { Authorization: `Bearer ${userToken}` },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  const data = await res.json();
  // Whop returns { id: "user_..." , ... }
  return typeof data?.id === 'string' ? data.id : null;
}

export async function readWhopIdentity(req: Request): Promise<{ userId: string | null; userToken: string | null; appId: string | null; }> {
  const h = req.headers;
  const userToken = h.get('x-whop-user-token');
  const appId = h.get('x-whop-app-id');
  let userId: string | null = null;

  try {
    if (userToken) {
      userId = await getWhopUserIdFromToken(userToken);
    }
  } catch {
    userId = null;
  }
  return { userId, userToken, appId };
}