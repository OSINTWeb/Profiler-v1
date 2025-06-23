import { useState, useEffect, useRef, useCallback } from 'react';
import type { SearchData, SSEEvent, StreamingState } from '@/types/streaming';

interface UseStreamingDataProps {
  searchData: SearchData | null;
  maxRetries?: number;
}

interface UseStreamingDataReturn extends StreamingState {
  connectSSE: () => void;
  disconnectSSE: () => void;
  retryConnection: () => void;
}

export const useStreamingData = ({ 
  searchData, 
  maxRetries = 3 
}: UseStreamingDataProps): UseStreamingDataReturn => {
  const [state, setState] = useState<StreamingState>({
    searchData,
    loading: false,
    modules: [],
    currentIndex: 0,
    totalModules: 0,
    isStreaming: false,
    connectionStatus: "Completed",
    error: null,
  });

  const eventSourceRef = useRef<EventSource | null>(null);
  const retryCountRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const updateState = useCallback((updates: Partial<StreamingState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const disconnectSSE = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    updateState({
      isStreaming: false,
      connectionStatus: "Completed"
    });
  }, [updateState]);

  const connectSSE = useCallback((attempt: number = 0) => {
    if (!searchData?.query || !searchData?.type || !searchData?.PaidSearch) {
      updateState({ error: "Missing required search parameters" });
      return;
    }

    // Clean up any existing connection
    disconnectSSE();

    console.log(`Starting SSE stream (attempt ${attempt + 1}/${maxRetries + 1})`);
    
    updateState({
      isStreaming: true,
      connectionStatus: attempt > 0 ? "retrying" : "connecting",
      error: null,
      ...(attempt === 0 && { modules: [], currentIndex: 0 })
    });

    // Create SSE URL with search parameters
    const sseUrl = `/api/stream-data?${new URLSearchParams({
      query: searchData.query,
      type: searchData.type,
      PaidSearch: searchData.PaidSearch
    })}`;

    // Create new EventSource
    const eventSource = new EventSource(sseUrl);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log("SSE connection opened");
      retryCountRef.current = 0;
      updateState({ connectionStatus: "Loading Data" });
    };

    eventSource.onmessage = (event) => {
      try {
        const data: SSEEvent = JSON.parse(event.data);

        switch (data.type) {
          case "init":
            updateState({ totalModules: data.total || 0 });
            break;
            
          case "module":
            if (data.module) {
              setState(prev => {
                const newModules = [...prev.modules, data.module!];
                return {
                  ...prev,
                  modules: newModules,
                  currentIndex: newModules.length
                };
              });
            }
            break;
            
          case "complete":
            updateState({
              isStreaming: false,
              connectionStatus: "completed",
              ...(data.finalCount && { totalModules: data.finalCount })
            });
            disconnectSSE();
            break;
            
          case "error":
            updateState({
              isStreaming: false,
              connectionStatus: "error",
              error: data.message || "Unknown streaming error"
            });
            disconnectSSE();
            break;
        }
      } catch (error) {
        console.error("Error parsing SSE data:", error);
        updateState({
          error: "Failed to parse streaming data",
          connectionStatus: "error"
        });
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);
      disconnectSSE();
      
      if (attempt < maxRetries) {
        retryCountRef.current = attempt + 1;
        updateState({ connectionStatus: "retrying" });
        
        reconnectTimeoutRef.current = setTimeout(() => {
          connectSSE(attempt + 1);
        }, Math.min(2000 * Math.pow(2, attempt), 10000)); // Exponential backoff
      } else {
        updateState({
          connectionStatus: "failed",
          error: "Max retry attempts reached"
        });
      }
    };
  }, [searchData, maxRetries, disconnectSSE, updateState]);

  const retryConnection = useCallback(() => {
    retryCountRef.current = 0;
    connectSSE();
  }, [connectSSE]);

  // Auto-connect when searchData is available
  useEffect(() => {
    if (searchData?.query && searchData?.type && searchData?.PaidSearch) {
      connectSSE();
    }

    return disconnectSSE;
  }, [searchData, connectSSE, disconnectSSE]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnectSSE();
    };
  }, [disconnectSSE]);

  return {
    ...state,
    connectSSE,
    disconnectSSE,
    retryConnection,
  };
}; 