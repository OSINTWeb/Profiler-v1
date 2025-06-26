import { useState } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchFreeTools } from "@/types/types";

// Define ApiResult interface locally
interface ApiResult {
  tool: string;
  query: string;
  data: string | object | null;
  error?: string;
  loading: boolean;
  timestamp: number;
}

export default function SearchBarFreeTools() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState("");
  const [results, setResults] = useState<ApiResult[]>([]);

  const FreeTools: SearchFreeTools[] = [
    {
      title: "Gravaton",
      description: "Find Gravatar profiles by email address",
    },
    {
      title: "Linkook",
      description: "Search for user profiles by username",
    },
    {
      title: "Proton Intelligence",
      description: "Check ProtonMail accounts by email",
    },
    {
      title: "Breach Guard",
      description: "Check data breaches by email address",
    },
    {
      title: "Info-Stealer Lookup",
      description: "Search info-stealer logs by email or username",
    },
    {
      title: "TiktokerFinder",
      description: "Find TikTok profiles by username",
    },
  ];

  // Map tools to their expected input types
  const getInputPlaceholder = (toolTitle: string): string => {
    const placeholders: { [key: string]: string } = {
      Gravaton: "Enter email address (e.g., user@example.com)",
      Linkook: "Enter username (e.g., johndoe)",
      "Proton Intelligence": "Enter email address (e.g., user@protonmail.com)",
      "Breach Guard": "Enter email address (e.g., user@example.com)",
      "Info-Stealer Lookup": "Enter email or username (e.g., user@example.com or johndoe)",
      TiktokerFinder: "Enter username (e.g., tiktokuser)",
    };

    return placeholders[toolTitle] || "Enter search query...";
  };

  const handleToolSelect = (toolTitle: string) => {
    setSelectedTool(toolTitle);
    setIsOpen(false);
    // Clear search query when switching tools to avoid confusion
    setSearchQuery("");
  };

  const selectedToolData = FreeTools.find((tool) => tool.title === selectedTool);

  const clearResults = () => {
    setResults([]);
  };

  // Direct API call function
  const fetchData = async (query: string, selectedTool: string) => {
    if (!selectedTool || !query.trim()) {
      console.error("Missing required parameters: selectedTool or query");
      return;
    }

    // Create initial result with loading state
    const initialResult: ApiResult = {
      tool: selectedTool,
      query,
      data: null,
      loading: true,
      timestamp: Date.now(),
    };

    // Set loading state
    setResults([initialResult]);

    try {
      // Use our proxy API to bypass CORS issues
      const proxyUrl = `/api/free-tools-proxy?tool=${encodeURIComponent(
        selectedTool
      )}&query=${encodeURIComponent(query)}`;

      console.log(`🔍 Frontend: Fetching data for ${selectedTool} with query: ${query}`);
      console.log(`📡 Frontend: Using proxy URL: ${proxyUrl}`);

      const response = await fetch(proxyUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(`📊 Frontend: Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        // Try to get more detailed error information
        let errorDetail = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorDetail = errorData.error;
            if (errorData.details) {
              errorDetail += ` - ${errorData.details}`;
            }
          }
        } catch {
          console.warn("Could not read error response body");
        }
        throw new Error(errorDetail);
      }

      // Parse the proxy response
      const proxyResponse = await response.json();
      
      console.log(`✅ Frontend: Proxy response received:`, proxyResponse);

      // Update with successful result
      const successResult: ApiResult = {
        tool: selectedTool,
        query,
        data: proxyResponse.data,
        loading: false,
        timestamp: Date.now(),
      };

      setResults([successResult]);
      
    } catch (error) {
      console.error(`❌ Frontend: Error fetching data for ${selectedTool}:`, error);
      
      // Detailed error analysis
      let errorMessage = "Unknown error occurred";
      
      if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
        errorMessage = "Network error: Could not connect to the API. Make sure the Next.js server is running.";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      console.error(`🔍 Frontend: Error details:`, {
        errorType: error?.constructor?.name,
        errorMessage: (error as Error)?.message,
        stack: (error as Error)?.stack
      });

      // Update with error result
      const errorResult: ApiResult = {
        tool: selectedTool,
        query,
        data: null,
        error: errorMessage,
        loading: false,
        timestamp: Date.now(),
      };

      setResults([errorResult]);
    }
  };

  return (
    <div className={`w-full max-w-7xl mx-auto px-4 `}>
      {/* Tool Selection and Search Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Tool Selection Dropdown */}
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setIsOpen(!isOpen)}
            className="min-w-[200px] justify-between bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800 hover:border-zinc-600 transition-all duration-300"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🔍</span>
              <span>{selectedTool || "Select a Tool"}</span>
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            />
          </Button>

          {isOpen && (
            <div className="absolute top-full left-0 mt-2 w-full bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden max-h-60 overflow-y-auto">
              {FreeTools.map((tool) => (
                <button
                  key={tool.title}
                  onClick={() => handleToolSelect(tool.title)}
                  className={`w-full px-4 py-3 text-left text-sm hover:bg-zinc-800 transition-all duration-200 flex items-center gap-3 ${
                    selectedTool === tool.title
                      ? "bg-zinc-700 text-white border-l-4 border-blue-500"
                      : "text-zinc-300"
                  }`}
                >
                  <span className="text-lg">🔧</span>
                  <div className="flex flex-col">
                    <span className="font-medium">{tool.title}</span>
                    <span className="text-xs text-zinc-400">{tool.description}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 flex gap-2">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            placeholder={
              selectedTool ? getInputPlaceholder(selectedTool) : "Select a tool first..."
            }
            disabled={!selectedTool}
            className="pl-12 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-400 focus:border-blue-500 focus:ring-blue-500/20 h-12 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          />

          <Button
            onClick={() => {
              if (selectedTool && searchQuery.trim()) {
                fetchData(searchQuery, selectedTool);
              }
            }}
            disabled={!selectedTool || !searchQuery.trim()}
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 h-12 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            <Search className="w-5 h-5" />
            <span>Search</span>
          </Button>
        </div>
      </div>

      {/* Selected Tool Info */}
      {selectedToolData && (
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-700 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-xl text-white mb-2">{selectedToolData.title}</h3>
              <p className="text-zinc-400 text-sm">{selectedToolData.description}</p>
              <div className="mt-2 text-xs text-zinc-500">
                Expected input:{" "}
                {getInputPlaceholder(selectedToolData.title)
                  .replace(/\(.*\)/, "")
                  .replace("Enter ", "")
                  .trim()}
              </div>
            </div>
            <span className="bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full border border-green-500/30">
              FREE
            </span>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!selectedTool && results.length === 0 && (
        <div className="text-center py-12">
          <div className="text-zinc-400 text-lg mb-2">Select a tool to get started</div>
          <div className="text-zinc-500 text-sm">
            Choose a tool from the dropdown above to begin searching
          </div>
        </div>
      )}

      {/* Results Section */}
      {results.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Search Results</h2>
            <Button
              onClick={clearResults}
              variant="outline"
              size="sm"
              className="bg-zinc-800 border-zinc-600 text-zinc-300 hover:bg-zinc-700"
            >
              <X className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>

          <div className="grid gap-6">
            {results.map((result, index) => (
              <div key={index} className="bg-zinc-900 rounded-xl p-6 border border-zinc-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{result.tool}</h3>
                  <span className="text-sm text-zinc-400">
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <div className="mb-3">
                  <span className="text-zinc-400">Query: </span>
                  <span className="text-white font-mono bg-zinc-800 px-2 py-1 rounded">
                    {result.query}
                  </span>
                </div>

                {result.loading && (
                  <div className="flex items-center gap-2 text-blue-400">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                    <span>Loading...</span>
                  </div>
                )}

                {result.error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <div className="text-red-400 font-semibold mb-2">Error:</div>
                    <div className="text-red-300 text-sm">{result.error}</div>
                  </div>
                )}

                {result.data && !result.loading && (
                  <div className="bg-zinc-800 rounded-lg p-4">
                    <div className="text-green-400 font-semibold mb-2">Result:</div>
                    <pre className="text-zinc-300 text-sm overflow-x-auto whitespace-pre-wrap">
                      {(() => {
                        if (typeof result.data === "string") {
                          return result.data;
                        }
                        return JSON.stringify(result.data, null, 2);
                      })()}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
