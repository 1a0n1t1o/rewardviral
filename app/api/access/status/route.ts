import { getWhopUserId } from "@/lib/whop-helpers";
import { WhopServerSdk } from "@whop/sdk";

const whop = new WhopServerSdk({ apiKey: process.env.WHOP_API_KEY! });

export async function GET() {
  try {
    const userId = await getWhopUserId().catch(() => null);
    if (!userId) {
      return Response.json({ authed: false, hasAccess: false });
    }

    const result = await whop.accesses.listForUser({ userId });
    const access = result?.data?.[0];

    if (!access) {
      return Response.json({ authed: true, hasAccess: false });
    }

    // Identify access level from Whop role or metadata
    const accessLevel = access.role?.toLowerCase() ?? "member";

    const isStaff = accessLevel.includes("staff");
    const isMember = accessLevel.includes("member");

    return Response.json({
      authed: true,
      hasAccess: isStaff || isMember,
      accessLevel: isStaff ? "staff" : "member",
    });
  } catch (err) {
    console.error("Access check failed:", err);
    return Response.json({ authed: false, hasAccess: false });
  }
}