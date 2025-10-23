import { getHeaders } from '@/lib/getHeaders';

function decodeSubFromJWT(jwt?: string | null): string | null {
  if (!jwt) return null;
  const parts = jwt.split('.');
  if (parts.length < 2) return null;
  try {
    const payloadJson = Buffer.from(
      parts[1].replace(/-/g, '+').replace(/_/g, '/'),
      'base64'
    ).toString('utf8');
    const payload = JSON.parse(payloadJson);
    return typeof payload.sub === 'string' ? payload.sub : null;
  } catch {
    return null;
  }
}

export async function getCurrentUserId(): Promise<string | null> {
  const h = await getHeaders();
  // Prefer explicit header if Whop injects it
  const fromHeader = h.get('x-whop-user-id');
  if (fromHeader) return fromHeader;

  // Otherwise decode the userId from the Whop user token
  const token = h.get('x-whop-user-token');
  const fromToken = decodeSubFromJWT(token);
  return fromToken ?? null;
}
