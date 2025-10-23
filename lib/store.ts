type RoleRecord = {
  role: 'member' | 'staff';
  groupId?: string;
};

type ClaimCodeConfig = { code: string; maxUses?: number };
type ClaimCodes = Record<string, ClaimCodeConfig>; // key = groupId

const inMemoryRoles = new Map<string, RoleRecord>();
const inMemoryCounters = new Map<string, number>();

function claimCodes(): ClaimCodes {
  try {
    return JSON.parse(process.env.CLAIM_CODES ?? '{}');
  } catch {
    return {};
  }
}

async function kvGet(key: string): Promise<string | null> {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  const res = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store'
  });
  if (!res.ok) return null;
  const data = await res.json().catch(() => null);
  return (data && typeof data.result === 'string') ? data.result : null;
}

async function kvSet(key: string, value: string) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return;
  await fetch(`${url}/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({ value })
  }).catch(() => {});
}

const ROLES_PREFIX = 'roles:';
const CODECOUNT_PREFIX = 'codecount:';

export async function getRole(userId: string): Promise<RoleRecord> {
  const url = process.env.KV_REST_API_URL;
  if (!url) {
    return inMemoryRoles.get(userId) ?? { role: 'member' };
  }
  const raw = await kvGet(ROLES_PREFIX + userId);
  if (!raw) return { role: 'member' };
  try { return JSON.parse(raw) as RoleRecord; } catch { return { role: 'member' }; }
}

export async function setRole(userId: string, rec: RoleRecord): Promise<void> {
  const url = process.env.KV_REST_API_URL;
  if (!url) {
    inMemoryRoles.set(userId, rec);
    return;
  }
  await kvSet(ROLES_PREFIX + userId, JSON.stringify(rec));
}

async function getCodeCount(code: string): Promise<number> {
  const url = process.env.KV_REST_API_URL;
  if (!url) return inMemoryCounters.get(code) ?? 0;
  const raw = await kvGet(CODECOUNT_PREFIX + code);
  return raw ? Number(raw) || 0 : 0;
}

async function setCodeCount(code: string, n: number): Promise<void> {
  const url = process.env.KV_REST_API_URL;
  if (!url) {
    inMemoryCounters.set(code, n);
    return;
  }
  await kvSet(CODECOUNT_PREFIX + code, String(n));
}

export async function claimStaffCode(userId: string, submittedCode: string): Promise<{ ok: true; groupId: string } | { ok: false; error: string }> {
  const codes = claimCodes();

  const entry = Object.entries(codes).find(([, cfg]) => cfg.code === submittedCode);
  if (!entry) return { ok: false, error: 'Invalid code' };

  const [groupId, cfg] = entry;
  const current = await getCodeCount(submittedCode);
  const max = cfg.maxUses ?? 1000000;
  if (current >= max) return { ok: false, error: 'Code usage limit reached' };

  await setRole(userId, { role: 'staff', groupId });
  await setCodeCount(submittedCode, current + 1);

  return { ok: true, groupId };
}
