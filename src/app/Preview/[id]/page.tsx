"use client";

import { useEffect, useState } from "react";
import Data  from "public/Data/export_test@gmail.com.json";
import { useDataTransform } from "@/hooks/useDataTransform";
import type { SearchData } from "@/types/streaming";

// Component imports
import InfoCardsContainer from "@/components/AdvanceComponent/StatsCard";
import NewTimeline from "@/components/AdvanceComponent/NewTimeline";
import ActivityProfileCard from "@/components/AdvanceComponent/ActivityProfileCard";
import BreachedAccount from "@/components/AdvanceComponent/Breached";
import InfoCardList from "@/components/AdvanceComponent/InfocardList";

// Error Boundary Component
interface ErrorBoundaryProps {
  error: string | null;
  onRetry: () => void;
  children: React.ReactNode;
}

const ErrorBoundary = ({ error, onRetry, children }: ErrorBoundaryProps) => {
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-400">Streaming Error</h2>
          <p className="text-gray-300">{error}</p>
          <button
            onClick={onRetry}
            className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-lg hover:from-blue-500 hover:to-blue-700 transition-all duration-300"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }
  return <>{children}</>;
};

// Loading Component
const LoadingScreen = () => (
  <div className="min-h-screen bg-black text-white flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
      <div className="text-xl">Loading preview data...</div>
    </div>
  </div>
);

/**
 * PreviewPage Component
 *
 * Shows a preview of search results from history
 */
export default function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [hideButton, setHideButton] = useState(false);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string | null>(null);
  const streamingState = Data;
  const { nonHibpData, hibpData, allConvertedData } = useDataTransform(streamingState);

  // Resolve async params
  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await params;
        setId(resolvedParams.id);
      } catch (error) {
        console.error("Error resolving params:", error);
        setLoading(false);
      }
    };

    resolveParams();
  }, [params]);

  // Initialize search data from localStorage or create fake data based on ID
  useEffect(() => {
    if (!id) return; // Wait for ID to be resolved

    const initializePreviewData = () => {
      // Try localStorage first (for real search data)
      const storedData = localStorage.getItem("previewData");
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setSearchData(parsedData);
          localStorage.removeItem("previewData"); // Clean up
          setLoading(false);
          return;
        } catch (error) {
          console.error("Error parsing stored data:", error);
        }
      }

      // Create fake preview data based on the ID
      const previewData: SearchData = {
        query:
          id === "1"
            ? "john.doe@example.com"
            : id === "2"
            ? "+1234567890"
            : id === "3"
            ? "alex_wilson"
            : "demo@example.com",
        type: "Advance",
        PaidSearch: id === "2" ? "Phone" : id === "3" ? "Username" : "Email",
      };

      setSearchData(previewData);
      setLoading(false);
    };

    initializePreviewData();
  }, [id]);

  // Handle loading state
  if (loading) {
    return <LoadingScreen />;
  }

  // Handle missing search data
  if (!searchData?.query || !searchData?.type || !searchData?.PaidSearch) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-400">Invalid Preview Data</h2>
          <p className="text-gray-300">Missing required search parameters</p>
          <button
            onClick={() => window.history.back()}
            className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-6 py-3 rounded-lg hover:from-gray-600 hover:to-gray-800 transition-all duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary error={streamingState.error} onRetry={streamingState.retryConnection}>
      <div className=" bg-black text-white">
        {/* Header */}
        <div className="bg-zinc-900/50 backdrop-blur-sm border-b border-white/10 p-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Search Preview</h1>
              <p className="text-white/60">
                {searchData.type} search for &quot;{searchData.query}&quot; •{" "}
                {searchData.PaidSearch}
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => window.close()}
                className="bg-white text-black hover:bg-zinc-200 px-6 py-3 rounded-xl transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-full mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-8 sm:py-12 md:py-14 lg:py-16">
          <div className="flex flex-col gap-4">
            {/* Stats Cards */}
            <InfoCardsContainer data={nonHibpData} />

            {/* Timeline and Activity Profile */}
            <div className="flex justify-between w-full">
              <NewTimeline
                data={nonHibpData}
                isStreaming={streamingState.isStreaming}
                currentIndex={streamingState.currentIndex}
                totalModules={streamingState.totalModules}
                connectionStatus={streamingState.connectionStatus}
              />
            </div>

            <ActivityProfileCard userData={nonHibpData} isStreaming={streamingState.isStreaming} />
          </div>

          {/* Breached Account Section */}
          <div id="breached-account" className="flex justify-between w-full mt-6">
            <BreachedAccount userData={hibpData} />
          </div>

          {/* Info Card List */}
          <div className="w-full mt-6">
            <InfoCardList
              users={nonHibpData}
              hidebutton={hideButton}
              PaidSearch={searchData.PaidSearch}
              sethidebutton={setHideButton}
              fulldata={allConvertedData}
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
