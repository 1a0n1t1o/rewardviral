import { WhopServerSdk } from "@whop/api";
import { headers as nextHeaders } from "next/headers";

// Pass the API key as a single constructor argument (correct signature)
export const whopSdk = new WhopServerSdk(process.env.WHOP_API_KEY!);

/** Resolve current Whop userId from request headers (must be opened from Whop). */
export async function getWhopUserId() {
  const h = await nextHeaders();
  const { userId } = await whopSdk.verifyUserToken(h);
  return userId;
}
