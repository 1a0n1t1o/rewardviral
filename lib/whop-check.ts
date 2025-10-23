type Role = 'no_access' | 'member' | 'staff';

const WHOP_API_KEY = process.env.WHOP_API_KEY ?? null;
const WHOP_APP_ID = process.env.NEXT_PUBLIC_WHOP_APP_ID ?? null;
const WHOP_COMPANY_ID = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID ?? null;

if (!WHOP_API_KEY) {
  console.warn('[RBAC] Missing WHOP_API_KEY env var.');
}
if (!WHOP_APP_ID) {
  console.warn('[RBAC] Missing NEXT_PUBLIC_WHOP_APP_ID env var.');
}
if (!WHOP_COMPANY_ID) {
  console.warn('[RBAC] Missing NEXT_PUBLIC_WHOP_COMPANY_ID env var.');
}

async function whopGet(url: string) {
  if (!WHOP_API_KEY) {
    throw new Error('WHOP_API_KEY is not configured');
  }
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${WHOP_API_KEY}`,
      'Accept': 'application/json',
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Whop API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function resolveRoleFromWhop(userId: string): Promise<Role> {
  if (!WHOP_API_KEY || !WHOP_APP_ID || !WHOP_COMPANY_ID) {
    return 'no_access';
  }

  try {
    // TODO (1): Replace with the real Whop API endpoint that returns
    // whether this user is staff/agent in your company.
    // Example shape:
    // const staffResp = await whopGet(`${BASE}/companies/${WHOP_COMPANY_ID}/agents?user_id=${userId}`);
    // const isStaff = staffResp?.data?.some(a => a.user_id === userId);
    const isStaff = false; // <-- replace after wiring the real endpoint

    if (isStaff) return 'staff';

    // TODO (2): Replace with the real Whop API endpoint that answers:
    // "Does this user have an active entitlement (pass/plan) for this app?"
    // Example shape:
    // const ent = await whopGet(`${BASE}/apps/${WHOP_APP_ID}/entitlements?user_id=${userId}&status=active`);
    // const hasActive = ent?.data?.length > 0;
    const hasActive = false; // <-- replace after wiring the real endpoint

    return hasActive ? 'member' : 'no_access';
  } catch (e) {
    console.error('[RBAC] Whop check failed:', e);
    return 'no_access';
  }
}
