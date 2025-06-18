"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import InfoCardsContainer  from "@/components/AdvanceComponent/StatsCard";
import type { PlatformData } from "@/components/AdvanceComponent/StatsCard";

interface ModuleData {
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

interface SearchData {
  query: string;
  type: string;
  PaidSearch: string;
}

interface SSEEvent {
  type: 'init' | 'module' | 'complete' | 'error';
  total?: number;
  module?: ModuleData;
  index?: number;
  message?: string;
  query?: string;
  searchType?: string;
  paidSearch?: string;
}

// Mapping function from ModuleData to PlatformData
function mapModuleToPlatformData(module: ModuleData): PlatformData {
  // Try to get a pretty name from spec_format, fallback to module name
  let pretty_name = module.module;
  if (Array.isArray(module.spec_format) && module.spec_format.length > 0) {
    const firstSpec = module.spec_format[0] as { name?: { value?: string } };
    if (firstSpec && typeof firstSpec.name === "object" && firstSpec.name.value) {
      pretty_name = firstSpec.name.value;
    }
  }
  return {
    pretty_name,
    query: module.query,
    category: module.category,
    spec_format: module.spec_format as PlatformData["spec_format"],
    front_schemas: module.front_schemas as PlatformData["front_schemas"],
    status: module.status,
    module: module.module,
  };
}

export default function AdvanceResultPage() {
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState<ModuleData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalModules, setTotalModules] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('disconnected');
  const [retryCount, setRetryCount] = useState(0);
  const eventSourceRef = useRef<EventSource | null>(null);
  const maxRetries = 3;

