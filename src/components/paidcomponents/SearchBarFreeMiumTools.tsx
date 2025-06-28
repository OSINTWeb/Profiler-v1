import { useState } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchFreeTools } from "@/types/types";
import FreemiumTools from "@/components/Results/FreemiumTools";
// Define ApiResult interface locally
interface ApiResult {
  tool: string;
  query: string;
  data: string | object | null;
  error?: string;
  loading: boolean;
  timestamp: number;
}

export default function SearchBarFreeMiumTools() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState("");
  const [results, setResults] = useState<ApiResult[]>([]);
  const [resultsData, setResultsData] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const FreeTools: SearchFreeTools[] = [
    {
      title: "Mail2Linkedin",
      description: "Find Linkedin profiles by email address",
    },
    {
      title: "EmailIntel",
      description: "Find Email Intel by email address",
    },
  ];

  // Map tools to their expected input types
  const getInputPlaceholder = (toolTitle: string): string => {
    const placeholders: { [key: string]: string } = {
      Mail2Linkedin: "Enter email address (e.g., user@example.com)",
      EmailIntel: "Enter email address (e.g., user@example.com)",
    };

    return placeholders[toolTitle] || "Enter search query...";
  };

  const handleToolSelect = (toolTitle: string) => {
    setSelectedTool(toolTitle);
    setIsOpen(false);
    // Clear search query when switching tools to avoid confusion
    setSearchQuery("");
    // Clear any existing results and errors
    clearResults();
  };

  const selectedToolData = FreeTools.find((tool) => tool.title === selectedTool);

  // Validation for email input
  const isValidInput = (query: string, tool: string): boolean => {
    if (!query.trim()) return false;
    
    if (tool === "Mail2Linkedin" || tool === "EmailIntel") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(query.trim());
    }
    
    return true;
  };

  const inputIsValid = selectedTool ? isValidInput(searchQuery, selectedTool) : false;
  const showValidation = searchQuery.trim().length > 0 && selectedTool;

  const clearResults = () => {
    setResults([]);
    setResultsData(null);
    setIsLoading(false);
    setError(null);
  };

  // Direct API call function
  const fetchData = async (query: string, selectedTool: string) => {
    if (!selectedTool || !query.trim()) {
      console.error("Missing required parameters: selectedTool or query");
      return;
    }

    // Set loading state
    setIsLoading(true);
    setResultsData(null);
    setError(null);

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
      const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL;
      
      const idTokenResponse = await fetch(`${baseUrl}/api/auth/id-token`);
      const idTokenData = await idTokenResponse.json();
      
      const authToken = idTokenData.idToken;
  

      const proxyUrl = `${baseUrl}/api/FreeMiumTools?tool=${encodeURIComponent(
        selectedTool
      )}&query=${encodeURIComponent(query)}&authToken=${authToken}`;



      const response = await fetch(proxyUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });


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
      setResultsData(proxyResponse);
      setIsLoading(false);
    } catch (error) {
      console.error(`❌ Frontend: Error fetching data for ${selectedTool}:`, error);

      // Detailed error analysis
      let errorMessage = "Unknown error occurred";

      if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
        errorMessage =
          "Network error: Could not connect to the API. Make sure the Next.js server is running.";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.error(`🔍 Frontend: Error details:`, {
        errorType: error?.constructor?.name,
        errorMessage: (error as Error)?.message,
        stack: (error as Error)?.stack,
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
      setError(errorMessage);
      setIsLoading(false);
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
            className={`pl-12 bg-zinc-900 text-white placeholder:text-zinc-400 h-12 text-base disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
              showValidation
                ? inputIsValid
                  ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
                  : "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : "border-zinc-700 focus:border-blue-500 focus:ring-blue-500/20"
            }`}
          />
          
          {/* Input validation feedback */}
          {showValidation && !inputIsValid && (
            <div className="absolute top-full left-0 mt-1 text-red-400 text-xs">
              {selectedTool === "Mail2Linkedin" || selectedTool === "EmailIntel" 
                ? "Please enter a valid email address" 
                : "Invalid input format"}
            </div>
          )}

          <Button
            onClick={() => {
              if (selectedTool && searchQuery.trim() && inputIsValid) {
                fetchData(searchQuery, selectedTool);
              }
            }}
            disabled={!selectedTool || !searchQuery.trim() || !inputIsValid || isLoading}
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

      {/* Error Section */}
      {error && !isLoading && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-red-400">Error</h2>
            <Button
              onClick={clearResults}
              variant="outline"
              size="sm"
              className="bg-zinc-800 border-zinc-600 text-zinc-300 hover:bg-zinc-700"
            >
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>

          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="text-red-400 text-xl">⚠️</div>
              <div>
                <h3 className="text-red-400 font-bold mb-2">Request Failed</h3>
                <p className="text-red-300 text-sm mb-3">{error}</p>
                <Button
                  onClick={() => {
                    if (selectedTool && searchQuery.trim()) {
                      fetchData(searchQuery, selectedTool);
                    }
                  }}
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {(results.length > 0 || isLoading) && !error && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Search Results</h2>
            <Button
              onClick={clearResults}
              variant="outline"
              size="sm"
              className="bg-zinc-800 border-zinc-600 text-zinc-300 hover:bg-zinc-700"
              disabled={isLoading}
            >
              <X className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>

          <div className="grid gap-6">
            <FreemiumTools results={resultsData} selectedTool={selectedTool} loading={isLoading} />
          </div>
        </div>
      )}
    </div>
  );
}
