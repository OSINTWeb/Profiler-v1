import { useState } from "react";
import {
  Search,
  ChevronDown,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchFreeTools } from "src/types/types";
import { useFetchDataFreeTools } from "@/hooks/FetchDataFreeTools";

export default function SearchBarFreeTools() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState("");
  

  const { results, isLoading, fetchData, clearResults } = useFetchDataFreeTools();

  const FreeTools: SearchFreeTools[] = [
    {
      title: "Gravaton",
      description: "Find Gravatar profiles by email address"
    },
    {
      title: "Linkook",
      description: "Search for user profiles by username"
    },
    {
      title: "Proton Intelligence",
      description: "Check ProtonMail accounts by email"
    },
    {
      title: "Breach Guard",
      description: "Check data breaches by email address"
    },
    {
      title: "Info-Stealer Lookup",
      description: "Search info-stealer logs by email or username"
    },
    {
      title: "TiktokerFinder",
      description: "Find TikTok profiles by username"
    },
  ];

  // Map tools to their expected input types
  const getInputPlaceholder = (toolTitle: string): string => {
    const placeholders: { [key: string]: string } = {
      "Gravaton": "Enter email address (e.g., user@example.com)",
      "Linkook": "Enter username (e.g., johndoe)",
      "Proton Intelligence": "Enter email address (e.g., user@protonmail.com)",
      "Breach Guard": "Enter email address (e.g., user@example.com)",
      "Info-Stealer Lookup": "Enter email or username (e.g., user@example.com or johndoe)",
      "TiktokerFinder": "Enter username (e.g., tiktokuser)",
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
            placeholder={selectedTool ? getInputPlaceholder(selectedTool) : "Select a tool first..."}
            disabled={!selectedTool}
            className="pl-12 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-400 focus:border-blue-500 focus:ring-blue-500/20 h-12 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          />

          <Button
            onClick={() => {
              if (selectedTool && searchQuery.trim()) {
                fetchData(searchQuery, selectedTool);
              }
            }}
            disabled={!selectedTool || !searchQuery.trim() || isLoading}
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 h-12 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Search</span>
              </>
            )}
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
                Expected input: {getInputPlaceholder(selectedToolData.title).replace(/\(.*\)/, '').replace('Enter ', '').trim()}
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
              <div key={`${result.tool}-${result.query}-${index}`} className="bg-zinc-900 rounded-xl p-6 border border-zinc-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔧</span>
                    <div>
                      <h3 className="font-bold text-lg text-white">{result.tool}</h3>
                      <p className="text-sm text-zinc-400">Query: {result.query}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.loading && (
                      <div className="flex items-center gap-2 text-blue-400">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Loading...</span>
                      </div>
                    )}
                    {result.error && (
                      <div className="flex items-center gap-2 text-red-400">
                        <X className="w-4 h-4" />
                        <span className="text-sm">Error</span>
                      </div>
                    )}
                    {result.data !== null && !result.loading && !result.error && (
                      <div className="flex items-center gap-2 text-green-400">
                        <Search className="w-4 h-4" />
                        <span className="text-sm">Success</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Loading State */}
                {result.loading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-400" />
                      <p className="text-zinc-400">Searching {result.tool}...</p>
                    </div>
                  </div>
                )}

                {/* Error State */}
                {result.error && !result.loading && (
                  <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <X className="w-5 h-5 text-red-400" />
                      <span className="font-medium text-red-300">Error</span>
                    </div>
                    <p className="text-red-200 text-sm">{result.error}</p>
                    {result.error.includes("SSL Certificate Error") && (
                                             <div className="mt-2 text-xs text-red-300">
                         This might be a temporary issue with the API server&apos;s SSL certificate.
                       </div>
                    )}
                  </div>
                )}

                {/* Success State with Data */}
                {result.data !== null && !result.loading && !result.error && (
                  <div className="space-y-4">
                    <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Search className="w-5 h-5 text-green-400" />
                        <span className="font-medium text-green-300">Results Found</span>
                      </div>
                      <div className="bg-zinc-800 rounded-lg p-4 mt-3">
                        <details className="cursor-pointer">
                          <summary className="text-zinc-300 font-medium mb-2">View Raw Data</summary>
                          <pre className="text-xs text-zinc-400 overflow-auto max-h-96 whitespace-pre-wrap">
                            {JSON.stringify(result.data, null, 2) as string}
                          </pre>
                        </details>
                      </div>
                    </div>
                  </div>
                )}

                {/* No Data State */}
                {!result.data && !result.loading && !result.error && (
                  <div className="bg-zinc-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Search className="w-5 h-5 text-zinc-400" />
                      <span className="font-medium text-zinc-300">No Results</span>
                    </div>
                    <p className="text-zinc-400 text-sm">No data found for this query.</p>
                  </div>
                )}

                {/* Timestamp */}
                <div className="mt-4 pt-4 border-t border-zinc-700">
                  <p className="text-xs text-zinc-500">
                    Searched at: {new Date(result.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
