import { auth0 } from "@/lib/auth0";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json({ error: "No session found" }, { status: 401 });
    }

    // The ID token should be available in the session
    const TokenSet = session.tokenSet;
    const idToken = TokenSet.idToken;
    const response = await fetch("https://profiler-api-production.up.railway.app/api/login", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
    });
    const user = await response.json();
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error getting ID token:", error);
    return NextResponse.json({ error: "Failed to get ID token" }, { status: 500 });
  }
}
