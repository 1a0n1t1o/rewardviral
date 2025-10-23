import { headers } from "next/headers";

export type AccessLevel = "member" | "staff" | "no_access";

export type Identity = {
  authed: boolean;
  hasAccess: boolean;
  accessLevel: AccessLevel;
  role: "member" | "staff" | null;
  userId: string | null;
  groupId: string | null;
};

/**
 * Simple, safe identity getter.
 * - No external calls
 * - Works even if Whop doesn't inject every header
 */
export function getIdentity(): Identity {
  const h = headers(); // Not a Promise

  // Whop sometimes injects x-whop-user-id; when it's not there, we stay null.
  const userId = h.get("x-whop-user-id") ?? null;
  const groupId = null; // reserved for future

  // SIMPLE MODE:
  // Everyone is a member. We'll flip to 'staff' later once your staff-claim flow is ready.
  return {
    authed: true,
    hasAccess: true,
    accessLevel: "member",
    role: "member",
    userId,
    groupId,
  };
}
