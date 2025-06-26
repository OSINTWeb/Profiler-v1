import { NextRequest, NextResponse } from "next/server";

// Tool endpoints using HTTPS for secure connections
const TOOL_ENDPOINTS: { [key: string]: string } = {
  Gravaton: "https://profilerfreeapi.profiler.me/free/gravatar",
  Linkook: "https://profilerfreeapi.profiler.me/free/linkook",
  "Proton Intelligence": "https://profilerfreeapi.profiler.me/free/protonmail",
  "Breach Guard": "https://profilerfreeapi.profiler.me/free/databreach",
  "Info-Stealer Lookup": "https://profilerfreeapi.profiler.me/free/infostealer",
  TiktokerFinder: "https://profilerfreeapi.profiler.me/free/tiktok",
};

// Simple parameter mapping
const getQueryParam = (tool: string, query: string) => {
  if (tool === "Info-Stealer Lookup") {
    return query.includes("@") ? "email" : "username";
  }
  if (tool === "Gravaton" || tool === "Proton Intelligence" || tool === "Breach Guard") {
    return "email";
  }
  return "username"; // For Linkook and TiktokerFinder
};

// Get endpoint URL
const getEndpoint = (tool: string, query: string) => {
  if (tool === "Info-Stealer Lookup") {
    const isEmail = query.includes("@");
    return `${TOOL_ENDPOINTS[tool]}/${isEmail ? "email" : "username"}`;
  }
  return TOOL_ENDPOINTS[tool];
};

export async function GET(request: NextRequest) {
  // Add immediate logging to see if the route is being hit
  console.log("🚀 API Route: free-tools-proxy GET handler started");
  console.log("🔍 API Route: Proxy request received at", new Date().toISOString());
  
  try {
    const { searchParams } = new URL(request.url);
    const tool = searchParams.get("tool");
    const query = searchParams.get("query");
    
    console.log("📝 API Route: Parsed parameters:", { tool, query });
    
    // Validate required parameters
    if (!tool || !query) {
      console.error("❌ API Route: Missing required parameters");
      return NextResponse.json(
        { error: 'Missing required parameters: tool and query' },
        { status: 400 }
      );
    }

    // Validate tool
    if (!TOOL_ENDPOINTS[tool]) {
      console.error(`❌ API Route: Invalid tool: ${tool}`);
      console.error(`❌ API Route: Available tools:`, Object.keys(TOOL_ENDPOINTS));
      return NextResponse.json(
        { error: `Invalid tool: ${tool}` },
        { status: 400 }
      );
    }

    const endpoint = getEndpoint(tool, query);
    const queryParam = getQueryParam(tool, query);
    const fullUrl = `${endpoint}?${queryParam}=${encodeURIComponent(query)}`;

    console.log(`🔍 API Route: Processing request for ${tool} with query: ${query}`);
    console.log(`📡 API Route: Full external URL: ${fullUrl}`);
    console.log(`🔑 API Route: Using API key: hwCMDBcVGu`);

    // Create custom fetch options to handle SSL certificate issues
    const fetchOptions: RequestInit = {
      method: "GET",
      headers: {
        "x-api-key": "hwCMDBcVGu",
        "Content-Type": "application/json",
        "User-Agent": "Profiler-V1-Proxy/1.0"
      },
    };

    // For Node.js environment, we need to handle the SSL certificate issue
    if (typeof globalThis !== 'undefined' && 'process' in globalThis) {
      // We're in a Node.js environment (server-side)
      console.log("🔧 API Route: Detected Node.js environment, handling SSL certificate issue");
      
      // Set NODE_TLS_REJECT_UNAUTHORIZED temporarily for this request
      const originalRejectUnauthorized = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
      
      try {
        // Make the request to the external API
        console.log("🌐 API Route: Making fetch request with SSL bypass...");
        const response = await fetch(fullUrl, fetchOptions);

        console.log(`📊 API Route: External API Response: ${response.status} ${response.statusText}`);
        console.log(`📊 API Route: Response headers:`, Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`❌ API Route: External API Error: ${response.status} - ${errorText}`);
          
          return NextResponse.json(
            { 
              error: `External API error: ${response.status} ${response.statusText}`,
              details: errorText 
            },
            { status: response.status }
          );
        }

        // Parse response based on content type
        const contentType = response.headers.get("content-type");
        console.log(`📄 API Route: Content-Type: ${contentType}`);
        
        let data;

        if (contentType?.includes("application/json")) {
          data = await response.json();
          console.log(`📦 API Route: Parsed JSON data:`, data);
        } else {
          data = await response.text();
          console.log(`📦 API Route: Raw text data length:`, data.length);
        }

        console.log(`✅ API Route: Successfully proxied data for ${tool}`);

        // Return the data with CORS headers
        return NextResponse.json(
          {
            tool,
            query,
            data,
            timestamp: Date.now(),
          },
          {
            status: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
          }
        );
        
      } finally {
        // Restore the original NODE_TLS_REJECT_UNAUTHORIZED setting
        if (originalRejectUnauthorized !== undefined) {
          process.env.NODE_TLS_REJECT_UNAUTHORIZED = originalRejectUnauthorized;
        } else {
          delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
        }
        console.log("🔧 API Route: SSL settings restored");
      }
    } else {
      // Fallback for other environments
      console.log("🌐 API Route: Making standard fetch request...");
      const response = await fetch(fullUrl, fetchOptions);
      
      console.log(`📊 API Route: External API Response: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Route: External API Error: ${response.status} - ${errorText}`);
        
        return NextResponse.json(
          { 
            error: `External API error: ${response.status} ${response.statusText}`,
            details: errorText 
          },
          { status: response.status }
        );
      }

      const contentType = response.headers.get("content-type");
      let data;

      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      return NextResponse.json(
        {
          tool,
          query,
          data,
          timestamp: Date.now(),
        },
        {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        }
      );
    }

  } catch (error) {
    console.error('❌ API Route: Proxy error:', error);
    console.error('❌ API Route: Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
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
