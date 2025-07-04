import { NextRequest, NextResponse } from "next/server";

// Tool endpoints using HTTPS for secure connections
const TOOL_ENDPOINTS: { [key: string]: string } = {
  Mail2Linkedin: "https://profiler-api-production.up.railway.app/api/tools/mail2linkedin",
  EmailIntel: "https://profiler-api-production.up.railway.app/api/tools/emailintel",
};

export async function GET(request: NextRequest) {
  console.log("🚀 API Route: FreeMiumTools GET handler started");
  console.log("🔍 API Route: Proxy request received at", new Date().toISOString());

  try {
    const tool = request.nextUrl.searchParams.get("tool");
    const query = request.nextUrl.searchParams.get("query");
    const authToken = request.nextUrl.searchParams.get("authToken");
    console.log("📝 API Route: Parsed parameters:", { tool, query, authToken });

    // Validate required parameters
    if (!tool || !query) {
      console.error("❌ API Route: Missing required parameters", { tool: !!tool, query: !!query });
      return NextResponse.json(
        { 
          error: "Missing required parameters", 
          details: "Both 'tool' and 'query' parameters are required",
          received: { tool: !!tool, query: !!query }
        },
        { status: 400 }
      );
    }

    // Validate query format based on tool
    if ((tool === "Mail2Linkedin" || tool === "EmailIntel") && !query.includes("@")) {
      console.error("❌ API Route: Invalid email format");
      return NextResponse.json(
        { 
          error: "Invalid email format", 
          details: `Tool '${tool}' requires a valid email address`,
          received: query
        },
        { status: 400 }
      );
    }

    // Validate tool
    if (!TOOL_ENDPOINTS[tool]) {
      console.error(`❌ API Route: Invalid tool: ${tool}`);
      console.error(`❌ API Route: Available tools:`, Object.keys(TOOL_ENDPOINTS));
      return NextResponse.json({ error: `Invalid tool: ${tool}` }, { status: 400 });
    }

    // Get ID token for authentication

    // Get the endpoint for the requested tool
    const endpoint = TOOL_ENDPOINTS[tool];
    
    // Prepare request body based on tool type
    let requestBody: { email?: string } = {};
    if (tool === "Mail2Linkedin" || tool === "EmailIntel") {
      requestBody = { email: query };
    }

    console.log("🌐 API Route: Making request to:", endpoint);
    console.log("📦 API Route: Request body:", requestBody);

    // Make request to the external API
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log("📡 API Route: External API response status:", response.status);
    console.log("📡 API Route: Response headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let errorDetails = "Unknown error";
      try {
        const errorData = await response.json();
        errorDetails = errorData.error || errorData.message || "API request failed";
      } catch {
        errorDetails = await response.text() || `HTTP ${response.status}: ${response.statusText}`;
      }
      
      console.error("❌ API Route: External API error:", errorDetails);
      return NextResponse.json(
        { 
          error: "External API request failed", 
          details: errorDetails,
          status: response.status 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("✅ API Route: External API response received",data);

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("❌ API Route: Proxy error:", error);
    console.error(
      "❌ API Route: Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  console.log("🚀 API Route: OPTIONS request received");
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
