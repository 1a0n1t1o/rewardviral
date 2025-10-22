import { NextResponse } from "next/server";

// Simple RBAC baseline (replace with real logic later)
export async function GET() {
  // Replace with real Whop ID or auth lookup later
  const mockUserId = "user_mJXk8QGq2OxVL";
  const staffUsers = ["user_mJXk8QGq2OxVL"];

  const role = staffUsers.includes(mockUserId) ? "staff" : "member";

  return NextResponse.json({
    authed: true,
    role,
  });
}