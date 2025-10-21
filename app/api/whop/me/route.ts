import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const headers = new Headers(req.headers);
  const whopUserId = headers.get("x-whop-user-id"); // present when app runs inside Whop
  const apiKey = process.env.WHOP_API_KEY ?? "";
  const devUserId = process.env.DEV_FAKE_USER_ID ?? "";
  const devUserName = process.env.DEV_FAKE_USER_NAME ?? "Dev User";

  // Choose a user id: prefer real header, else dev fallback
  const userId = whopUserId || devUserId;

  if (!userId) {
    // Not running inside Whop and no dev fallback set
    return NextResponse.json({ authed: false, user: null });
  }

  // If we have a Whop user header and API key, try fetching the real user name.
  if (whopUserId && apiKey) {
    try {
      const r = await fetch(`https://api.whop.com/v2/users/${userId}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
        cache: "no-store",
      });
      if (r.ok) {
        const user = await r.json();
        return NextResponse.json({
          authed: true,
          user: { id: userId, name: user?.name ?? user?.username ?? "Whop User" },
        });
      }
    } catch {}
  }

  // Fallback for local dev
  return NextResponse.json({
    authed: true,
    user: { id: userId, name: devUserName },
  });
}
