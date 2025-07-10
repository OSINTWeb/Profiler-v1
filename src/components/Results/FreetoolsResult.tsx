"use client";
import React from "react";
import { parseProtonResult, parseLinkookResult } from "@/lib/utils";
import NoResultFound from "./ToolsUi/NoResultFound";

// Tool-specific components
import TiktokerResults from "./ToolsUi/TiktokerResults";
import GravatarResults from "./ToolsUi/GravatarResults";
import ProtonResults from "./ToolsUi/ProtonResults";
import BreachGuardResults from "./ToolsUi/BreachGuardResults";
import InfoStealerResults from "./ToolsUi/InfoStealerResults";
import LinkookResults from "./ToolsUi/LinkookResults";

interface ApiResult {
  tool: string;
  query: string;
  data: unknown;
  error?: string;
  loading: boolean;
  timestamp: number;
}

const FreetoolsResult = ({
  results,
  selectedTool,
}: {
  results: ApiResult[];
  selectedTool: string;
}) => {
  // If there's an error, show a user-friendly message
  if (results[0]?.error) {
    return (
      <NoResultFound 
        message="We're having trouble processing your request. Please try again in a few moments." 
        toolName={selectedTool}
      />
    );
  }

  // If there are no results and no loading state, show no results found
  if (results.length === 0 || (!results[0]?.data && !results[0]?.loading)) {
    return <NoResultFound message="No results available for this search." toolName={selectedTool} />;
  }

  return (
    <div className="w-full px-4 flex flex-col items-center justify-center gap-4">
      {/* Loader for free tool loading */}
      {results.some((result) => result.loading) && (
        <div className="flex flex-col items-center justify-center py-12 w-full">
          <div className="relative w-16 h-16 mb-4">
            <div
              className="absolute inset-0 rounded-full border-4 border-t-4 border-t-teal-400 border-gray-700 animate-spin"
              style={{ borderTopColor: "#14b8a6" }}
            />
            <div
              className="absolute inset-2 rounded-full border-4 border-t-4 border-t-blue-400 border-gray-800 animate-spin-slow"
              style={{ borderTopColor: "#3b82f6", animationDuration: "2s" }}
            />
            <div
              className="absolute inset-4 rounded-full border-2 border-t-2 border-t-purple-400 border-gray-900 animate-spin-slower"
              style={{ borderTopColor: "#a78bfa", animationDuration: "3s" }}
            />
          </div>
          <div className="text-lg text-teal-300 font-semibold animate-pulse">
            Fetching data, please wait...
          </div>
        </div>
      )}

      {/* Tool-specific results */}
      {selectedTool === "TiktokerFinder" && (
        <TiktokerResults data={results[0]?.data} />
      )}

      {selectedTool === "Gravaton" && (
        <GravatarResults 
          data={results[0]?.data} 
          error={undefined} // Don't pass error to show user-friendly message instead
          query={results[0]?.query}
        />
      )}

      {selectedTool === "Proton Intelligence" && (
        <ProtonResults result={parseProtonResult(results[0]?.data)} />
      )}

      {selectedTool === "Linkook" && (
        <LinkookResults data={parseLinkookResult(results[0]?.data)} />
      )}

      {selectedTool === "Breach Guard" && (
        <BreachGuardResults 
          data={results[0]?.data}
          query={results[0]?.query}
        />
      )}

      {selectedTool === "Info-Stealer Lookup" && (
        <InfoStealerResults data={results[0]?.data} />
      )}
    </div>
  );
};

export default FreetoolsResult;