  const connectSSE = useCallback((attempt: number = 0) => {
    if (attempt > 0) {
      setRetryCount(attempt);
      setConnectionStatus('retrying');
    }

    if (!searchData?.query || !searchData?.type || !searchData?.PaidSearch) {
      return;
    }

    console.log(`Starting SSE stream (attempt ${attempt + 1}) for searchData`, searchData);
    setIsStreaming(true);
    
    if (attempt === 0) {
      setModules([]);
      setCurrentIndex(0);
      setRetryCount(0);
    }
    
    setConnectionStatus('connecting');
    
    // Close any existing EventSource
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    
    // Create SSE URL with search parameters
    const sseUrl = `/api/stream-data?query=${encodeURIComponent(searchData.query)}&type=${encodeURIComponent(searchData.type)}&PaidSearch=${encodeURIComponent(searchData.PaidSearch)}`;
    
    // Create new EventSource
    const eventSource = new EventSource(sseUrl);
    eventSourceRef.current = eventSource;
    
    eventSource.onopen = () => {
      console.log('SSE connection opened');
      setConnectionStatus('connected');
      setRetryCount(0);
    };
    
    eventSource.onmessage = (event) => {
      try {
        const data: SSEEvent = JSON.parse(event.data);
        console.log('SSE event received:', data);
        
        switch (data.type) {
          case 'init':
            setTotalModules(data.total || 0);
            break;
            
          case 'module':
            if (data.module && typeof data.index === 'number') {
              setCurrentIndex(data.index + 1);
              setModules(prev => [...prev, data.module!]);
            }
            break;
            
          case 'complete':
            setIsStreaming(false);
            setConnectionStatus('completed');
            eventSource.close();
            break;
            
          case 'error':
            console.error('SSE error:', data.message);
            setIsStreaming(false);
            setConnectionStatus('error');
            eventSource.close();
            break;
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };
    
    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      setConnectionStatus('error');
      setIsStreaming(false);
      eventSource.close();
      
      // Retry logic
      if (attempt < maxRetries) {
        console.log(`Retrying SSE connection in 2 seconds... (attempt ${attempt + 2}/${maxRetries + 1})`);
        setTimeout(() => {
          connectSSE(attempt + 1);
        }, 2000);
      } else {
        console.error('Max retry attempts reached');
        setConnectionStatus('failed');
      }
    };
  }, [searchData, maxRetries]);

  useEffect(() => {
    if (searchData?.query && searchData?.type && searchData?.PaidSearch) {
      connectSSE();
    }
    
    // Cleanup function
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [searchData, connectSSE]);
  useEffect(() => {
    // First try to get data from localStorage (for POST method)
    const storedData = localStorage.getItem("searchData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setSearchData(parsedData);
        localStorage.removeItem("searchData"); // Clean up after use
        setLoading(false);
        return;
      } catch (error) {
        console.error("Error parsing stored data:", error);
      }
    }

    // Fallback to URL parameters (for GET method)
    const urlParams = new URLSearchParams(window.location.search);
    const data: SearchData = {
      query: urlParams.get("query") || "",
      type: urlParams.get("type") || "",
      PaidSearch: urlParams.get("PaidSearch") || "",
    };

    setSearchData(data);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <InfoCardsContainer data={modules.map(mapModuleToPlatformData)} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
          Advanced Search Results
        </h1>
        
        {/* Streaming Progress */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-teal-400">SSE Streaming Progress:</h2>
            <div className="text-white">
              {currentIndex} of {totalModules} modules loaded
              {isStreaming && <span className="ml-2 text-yellow-400 animate-pulse">Streaming...</span>}
            </div>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Connection Status:</span>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                connectionStatus === 'connected' ? 'bg-green-600 text-white' :
                connectionStatus === 'connecting' ? 'bg-yellow-600 text-white' :
                connectionStatus === 'retrying' ? 'bg-orange-600 text-white' :
                connectionStatus === 'completed' ? 'bg-blue-600 text-white' :
                connectionStatus === 'error' ? 'bg-red-600 text-white' :
                connectionStatus === 'failed' ? 'bg-red-800 text-white' :
                'bg-gray-600 text-white'
              }`}>
                {connectionStatus.toUpperCase()}
              </span>
              {retryCount > 0 && (
                <span className="text-xs text-orange-400">
                  (Retry {retryCount}/{maxRetries})
                </span>
              )}
            </div>
          </div>
          <div className="bg-gray-800 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-teal-400 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: totalModules > 0 ? `${(currentIndex / totalModules) * 100}%` : '0%' }}
            ></div>
          </div>
        </div>

        {/* Live Module Display */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8 max-h-96 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4 text-teal-400">Live SSE Module Feed:</h2>
          <div className="space-y-3">
            {modules.map((module, index) => (
              <div 
                key={index} 
                className="bg-gray-800 p-4 rounded-md border-l-4 border-teal-400 animate-pulse hover:animate-none transition-all duration-300 transform hover:scale-105"
                style={{
                  animation: `slideInFromRight 0.5s ease-out ${index * 0.1}s both`
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-bold">{module.module}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    module.status === 'found' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                  }`}>
                    {module.status}
                  </span>
                </div>
                <div className="text-gray-300 text-sm">
                  <span className="text-teal-300">{module.category.name}</span> - {module.category.description}
                </div>
                {Object.keys(module.data).length > 0 && (
                  <div className="text-xs text-gray-400 mt-2">
                    Data found: {Object.keys(module.data).length} fields
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-teal-400">Received Search Parameters:</h2>
          <div className="space-y-3">
            <div className="bg-gray-800 p-4 rounded-md">
              <span className="text-gray-400 font-medium">Query:</span>
              <span className="ml-3 text-white font-mono bg-gray-700 px-2 py-1 rounded">
                {searchData?.query || "No query provided"}
              </span>
            </div>
            <div className="bg-gray-800 p-4 rounded-md">
              <span className="text-gray-400 font-medium">Search Type:</span>
              <span className="ml-3 text-white font-mono bg-gray-700 px-2 py-1 rounded">
                {searchData?.type || "No type provided"}
              </span>
            </div>
            <div className="bg-gray-800 p-4 rounded-md">
              <span className="text-gray-400 font-medium">Paid Search:</span>
              <span className="ml-3 text-white font-mono bg-gray-700 px-2 py-1 rounded">
                {searchData?.PaidSearch || "No paid search type provided"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-teal-400">Raw Data (JSON):</h2>
          <pre className="bg-gray-800 p-4 rounded-md text-green-400 font-mono text-sm overflow-x-auto">
            {JSON.stringify(searchData, null, 2)}
          </pre>
        </div>

        <div className="mt-8 text-center space-x-4">
          {(connectionStatus === 'failed' || connectionStatus === 'error') && (
            <button
              onClick={() => connectSSE()}
              className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-lg hover:from-orange-500 hover:to-red-500 transition-all duration-300"
            >
              Reconnect SSE
            </button>
          )}
          <button
            onClick={() => window.close()}
            className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-6 py-3 rounded-lg hover:from-gray-600 hover:to-gray-800 transition-all duration-300"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
