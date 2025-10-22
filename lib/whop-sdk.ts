import { headers as nextHeaders } from "next/headers";

/**
 * Compatibility wrapper for @whop/api across versions.
 * Some versions export a class (WhopSDK/WhopServerSdk) with { apiKey } or (apiKey),
 * others export a factory (createWhopServerSdk). We try them in order and memoize.
 * Typed as `any` intentionally to avoid breaking on type shape changes.
 */
let _sdk: any | null = null;

function initWhopSdk(): any {
  if (_sdk) return _sdk;

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod: any = require("@whop/api");

  // Try common exports by priority:
  const candidates = [
    mod.WhopSDK,
    mod.WhopServerSdk,
    mod.default,
    mod.createWhopServerSdk,
  ].filter(Boolean);

  const apiKey = process.env.WHOP_API_KEY;

  for (const C of candidates) {
    try {
      // Try constructor with options object
      if (typeof C === "function") {
        try {
          _sdk = new C({ apiKey });
          return _sdk;
        } catch {}
        // Try constructor with single string arg
        try {
          _sdk = new C(apiKey);
          return _sdk;
        } catch {}
      }
      // Try factory style with options object
      if (typeof C === "function") {
        try {
          _sdk = C({ apiKey });
          if (_sdk) return _sdk;
        } catch {}
      }
    } catch {
      // ignore and continue
    }
  }

  throw new Error(
    "Unable to initialize Whop SDK. Check @whop/api version and WHOP_API_KEY."
  );
}

/** Export a proxy so callers can do `whopSdk.xyz()` regardless of init shape. */
export const whopSdk: any = new Proxy(
  {},
  {
    get(_target, prop) {
      const s = initWhopSdk();
      return s[prop as keyof typeof s];
    },
  }
);

/** Resolve current Whop userId from request headers (must be opened from Whop). */
export async function getWhopUserId(): Promise<string> {
  const h = await nextHeaders();
  // Prefer verified token if available; otherwise fall back to header.
  try {
    const { userId } = await whopSdk.verifyUserToken(h);
    if (userId) return userId as string;
  } catch {
    // fall through to raw header
  }
  const raw = h.get("x-whop-user-id");
  if (!raw) throw new Error("Whop user header missing");
  return raw;
}
