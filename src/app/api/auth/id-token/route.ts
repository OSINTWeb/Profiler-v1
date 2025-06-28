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
    const AccessToken = TokenSet.accessToken;
    console.log("ID token (JWT) retrieved:", idToken);
    if (!idToken) {
      return NextResponse.json({ error: "No ID token found in session" }, { status: 404 });
    }

    return NextResponse.json({
      idToken: idToken,
      AccessToken: AccessToken,
    });
  } catch (error) {
    console.error("Error getting ID token:", error);
    return NextResponse.json({ error: "Failed to get ID token" }, { status: 500 });
  }
}
