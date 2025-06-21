import { NextRequest } from 'next/server';
import data from "public/Data/export_test@gmail.com.json";

/**
 * Real-World API Streaming Handler
 * 
 * This endpoint handles various real-world API streaming patterns:
 * 1. NDJSON Streaming: APIs that send newline-delimited JSON as data becomes available
 * 2. Batch APIs: APIs that return all data at once
 * 3. Polling APIs: APIs that require periodic polling for new data
 * 
 * The client-side code automatically handles progress tracking without requiring:
 * - Server-provided indices
 * - Pre-known total counts
 * - Artificial delays
 * 
 * Real APIs naturally stream data at their own pace - no delays needed!
 */

export interface ModuleData {
  module: string;
  category: {
    name: string;
    description: string;
  };
  data: Record<string, unknown>;
  front_schemas: Record<string, unknown>[];
  spec_format: Record<string, unknown>[];
  status: string;
  query: string;
  from: string;
  reliable_source: boolean;
}

// Example function for real API integration
async function* fetchDataFromRealAPI(query: string, type: string, paidSearch: string) {
  // This is where you'd integrate with your real API
  // The real API will naturally stream data module by module
  
  /*
  // Example 1: Real API that streams NDJSON (Newline Delimited JSON)
  const apiUrl = `https://your-api.com/search`;
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query,
      search_type: type,
      paid_search: paidSearch === 'true'
    })
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  // Real API streams data naturally - no artificial delays needed
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  
  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      // Accumulate chunks and parse complete JSON lines
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete line in buffer
      
      for (const line of lines) {
        if (line.trim()) {
          try {
            const moduleData = JSON.parse(line);
            yield moduleData as ModuleData;
          } catch (e) {
            console.warn('Invalid JSON line:', line);
          }
        }
      }
    }
    
    // Process any remaining data in buffer
    if (buffer.trim()) {
      try {
        const moduleData = JSON.parse(buffer);
        yield moduleData as ModuleData;
      } catch (e) {
        console.warn('Invalid JSON in buffer:', buffer);
      }
    }
  }

  // Example 2: API that returns all data at once (batch)
  // const allData = await response.json();
  // for (const moduleData of allData.results) {
  //   yield moduleData as ModuleData;
  // }

  // Example 3: API with polling mechanism
  // let hasMore = true;
  // let cursor = null;
  // while (hasMore) {
  //   const pollResponse = await fetch(`${apiUrl}/poll?cursor=${cursor}`);
  //   const batch = await pollResponse.json();
  //   for (const moduleData of batch.results) {
  //     yield moduleData as ModuleData;
  //   }
  //   hasMore = batch.has_more;
  //   cursor = batch.next_cursor;
  //   if (hasMore) await new Promise(resolve => setTimeout(resolve, 1000)); // Wait between polls
  // }
  */

  // For now, simulate real API streaming behavior (no artificial delays)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _unusedParams = { query, type, paidSearch }; // Will be used in real implementation
  const modules = data as ModuleData[];
  
  // In reality, your API will send these one by one as they become available
  // No delays needed - just yield as data comes in
  for (const moduleItem of modules) {
    await new Promise(resolve => setTimeout(resolve, 200));
    // Real API: yield moduleItem as soon as it's received from the API
    yield moduleItem;
  }
}

// Global counter to track API calls
let apiCallCounter = 0;

export async function GET(request: NextRequest) {
  // Increment and log API call count
  apiCallCounter++;
  
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  const type = searchParams.get('type') || '';
  const paidSearch = searchParams.get('PaidSearch') || '';

  console.log(`🚀 API CALL #${apiCallCounter} - SSE Stream started`);
  console.log("📊 Call Details:", { 
    callNumber: apiCallCounter,
    timestamp: new Date().toISOString(),
    query, 
    type, 
    paidSearch,
    userAgent: request.headers.get('user-agent'),
    ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  });

  // Track start time for performance monitoring
  const startTime = Date.now();

  // Create a readable stream
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      try {
        // Send initial event
        // Note: With real APIs, you typically don't know total count upfront
        const initEvent = `data: ${JSON.stringify({
          type: 'init',
          // total: undefined, // Real APIs usually don't provide total count
          query,
          searchType: type,
          paidSearch
        })}\n\n`;
        controller.enqueue(encoder.encode(initEvent));

        // Stream data from real API (or mock data for now)
        // Real API will naturally send modules one by one as they become available
        // No artificial delays needed - data flows at the API's natural pace
        let moduleCount = 0;
        for await (const moduleItem of fetchDataFromRealAPI(query, type, paidSearch)) {
          moduleCount++;
          
          // Log progress every 10 modules to avoid spam
          // if (moduleCount % 10 === 0) {
          //   console.log(`📦 API CALL #${apiCallCounter} - Streamed ${moduleCount} modules so far`);
          // }
          
          const moduleEvent = `data: ${JSON.stringify({
            type: 'module',
            module: moduleItem,
            // No index provided - client will track this
            // Real APIs typically don't provide indices or total counts
          })}\n\n`;
          
          controller.enqueue(encoder.encode(moduleEvent));
        }

        // Send completion event with final count
        const completeEvent = `data: ${JSON.stringify({
          type: 'complete',
          message: 'All modules streamed successfully',
          finalCount: moduleCount // Optional: provide final count when streaming is complete
        })}\n\n`;
        controller.enqueue(encoder.encode(completeEvent));

        console.log(`✅ API CALL #${apiCallCounter} - Completed successfully`);
        console.log(`📈 Stream Stats:`, {
          callNumber: apiCallCounter,
          modulesStreamed: moduleCount,
          duration: Date.now() - startTime,
          query,
          type
        });

      } catch (error) {
        console.error(`❌ API CALL #${apiCallCounter} - Failed with error:`, error);
        console.error('📊 Error Details:', {
          callNumber: apiCallCounter,
          error: error instanceof Error ? error.message : 'Unknown error',
          duration: Date.now() - startTime,
          query,
          type
        });
        
        // Send error event
        const errorEvent = `data: ${JSON.stringify({
          type: 'error',
          message: error instanceof Error ? error.message : 'Unknown error occurred'
        })}\n\n`;
        controller.enqueue(encoder.encode(errorEvent));
      } finally {
        controller.close();
      }
    },
  });

  // Return response with SSE headers
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  });
} 