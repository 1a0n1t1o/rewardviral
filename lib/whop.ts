import { headers } from "next/headers";

export type AccessLevel = "staff" | "member" | "no_access";
export type AccessStatus = { authed: boolean; accessLevel: AccessLevel; userId: string | null };

/**
 * Reads Whop iframe headers and computes access level.
 * - Staff: x-whop-user-id === NEXT_PUBLIC_WHOP_AGENT_USER_ID
 * - Member: any other x-whop-user-id
 * - No access: no x-whop-user-id (not opened from Whop)
 */
export function getAccessFromHeaders(): AccessStatus {
  const h = headers();
  const userId = h.get("x-whop-user-id");

  if (!userId) {
    return { authed: false, accessLevel: "no_access", userId: null };
  }

  const staffId = process.env.NEXT_PUBLIC_WHOP_AGENT_USER_ID;
  const accessLevel: AccessLevel = userId === staffId ? "staff" : "member";
  return { authed: true, accessLevel, userId };
}
