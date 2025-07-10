"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SummaryCard, ResultsGrid, EmailResult } from "./ToolsUi/EmailIntel";
import Mail2Linkedin, { LinkedInProfile as Mail2LinkedInProfile } from "./ToolsUi/Mail2Linkedin";
import NoResultFound from "./ToolsUi/NoResultFound";
import BreachGuardResults from './ToolsUi/BreachGuardResults';

// Define proper TypeScript interfaces for the API responses
interface ApiResult {
  tool: string;
  query: string;
  data: unknown;
  error?: string;
  loading: boolean;
  timestamp: number;
}

interface FreemiumToolsProps {
  results: ApiResult[];
  selectedTool: string;
  loading?: boolean;
}

export default function FreemiumTools({ results, selectedTool, loading = false }: FreemiumToolsProps) {
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
  if (!loading && (results.length === 0 || !results[0]?.data)) {
    return <NoResultFound message="No results available for this search." toolName={selectedTool} />;
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
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
    );
  }

  // No tool selected
  if (!selectedTool) {
    return null;
  }

  const renderResults = () => {
    if (loading) {
      return <div>Loading...</div>;
    }

    const result = results.find(r => r.tool === selectedTool);
    if (!result) {
      return null;
    }

    switch (selectedTool) {
      case 'breachguard':
        return <BreachGuardResults data={result.data} query={result.query} />;
      case "Email Intelligence":
        return <ResultsGrid results={result.data as EmailResult} />;
      case "Mail2Linkedin":
        return <Mail2Linkedin data={result.data as Mail2LinkedInProfile} />;
      default:
        return <NoResultFound message={`No results found for ${selectedTool}`} toolName={selectedTool} />;
    }
  };

  return (
    <div className="w-full">
      {renderResults()}
    </div>
  );
}
