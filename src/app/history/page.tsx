"use client";

import { useState } from "react";
import { Search, Clock, Filter, ChevronRight, RefreshCw, ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";

interface SearchHistoryItem {
  id: string;
  query: string;
  type: "Basic" | "Advance";
  searchType: "Email" | "Phone" | "Username";
  date: string;
  time: string;
  resultsFound: number;
  status: "completed" | "failed" | "processing";
}

export default function SearchHistoryPage() {
  const [filter, setFilter] = useState<"all" | "Basic" | "Advance">("all");

  // Fake search history data
  const searchHistory: SearchHistoryItem[] = [
    {
      id: "1",
      query: "john.doe@example.com",
      type: "Advance",
      searchType: "Email",
      date: "2024-01-15",
      time: "14:30",
      resultsFound: 23,
      status: "completed",
    },
    {
      id: "2",
      query: "+1234567890",
      type: "Basic",
      searchType: "Phone",
      date: "2024-01-15",
      time: "12:45",
      resultsFound: 8,
      status: "completed",
    },
    {
      id: "3",
      query: "alex_wilson",
      type: "Advance",
      searchType: "Username",
      date: "2024-01-14",
      time: "16:20",
      resultsFound: 15,
      status: "completed",
    },
    {
      id: "4",
      query: "sarah.smith@gmail.com",
      type: "Basic",
      searchType: "Email",
      date: "2024-01-14",
      time: "11:15",
      resultsFound: 0,
      status: "failed",
    },
    {
      id: "5",
      query: "mike_johnson",
      type: "Advance",
      searchType: "Username",
      date: "2024-01-13",
      time: "09:30",
      resultsFound: 31,
      status: "completed",
    },
    {
      id: "6",
      query: "emma.davis@outlook.com",
      type: "Advance",
      searchType: "Email",
      date: "2024-01-13",
      time: "15:45",
      resultsFound: 12,
      status: "processing",
    },
    {
      id: "7",
      query: "+9876543210",
      type: "Basic",
      searchType: "Phone",
      date: "2024-01-12",
      time: "13:20",
      resultsFound: 5,
      status: "completed",
    },
    {
      id: "8",
      query: "robert_brown",
      type: "Advance",
      searchType: "Username",
      date: "2024-01-12",
      time: "10:10",
      resultsFound: 18,
      status: "completed",
    },
  ];

  const filteredHistory = searchHistory.filter((item) => filter === "all" || item.type === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-foreground bg-accent";
      case "failed":
        return "text-red-400 bg-red-500/20";
      case "processing":
        return "text-yellow-400 bg-yellow-500/20";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "✓";
      case "failed":
        return "✗";
      case "processing":
        return "⟳";
      default:
        return "?";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 p-2">
        <div className="bg-card backdrop-blur-sm border border-border rounded-2xl p-6 text-center">
          <h3 className="text-muted-foreground text-sm font-medium mb-2">Total Searches</h3>
          <p className="text-3xl font-bold text-foreground">{searchHistory.length}</p>
        </div>
        <div className="bg-card backdrop-blur-sm border border-border rounded-2xl p-6 text-center">
          <h3 className="text-muted-foreground text-sm font-medium mb-2">Successful</h3>
          <p className="text-3xl font-bold text-foreground">
            {searchHistory.filter((item) => item.status === "completed").length}
          </p>
        </div>
        <div className="bg-card backdrop-blur-sm border border-border rounded-2xl p-6 text-center">
          <h3 className="text-muted-foreground text-sm font-medium mb-2">Total Results</h3>
          <p className="text-3xl font-bold text-foreground">
            {searchHistory.reduce((total, item) => total + item.resultsFound, 0)}
          </p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto p-4 py-8">
        {/* Summary Stats */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center justify-center gap-3">
            <Clock size={40} />
            Search History
          </h1>
          <p className="text-muted-foreground text-lg">Review and manage your previous searches</p>
        </div>

        {/* Filters and Controls */}
        <div className="mb-8">
          <div className="relative mb-6">
            <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-muted/20 rounded-2xl blur-lg opacity-30"></div>
            <div className="relative bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Filter Buttons */}
                <div className="flex gap-2">
                  {(["all", "Basic", "Advance"] as const).map((filterType) => (
                    <button
                      key={filterType}
                      onClick={() => setFilter(filterType)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                        filter === filterType
                          ? "bg-foreground text-background"
                          : "bg-muted text-foreground hover:bg-accent"
                      }`}
                    >
                      {filterType === "all" ? "All Searches" : `${filterType} Search`}
                    </button>
                  ))}
                </div>

                {/* Search Stats */}
                <div className="flex items-center gap-6 text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Search size={16} />
                    {filteredHistory.length} searches
                  </span>
                  <span className="flex items-center gap-2">
                    <Filter size={16} />
                    {filter === "all" ? "All types" : filter}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search History List */}
        <div className="space-y-4">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">No searches found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your filters or start a new search</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-foreground text-background font-semibold px-6 py-3 rounded-xl hover:bg-muted-foreground transition-all duration-200"
              >
                <Search size={20} />
                Start New Search
              </Link>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div key={item.id} className="group relative">
                {/* Glow effect on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-accent/10 to-muted/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

                <div
                  className="relative bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 hover:border-border transition-all duration-300 cursor-pointer"
                  onClick={() => {
                    // Store search data for preview
                    const previewData = {
                      query: item.query,
                      type: item.type,
                      PaidSearch: item.searchType,
                    };
                    localStorage.setItem("previewData", JSON.stringify(previewData));
                    // Open preview in new tab
                    window.open(`/Preview/${item.id}`, "_blank");
                  }}
                >
                  <div className="flex items-center justify-between">
                    {/* Search Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        {/* Search Query */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                            <Search size={20} className="text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="text-foreground font-semibold text-lg">{item.query}</h3>
                            <p className="text-muted-foreground text-sm">
                              {item.type} • {item.searchType} Search
                            </p>
                          </div>
                        </div>

                        {/* Search Type Badge */}
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            item.type === "Advance"
                              ? "bg-accent text-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {item.type}
                        </div>
                      </div>

                      {/* Search Meta Info */}
                      <div className="flex items-center gap-6 text-muted-foreground text-sm">
                        <span className="flex items-center gap-2">
                          <Clock size={14} />
                          {item.date} at {item.time}
                        </span>
                        <span className="flex items-center gap-2">
                          <Search size={14} />
                          {item.resultsFound} results found
                        </span>
                        <span
                          className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs ${getStatusColor(
                            item.status
                          )}`}
                        >
                          <span>{getStatusIcon(item.status)}</span>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      {item.status === "completed" && (
                        <button
                          className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200"
                          title="View Results"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle view results action
                            const previewData = {
                              query: item.query,
                              type: item.type,
                              PaidSearch: item.searchType,
                            };
                            localStorage.setItem("previewData", JSON.stringify(previewData));
                            window.open(`/Preview/${item.id}`, "_blank");
                          }}
                        >
                          <ExternalLink size={18} />
                        </button>
                      )}
                      <button
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200"
                        title="Re-run Search"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle re-run search action
                          window.open(
                            `/?query=${encodeURIComponent(item.query)}&type=${
                              item.type
                            }&searchType=${item.searchType}`,
                            "_blank"
                          );
                        }}
                      >
                        <RefreshCw size={18} />
                      </button>
                      <button
                        className="p-2 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                        title="Delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle delete action
                          alert(
                            `Delete search "${item.query}" functionality would be implemented here`
                          );
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
                      <button
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200"
                        title="View Preview"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Same as main click action
                          const previewData = {
                            query: item.query,
                            type: item.type,
                            PaidSearch: item.searchType,
                          };
                          localStorage.setItem("previewData", JSON.stringify(previewData));
                          window.open(`/Preview/${item.id}`, "_blank");
                        }}
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link
            href="/"
            className="group relative bg-foreground text-background font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 text-center"
          >
            <span className="flex items-center justify-center gap-2">
              <Search size={20} />
              New Search
            </span>
          </Link>
          <button
            className="group relative bg-card/80 backdrop-blur-sm border border-border text-foreground font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:bg-accent text-center"
            onClick={() => {
              // This would typically clear the history
              alert("Clear history functionality would be implemented here");
            }}
          >
            <span className="flex items-center justify-center gap-2">
              <Trash2 size={20} />
              Clear History
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
