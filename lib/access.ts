export type AccessLevel = "staff" | "member" | "no_access";

export type AccessStatus = {
  authed: boolean;
  accessLevel: AccessLevel;
  userId?: string | null;
};

export function getAccessFromHeaders(req: Request): AccessStatus {
  const userId = req.headers.get("x-whop-user-id"); // Whop injects inside iframe
  if (userId) {
    const staffId = process.env.NEXT_PUBLIC_WHOP_AGENT_USER_ID;
    const level: AccessLevel = userId === staffId ? "staff" : "member";
    return { authed: true, accessLevel: level, userId };
  }
  return { authed: false, accessLevel: "no_access", userId: null };
}
