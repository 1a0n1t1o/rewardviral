type Role = 'no_access' | 'member' | 'staff';

type Entry = {
  role: Role;
  expiresAt: number;
};

const CACHE = new Map<string, Entry>();
const TTL_MS = 10 * 60 * 1000; // 10 minutes

export function getCachedRole(userId: string): Role | null {
  const now = Date.now();
  const hit = CACHE.get(userId);
  if (!hit) return null;
  if (hit.expiresAt <= now) {
    CACHE.delete(userId);
    return null;
  }
  return hit.role;
}

export function setCachedRole(userId: string, role: Role) {
  CACHE.set(userId, { role, expiresAt: Date.now() + TTL_MS });
}
