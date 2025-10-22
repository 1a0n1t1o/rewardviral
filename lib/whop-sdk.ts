import { WhopSDK } from "@whop/api";
import { headers as nextHeaders } from "next/headers";

export const whopSdk = new WhopSDK({
  apiKey: process.env.WHOP_API_KEY!, // server-side only
});

/** Resolve current Whop userId from request headers (must be opened from Whop). */
export async function getWhopUserId() {
  const h = await nextHeaders();
  const { userId } = await whopSdk.verifyUserToken(h);
  return userId; // string
}
