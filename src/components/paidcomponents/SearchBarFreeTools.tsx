import { useState } from "react";
import { Search, ChevronDown, X, Loader2, ExternalLink, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tool } from "src/types/types";
import { useFetchDataFreeTools, ApiResult } from "@/hooks/FetchDataFreeTools";


export default function SearchBarFreeTools() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState("");
  
  const { results, isLoading, fetchData, clearResults, removeResult } = useFetchDataFreeTools();
  
  const FreeTools: Tool[] = [
    {
      title: "Gravaton",
      description: "Find public Gravatar profile associated with any email address",
      link: "https://gravaton.profiler.me/",
    },
    {
      title: "Linkook",
      description: "Discover connected social accounts just by a username.",
      link: "https://linkook.profiler.me/",
    },
    {
      title: "Proton Intelligence",
      description: "Identify ProtonMail Mail Addresses Along with its Creation date and Time.",
      link: "https://protonintel.profiler.me/",
    },
    {
      title: "Breach Guard",
      description: "Enter your email to see if it has appeared in any data breaches",
      link: "https://breachguard.profiler.me/",
    },
    {
      title: "Info-Stealer Lookup",
      description: "Check if your email or username has been compromised by info-stealing malware",
      link: "https://infostealer.profiler.me/",
    },
    {
      title: "TiktokerFinder",
      description: "Quickly identify whether a TikTok account exists for a given username.",
      link: "https://tiktokerfinder.profiler.me/",
    },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      fetchData(query, selectedTool || undefined);
    }
  };

  const handleToolSelect = (toolTitle: string) => {
    setSelectedTool(toolTitle);
    setIsOpen(false);
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
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={selectedTool ? `Search with ${selectedTool}...` : "Select a tool first..."}
            disabled={!selectedTool}
            className="pl-12 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-400 focus:border-blue-500 focus:ring-blue-500/20 h-12 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {/* Selected Tool Info */}
      {selectedToolData && (
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-700 mb-8">
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-bold text-xl text-white">{selectedToolData.title}</h3>
            <span className="bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full border border-green-500/30">
              FREE
            </span>
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed">{selectedToolData.description}</p>
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

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((result: ApiResult, index: number) => (
              <div
                key={`${result.tool}-${result.query}-${index}`}
                className="bg-zinc-900 rounded-xl p-6 border border-zinc-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-white mb-1">{result.tool}</h3>
                    <p className="text-sm text-zinc-400">Query: {result.query}</p>
                  </div>
                  <Button
                    onClick={() => removeResult(result.tool, result.query)}
                    variant="ghost"
                    size="sm"
                    className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {result.loading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    <span className="ml-2 text-zinc-400">Loading...</span>
                  </div>
                )}

                {result.error && (
                  <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-red-400 font-medium">Error</p>
                      <p className="text-red-300 text-sm">{result.error}</p>
                    </div>
                  </div>
                )}

                {result.data && !result.loading && !result.error && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Success</span>
                    </div>
                    
                    <div className="bg-zinc-800 rounded-lg p-4">
                      <pre className="text-xs text-zinc-300 whitespace-pre-wrap overflow-auto max-h-40">
                        {((): string => {
                          if (typeof result.data === 'string') {
                            return result.data;
                          } else if (typeof result.data === 'object' && result.data !== null) {
                            return JSON.stringify(result.data, null, 2);
                          } else {
                            return String(result.data);
                          }
                        })()}
                      </pre>
                    </div>

                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <span>
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </span>
                      <a
                        href={FreeTools.find(t => t.title === result.tool)?.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View Original
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {isLoading && (
            <div className="text-center py-4">
              <div className="inline-flex items-center gap-2 text-zinc-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Fetching data from APIs...</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
