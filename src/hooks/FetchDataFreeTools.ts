"use client";
import { useState, useCallback } from "react";

export interface ApiResult {
  tool: string;
  query: string;
  data: unknown;
  error?: string;
  loading: boolean;
  timestamp: number;
}

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

export const useFetchDataFreeTools = () => {
  const [results, setResults] = useState<ApiResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async (query: string, selectedTool?: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    console.log("Starting fetch for:", query, "tool:", selectedTool);

    try {
      if (selectedTool && TOOL_ENDPOINTS[selectedTool]) {
        // Single tool fetch
        setResults([{
          tool: selectedTool,
          query,
          data: null,
          loading: true,
          timestamp: Date.now(),
        }]);

        const endpoint = getEndpoint(selectedTool, query);
        const paramName = getQueryParam(selectedTool, query);
        const url = `${endpoint}?${paramName}=${encodeURIComponent(query)}`;
        
        console.log("Fetching from URL:", url);

        try {
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "x-api-key": "hwCMDBcVGu",
              "Content-Type": "application/json",
            },
            mode: "cors",
          });

          console.log("Response status:", response.status);
          console.log("Response ok:", response.ok);

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error ${response.status}: ${errorText}`);
          }

          const data = await response.json();
          console.log("Received data:", data);

          setResults([{
            tool: selectedTool,
            query,
            data: data,
            loading: false,
            timestamp: Date.now(),
          }]);

        } catch (error) {
          console.error("Fetch error:", error);
          setResults([{
            tool: selectedTool,
            query,
            data: null,
            error: error instanceof Error ? error.message : "Unknown error",
            loading: false,
            timestamp: Date.now(),
          }]);
        }

      } else {
        // Multiple tools fetch
        const toolNames = Object.keys(TOOL_ENDPOINTS);
        
        setResults(toolNames.map(tool => ({
          tool,
          query,
          data: null,
          loading: true,
          timestamp: Date.now(),
        })));

        const promises = toolNames.map(async (toolName) => {
          const endpoint = getEndpoint(toolName, query);
          const paramName = getQueryParam(toolName, query);
          const url = `${endpoint}?${paramName}=${encodeURIComponent(query)}`;

          try {
                         const response = await fetch(url, {
               method: "GET",
               headers: {
                 "x-api-key": "hwCMDBcVGu",
                 "Content-Type": "application/json",
               },
               mode: "cors",
             });

            if (!response.ok) {
              throw new Error(`API Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return { tool: toolName, data, error: undefined };
          } catch (error) {
            return { 
              tool: toolName, 
              data: null, 
              error: error instanceof Error ? error.message : "Unknown error" 
            };
          }
        });

        const results = await Promise.all(promises);
        
        setResults(prev => prev.map(r => {
          const result = results.find(res => res.tool === r.tool);
          return result ? { ...r, ...result, loading: false } : r;
        }));
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
    removeResult,
  };
};
