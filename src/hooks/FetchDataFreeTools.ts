import { useState, useCallback } from 'react';

export interface ApiResult {
  tool: string;
  query: string;
  data: unknown;
  error?: string;
  loading: boolean;
  timestamp: number;
}

export interface ToolEndpoints {
  [key: string]: string;
}

// Map tool names to their API endpoints
const TOOL_ENDPOINTS: ToolEndpoints = {
  "Gravaton": "/api/gravaton",
  "Linkook": "/api/linkook", 
  "Proton Intelligence": "/api/proton-intel",
  "Breach Guard": "/api/breach-guard",
  "Info-Stealer Lookup": "/api/info-stealer",
  "TiktokerFinder": "/api/tiktok-finder"
};

export const useFetchDataFreeTools = () => {
  const [results, setResults] = useState<ApiResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async (query: string, selectedTool?: string) => {
    if (!query.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      // If a specific tool is selected, fetch from that tool only
      if (selectedTool && TOOL_ENDPOINTS[selectedTool]) {
        const endpoint = TOOL_ENDPOINTS[selectedTool];
        
        // Add loading state for this specific tool
        setResults(prev => {
          const filtered = prev.filter(r => !(r.tool === selectedTool && r.query === query));
          return [...filtered, {
            tool: selectedTool,
            query,
            data: null,
            loading: true,
            timestamp: Date.now()
          }];
        });

        try {
          const response = await fetch(`${endpoint}?q=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const data = await response.json();

          setResults(prev => 
            prev.map(r => 
              r.tool === selectedTool && r.query === query && r.loading
                ? { ...r, data: response.ok ? data : null, error: response.ok ? undefined : data.message || 'API Error', loading: false }
                : r
            )
          );
        } catch (error) {
          setResults(prev => 
            prev.map(r => 
              r.tool === selectedTool && r.query === query && r.loading
                ? { ...r, data: null, error: error instanceof Error ? error.message : 'Network Error', loading: false }
                : r
            )
          );
        }
      } else {
        // If no specific tool selected, fetch from all tools
        const toolNames = Object.keys(TOOL_ENDPOINTS);
        
        // Add loading states for all tools
        setResults(prev => {
          const filtered = prev.filter(r => r.query !== query);
          const loadingResults = toolNames.map(tool => ({
            tool,
            query,
            data: null,
            loading: true,
            timestamp: Date.now()
          }));
          return [...filtered, ...loadingResults];
        });

        // Fetch from all tools in parallel
        const fetchPromises = toolNames.map(async (toolName) => {
          const endpoint = TOOL_ENDPOINTS[toolName];
          try {
            const response = await fetch(`${endpoint}?q=${encodeURIComponent(query)}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            const data = await response.json();
            return {
              tool: toolName,
              data: response.ok ? data : null,
              error: response.ok ? undefined : data.message || 'API Error'
            };
          } catch (error) {
            return {
              tool: toolName,
              data: null,
              error: error instanceof Error ? error.message : 'Network Error'
            };
          }
        });

        const allResults = await Promise.all(fetchPromises);

        // Update results with actual data
        setResults(prev => 
          prev.map(r => {
            if (r.query === query && r.loading) {
              const result = allResults.find(ar => ar.tool === r.tool);
              return result ? { ...r, ...result, loading: false } : r;
            }
            return r;
          })
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  const removeResult = useCallback((tool: string, query: string) => {
    setResults(prev => prev.filter(r => !(r.tool === tool && r.query === query)));
  }, []);

  return {
    results,
    isLoading,
    fetchData,
    clearResults,
    removeResult
  };
};
