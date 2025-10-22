// lib/rbac.ts
export type AccessLevel = 'no_access' | 'member' | 'staff' | 'admin' | string;

const DEFAULT_STAFF_LEVELS = ['admin', 'staff'];

export function isStaffLevel(level?: AccessLevel, staffLevels: string[] = DEFAULT_STAFF_LEVELS) {
  if (!level) return false;
  const norm = String(level).toLowerCase();
  return staffLevels.includes(norm);
}
