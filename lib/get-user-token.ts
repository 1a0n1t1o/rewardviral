"use client";
import { useEffect, useState } from "react";
import { useIframeSdk } from "@whop/react";

/**
 * Attempts to fetch a short-lived user token from the Whop iframe SDK.
 * Returns null when not running inside Whop or if SDK is not available.
 */
export function useWhopUserToken() {
  const iframeSdk = useIframeSdk();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!iframeSdk) return;
        // Different SDK versions expose either getUser() or getToken(). Try both.
        const u = (await (iframeSdk as any).getUser?.()) || null;
        const t = (await (iframeSdk as any).getToken?.()) || (u?.token ?? null);
        if (!cancelled) setToken(t ?? null);
      } catch {
        if (!cancelled) setToken(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [iframeSdk]);

  return token;
}
