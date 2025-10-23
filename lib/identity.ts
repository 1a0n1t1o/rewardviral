import { headers } from 'next/headers';

type AccessLevel = 'no_access' | 'member' | 'staff';
export type AccessStatus = {
  authed: boolean;
  hasAccess: boolean;
  accessLevel: AccessLevel;
  role: 'member' | 'staff' | null;
  userId: string | null;
  groupId: string | null;
};

/** Base64url decode helper */
function b64urlDecode(input: string): string {
  const pad = input.length % 4 === 2 ? '==' : input.length % 4 === 3 ? '=' : '';
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/') + pad;
  return Buffer.from(base64, 'base64').toString('utf8');
}

/** Try to read the user id from Whop headers or the JWT */
function getUserIdFromHeaders(): string | null {
  const h = headers();

  // 1) Prefer an explicit header if Whop injects it
  const headerId = h.get('x-whop-user-id');
  if (headerId) return headerId;

  // 2) Otherwise parse the JWT payload for { sub, aud }
  const token = h.get('x-whop-user-token');
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const payloadJson = b64urlDecode(parts[1]);
    const payload = JSON.parse(payloadJson) as {
      sub?: string;
      aud?: string;
      iat?: number;
      exp?: number;
      iss?: string;
    };

    // Optional: ensure the token was issued for this app
    const appId = process.env.NEXT_PUBLIC_WHOP_APP_ID;
    if (appId && payload.aud && payload.aud !== appId) return null;

    return payload.sub ?? null;
  } catch {
    return null;
  }
}

/** Minimal "organic" access model:
 * - If we can identify a user from Whop token/headers, they're a member.
 * - Staff can be layered in later.
 */
export function readIdentity(): AccessStatus {
  const userId = getUserIdFromHeaders();

  const authed = !!userId;
  const role: 'member' | 'staff' | null = authed ? 'member' : null;
  const accessLevel: AccessLevel = authed ? 'member' : 'no_access';
  const hasAccess = authed;

  return {
    authed,
    hasAccess,
    accessLevel,
    role,
    userId: userId ?? null,
    groupId: null, // reserved for later
  };
}