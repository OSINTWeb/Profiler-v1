"use client";

import { useEffect, useState } from "react";
import { useStreamingData } from "@/hooks/useStreamingData";
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
      <div className="text-xl">Loading search data...</div>
    </div>
  </div>
);

export default function AdvanceResultPage() {
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [hideButton, setHideButton] = useState(false);
  const [loading, setLoading] = useState(true);
  const streamingState = useStreamingData({ searchData });
  const { nonHibpData, hibpData, allConvertedData } = useDataTransform(streamingState.modules);

  // Initialize search data from localStorage or URL params
  useEffect(() => {
    const initializeSearchData = () => {
      // Try localStorage first (for POST method)
      const storedData = localStorage.getItem("searchData");
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setSearchData(parsedData);
          localStorage.removeItem("searchData"); // Clean up
          return;
        } catch (error) {
          console.error("Error parsing stored data:", error);
        }
      }

      // Fallback to URL parameters (for GET method)
      const urlParams = new URLSearchParams(window.location.search);
      const data: SearchData = {
        query: urlParams.get("query") || "",
        type: urlParams.get("type") || "",
        PaidSearch: urlParams.get("PaidSearch") || "",
      };

      if (data.query && data.type && data.PaidSearch) {
        setSearchData(data);
      }
    };

    initializeSearchData();
    setLoading(false);
  }, []);

  // Handle loading state
  if (loading) {
    return <LoadingScreen />;
  }

  // Handle missing search data
  if (!searchData?.query || !searchData?.type || !searchData?.PaidSearch) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-400">Invalid Search Data</h2>
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
      <div className="min-h-screen bg-black text-white p-8">
        {/* Streaming Status Indicator */}

        {/* Main Content */}
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
          
          <ActivityProfileCard
            userData={nonHibpData}
            isStreaming={streamingState.isStreaming}
            currentIndex={streamingState.currentIndex}
            totalModules={streamingState.totalModules}
            connectionStatus={streamingState.connectionStatus}
          />
        </div>

        {/* Breached Account Section */}
        <div id="breached-account" className="flex justify-between w-full">
          <BreachedAccount userData={hibpData} />
        </div>

        {/* Info Card List */}
        <div className="w-full">
          <InfoCardList
            users={nonHibpData}
            hidebutton={hideButton}
            PaidSearch={searchData.PaidSearch}
            sethidebutton={setHideButton}
            fulldata={allConvertedData}
          />
        </div>

        {/* Close Button */}
        <button
          onClick={() => window.close()}
          className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-6 py-3 rounded-lg hover:from-gray-600 hover:to-gray-800 transition-all duration-300"
        >
          Close Window
        </button>
      </div>
    </ErrorBoundary>
  );
}
