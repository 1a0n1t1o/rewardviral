type Role = "staff" | "member" | "no_access";

/**
 * Comma-separated user ids in env:
 *  - STAFF_IDS:   user_a,user_b
 *  - MEMBER_IDS:  user_c,user_d
 *
 * Minimal, deterministic RBAC.
 */
function parseList(envVal: string | undefined): Set<string> {
  if (!envVal) return new Set();
  return new Set(
    envVal
      .split(",")
      .map(s => s.trim())
      .filter(Boolean)
  );
}

const staffSet = parseList(process.env.STAFF_IDS);
const memberSet = parseList(process.env.MEMBER_IDS);

export function roleForUser(userId: string | null): Role {
  if (!userId) return "no_access";
  if (staffSet.has(userId)) return "staff";
  if (memberSet.has(userId)) return "member";
  return "no_access";
}
