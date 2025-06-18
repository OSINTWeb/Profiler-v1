import { NextRequest } from 'next/server';
import data from "../../../../public/Data/export_test@gmail.com.json";

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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  const type = searchParams.get('type') || '';
  const paidSearch = searchParams.get('PaidSearch') || '';

  console.log("SSE Stream started for:", { query, type, paidSearch });

  // Create a readable stream
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const modules = data as ModuleData[];

      try {
        // Send initial event with total count
        const initEvent = `data: ${JSON.stringify({
          type: 'init',
          total: modules.length,
          query,
          searchType: type,
          paidSearch
        })}\n\n`;
        controller.enqueue(encoder.encode(initEvent));

        // Stream each module with delay
        for (let i = 0; i < modules.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay

          const moduleEvent = `data: ${JSON.stringify({
            type: 'module',
            module: modules[i],
            index: i,
            total: modules.length
          })}\n\n`;
          
          controller.enqueue(encoder.encode(moduleEvent));
        }

        // Send completion event
        const completeEvent = `data: ${JSON.stringify({
          type: 'complete',
          message: 'All modules streamed successfully'
        })}\n\n`;
        controller.enqueue(encoder.encode(completeEvent));

      } catch (error) {
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