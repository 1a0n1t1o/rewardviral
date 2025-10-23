export type AccessLevel = "no_access" | "member" | "staff";

export interface Identity {
  authed: boolean;
  hasAccess: boolean;
  accessLevel: AccessLevel;
  role: "member" | "staff" | null;
  userId: string | null;
  groupId: string | null;
}

/**
 * Build an Identity from a Headers object.
 * (No dependency on `next/headers`.)
 */
export function identityFromHeaders(h?: Headers | null): Identity {
  const userId = h?.get("x-whop-user-id") ?? null;
  const groupId = null; // reserved for future

  if (!userId) {
    return {
      authed: true,
      hasAccess: false,
      accessLevel: "no_access",
      role: null,
      userId,
      groupId,
    };
  }
  return {
    authed: true,
    hasAccess: true,
    accessLevel: "member",
    role: "member",
    userId,
    groupId,
  };
}

/**
 * Convenience for route handlers: pass the Request to read headers.
 */
export function identityFromRequest(req: Request): Identity {
  return identityFromHeaders(req.headers);
}

/**
 * Backwards-compatible no-arg identity for places that don't have a Request.
 * Returns a conservative "no_access". Prefer passing a Request.
 */
export function getIdentity(): Identity {
  return identityFromHeaders(null);
}
