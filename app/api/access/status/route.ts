import { NextResponse } from "next/server";

export async function GET() {
  // Simulate Whop or database role fetching
  // Replace this later with a real API call to Whop
  const mockUserId = "user_mJXk8QGq2OxVL"; // Example
  const staffUsers = ["user_mJXk8QGq2OxVL"]; // Your staff user IDs

  const role = staffUsers.includes(mockUserId) ? "staff" : "member";

  return NextResponse.json({
    authed: true,
    role,
  });
}