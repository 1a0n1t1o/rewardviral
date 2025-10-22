"use client";
import React, { useEffect, useState } from "react";
import GetAccessButton from "./GetAccessButton";
import { useWhopUserToken } from "@/lib/get-user-token";

type Status = { authed: boolean; hasAccess: boolean; userId?: string; warn?: string; error?: string };

export default function CheckAccessClient() {
  const [status, setStatus] = useState<Status>();
  const userToken = useWhopUserToken();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // If we have a user token from the iframe, include it as Authorization header.
      // Otherwise, try without (proxy mode).
      try {
        const res = await fetch("/api/access/status", {
          cache: "no-store",
          headers: userToken ? { Authorization: `Bearer ${userToken}` } : undefined,
        });
        const json: Status = await res.json();
        if (!cancelled) setStatus(json);
      } catch {
        if (!cancelled) setStatus({ authed: false, hasAccess: false, error: "Network error" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userToken]);

  if (!status) return <div>Loading…</div>;

  if (!status.authed) {
    return (
      <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8 }}>
        <div style={{ color: "crimson", marginBottom: 8 }}>
          {status.error
            ? `Auth error: ${status.error}`
            : "Not authenticated. If you're inside Whop, give it a second to initialize."}
        </div>
        <div>Tip: If you're outside Whop, open the app from your Whop dashboard.</div>
      </div>
    );
  }

  if (!status.hasAccess) {
    return (
      <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8 }}>
        <div style={{ marginBottom: 8 }}>You don't have access yet.</div>
        <GetAccessButton />
      </div>
    );
  }

  return (
    <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8 }}>
      <div style={{ marginBottom: 8 }}>
        <strong>Access OK.</strong> Welcome!
      </div>
      <div style={{ fontSize: 12, opacity: 0.7 }}>User: {status.userId}</div>
    </div>
  );
}
