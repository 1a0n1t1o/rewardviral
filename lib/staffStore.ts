import { kv } from '@vercel/kv';

const CLAIM_PREFIX = 'staff:claim:'; // staff:claim:<userId> -> { groupId, ts }

export type StaffClaim = {
  groupId: string;
  ts: number;
};

export async function getStaffClaim(userId: string): Promise<StaffClaim | null> {
  if (!userId) return null;
  const data = await kv.get<StaffClaim>(CLAIM_PREFIX + userId);
  return data ?? null;
}

export async function setStaffClaim(userId: string, groupId: string) {
  const payload: StaffClaim = { groupId, ts: Date.now() };
  await kv.set(CLAIM_PREFIX + userId, payload);
}
