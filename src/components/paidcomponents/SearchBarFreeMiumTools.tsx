import { useState } from "react";
import { Search, ChevronDown, X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchFreeTools } from "@/types/types";
import FreemiumTools from "@/components/Results/FreemiumTools";
import emailIntelDemo from "public/Data/Emailintel.json";
import mail2LinkedinDemo from "public/Data/Mail2Linkedin.json";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
        <div className="relative w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full min-w-[220px] justify-between bg-zinc-900 border-zinc-700 text-white 
              hover:bg-gradient-to-r hover:from-teal-900/80 hover:to-zinc-800/90 
              hover:border-teal-500 focus:ring-2 focus:ring-teal-400/40
              transition-all duration-200 shadow-md group h-14 rounded-xl text-base`}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            tabIndex={0}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl group-hover:scale-110 transition-transform duration-200">🔍</span>
              <span className={`transition-colors duration-200 ${selectedTool ? "" : "text-zinc-400 group-hover:text-white"}`}>
                {selectedTool || "Select a Tool"}
              </span>
            </div>
            <ChevronDown
              className={`h-5 w-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""} group-hover:text-teal-400`}
            />
          </Button>

          {isOpen && (
            <div 
              className="absolute top-full left-0 mt-2 w-full bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden max-h-80 overflow-y-auto animate-fadeIn"
              role="listbox"
            >
              {FreeTools.map((tool) => (
                <button
                  key={tool.title}
                  onClick={() => handleToolSelect(tool.title)}
                  role="option"
                  aria-selected={selectedTool === tool.title}
                  className={`
                    w-full px-5 py-4 text-left text-base flex items-center gap-4
                    transition-all duration-150
                    ${
                      selectedTool === tool.title
                        ? "bg-gradient-to-r from-teal-900/80 to-zinc-800/90 text-white border-l-4 border-teal-500 shadow-inner"
                        : "text-zinc-300 hover:bg-zinc-800/80 hover:text-white hover:pl-8"
                    }
                    focus:outline-none focus:bg-teal-900/60
                  `}
                  tabIndex={0}
                >
                  <span className={`text-xl transition-transform duration-150 ${selectedTool === tool.title ? "scale-110" : "group-hover:scale-105"}`}>🔧</span>
                  <div className="flex flex-col">
                    <span className="font-semibold">{tool.title}</span>
                    <span className="text-sm text-zinc-400">{tool.description}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 flex gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && selectedTool && searchQuery.trim() && inputIsValid) {
                  fetchData(searchQuery, selectedTool);
                }
              }}
              placeholder={
                selectedTool ? getInputPlaceholder(selectedTool) : "Select a tool first..."
              }
              disabled={!selectedTool}
              className={`pl-12 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-400 h-12 text-base disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                showValidation
                  ? inputIsValid
                    ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
                    : "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-zinc-700 focus:border-teal-500 focus:ring-teal-500/20"
              }`}
              aria-label="Search query"
              aria-required={!!selectedTool}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
          </div>

          {/* Input validation feedback */}
          {showValidation && !inputIsValid && (
            <div className="absolute top-full left-0 mt-1 text-red-400 text-xs">
              {selectedTool === "Mail2Linkedin" || selectedTool === "EmailIntel"
                ? "Please enter a valid email address"
                : "Invalid input format"}
            </div>
          )}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => {
                    if (selectedTool && searchQuery.trim() && inputIsValid) {
                      fetchData(searchQuery, selectedTool);
                    }
                  }}
                  disabled={!selectedTool || !searchQuery.trim() || !inputIsValid || isLoading}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 h-12 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                  aria-label="Perform search"
                >
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {!selectedTool 
                  ? "Select a tool first" 
                  : !searchQuery.trim() 
                    ? "Enter a search query" 
                    : !inputIsValid
                      ? "Invalid input"
                      : "Search"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Demo Result Button */}
          <Button
            type="button"
            variant="outline"
            className="h-12 px-4 bg-zinc-800 border-zinc-600 text-zinc-300 hover:bg-zinc-700 ml-2"
            disabled={!(selectedTool === "EmailIntel" || selectedTool === "Mail2Linkedin") || isLoading}
            onClick={() => {
              let demoData = null;
              const tool = selectedTool;
              let query = "";
              if (selectedTool === "EmailIntel") {
                demoData = emailIntelDemo;
                query = emailIntelDemo.email || "user@example.com";
              } else if (selectedTool === "Mail2Linkedin") {
                demoData = mail2LinkedinDemo;
                query = "demo@email.com";
              }
              if (demoData) {
                setResultsData(demoData);
                setResults([
                  {
                    tool,
                    query,
                    data: demoData,
                    loading: false,
                    timestamp: Date.now(),
                  },
                ]);
                setIsLoading(false);
                setError(null);
              }
            }}
          >
            Demo Result
          </Button>
        </div>
      </div>

      {/* Instructions */}
      {!selectedTool && results.length === 0 && (
        <div className="text-center py-12 bg-zinc-900/50 rounded-xl">
          <div className="text-zinc-400 text-lg mb-2 flex justify-center items-center gap-2">
            <Info className="w-6 h-6 text-teal-500" />
            Select a tool to get started
          </div>
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
              aria-label="Clear search results"
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
                    if (selectedTool && searchQuery.trim() && inputIsValid) {
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
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              Search Results
              <span className="text-teal-400">{selectedTool}</span>
            </h2>
            <Button
              onClick={clearResults}
              variant="outline"
              size="sm"
              className="bg-zinc-800 border-zinc-600 text-zinc-300 hover:bg-zinc-700"
              disabled={isLoading}
              aria-label="Clear search results"
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
