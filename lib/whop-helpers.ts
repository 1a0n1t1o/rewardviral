import { headers } from "next/headers";

export function getWhopUserId(): string | null {
  const h = headers();
  const uid = h.get("x-whop-user-id");
  return uid && uid !== "null" ? uid : null;
}
