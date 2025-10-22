import { WhopSDK } from "@whop/sdk";

const apiKey = process.env.WHOP_API_KEY;
if (!apiKey) throw new Error("Missing WHOP_API_KEY");

export const whop = new WhopSDK({ apiKey });
