import { headers } from "next/headers";
import { WhopServerSdk } from "@whop/api";

// Server-side SDK (requires API key)
// NOTE: WhopServerSdk is a factory function, not a class → do NOT use `new`.
export const whopSdk = WhopServerSdk({ apiKey: process.env.WHOP_API_KEY! });

/**
 * Attempt to resolve the current user id. Works in both modes:
 *  - Proxy mode (apps.whop.com injects x-whop-* headers)
 *  - Direct iframe mode (client sends Authorization: Bearer <userToken>)
 */
export async function getWhopUserIdFromAnySource(reqHeaders?: Headers): Promise<string | null> {
  const h = reqHeaders ?? (await headers());

  // 1) Try proxy-injected headers first (this path works when using Whop proxy)
  try {
    const { userId } = await whopSdk.verifyUserToken(h);
    if (userId) return userId;
  } catch {
    // fall through
  }

  // 2) Fallback: try Authorization: Bearer <token>
  try {
    const auth = h.get("authorization") || "";
    const token = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7) : null;
    if (token) {
      const { userId } = await whopSdk.verifyUserToken({ "x-whop-user-token": token } as any);
      return userId ?? null;
    }
  } catch {
    // ignore
  }

  return null;
}

export default null;
