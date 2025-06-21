"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import InfoCardsContainer from "@/components/AdvanceComponent/StatsCard";
import type { PlatformData } from "@/components/AdvanceComponent/StatsCard";
import NewTimeline from "@/components/AdvanceComponent/NewTimeline";
import ActivityProfileCard from "@/components/AdvanceComponent/ActivityProfileCard";
import BreachedAccount from "@/components/AdvanceComponent/Breached";
import InfoCardList from "@/components/AdvanceComponent/InfocardList";

interface ModuleData {
  module: string;
  category: {
    name: string;
    description: string;
  };
  data: Record<string, unknown>;
  front_schemas: Record<string, unknown>[];
  spec_format: Record<string, unknown>[];
  status: string;
  query: string;
  from: string;
  reliable_source: boolean;
}

interface SearchData {
  query: string;
  type: string;
  PaidSearch: string;
}

interface SSEEvent {
  type: "init" | "module" | "complete" | "error";
  total?: number;
  module?: ModuleData;
  index?: number;
  message?: string;
  query?: string;
  searchType?: string;
  paidSearch?: string;
  finalCount?: number;
}

// UserData interface for BreachedAccount component
interface UserData {
  pretty_name: string;
  query: string;
  category: {
    name: string;
    description: string;
  };
  spec_format?: Array<{
    registered?: { value: string | boolean | number };
    breach?: { value: string | boolean | number };
    name?: { value: string | boolean | number };
    picture_url?: { value: string | boolean | number };
    website?: { value: string | boolean | number };
    creation_date?: { value: string | boolean | number };
    id?: { value: string | boolean | number };
    bio?: { value: string | boolean | number };
    last_seen?: { value: string | boolean | number };
    username?: { value: string | boolean | number };
    location?: { value: string | boolean | number };
    gender?: { value: string | boolean | number };
    language?: { value: string | boolean | number };
    age?: { value: string | boolean | number };
    phone_number?: { value: string | boolean | number };
    [key: string]: { value: string | boolean | number } | undefined;
  }>;
  front_schemas?: Array<{ image: string }>;
  status?: string;
  module: string;
}

// Mapping function from ModuleData to UserData for BreachedAccount
function mapModuleToUserData(module: ModuleData): UserData {
  let pretty_name = module.module;
  if (Array.isArray(module.spec_format) && module.spec_format.length > 0) {
    const firstSpec = module.spec_format[0] as { name?: { value?: string } };
    if (firstSpec && typeof firstSpec.name === "object" && firstSpec.name.value) {
      pretty_name = firstSpec.name.value;
    }
  }
  return {
    pretty_name,
    query: module.query,
    category: module.category,
    spec_format: module.spec_format as UserData["spec_format"],
    front_schemas: (module.front_schemas as Array<{ image?: string }>)?.map((schema) => ({
      image: schema.image || "",
    })),
    status: module.status,
    module: module.module || "Unknown",
  };
}

/**
 * AdvanceResultPage Component
 *
 * This component handles streaming data from APIs that may or may not provide:
 * - Total count upfront (real APIs typically don't)
 * - Index numbers for each item (real APIs typically don't)
 *
 * The component tracks progress client-side by counting received items,
 * making it compatible with both mock APIs and real-world APIs.
 */
export default function AdvanceResultPage() {
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState<ModuleData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalModules, setTotalModules] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>("disconnected");
  const [hidebutton, sethidebutton] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const maxRetries = 3;

  // Convert modules to the format expected by InfoCardList
  const convertToInfoCardListData = (modules: ModuleData[]) => {
    return modules.map((module) => ({
      module: module.module,
      schemaModule: module.module,
      status: module.status,
      query: module.query,
      pretty_name: module.module,
      from: module.from,
      reliable_source: module.reliable_source,
      category: module.category,
      spec_format: module.spec_format as Array<{
        registered?: { type?: string; proper_key?: string; value: boolean };
        platform_variables?: Array<{
          key: string;
          proper_key?: string;
          value: string;
          type?: string;
        }>;
        verified?: { value: boolean };
        breach?: { value: boolean };
        name?: { value: string };
        picture_url?: { value: string };
        website?: { value: string };
        id?: { value: string };
        bio?: { value: string };
        creation_date?: { value: string };
        gender?: { value: string };
        last_seen?: { value: string };
        username?: { value: string };
        location?: { value: string };
        phone_number?: { value: string };
        phone?: { value: string };
        email?: { value: string };
        birthday?: { value: string };
        language?: { value: string };
        age?: { value: number };
        [key: string]:
          | { value: string | boolean | number }
          | Array<{ key: string; proper_key?: string; value: string; type?: string }>
          | undefined;
      }>,
    }));
  };

  // Filter modules that don't have breach data (non-HIBP data)
  const nonHibpData = convertToInfoCardListData(modules).filter(
    (item) => !item.spec_format.some((spec) => spec.breach?.value === true)
  );

  const hibpdata = modules
    .map(mapModuleToUserData)
    .filter((item) => item.spec_format?.some((spec) => spec.breach?.value === true));
  
  // Get all converted data for fulldata prop
  const allConvertedData = convertToInfoCardListData(modules);

  const PaidSearch = searchData?.PaidSearch || "";

  const connectSSE = useCallback(
    (attempt: number = 0) => {
      if (attempt > 0) {
        setConnectionStatus("retrying");
      }

      if (!searchData?.query || !searchData?.type || !searchData?.PaidSearch) {
        return;
      }

      console.log(`Starting SSE stream (attempt ${attempt + 1}) for searchData`, searchData);
      setIsStreaming(true);

      if (attempt === 0) {
        setModules([]);
        setCurrentIndex(0);
      }

      setConnectionStatus("connecting");

      // Close any existing EventSource
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      // Create SSE URL with search parameters
      const sseUrl = `/api/stream-data?query=${encodeURIComponent(
        searchData.query
      )}&type=${encodeURIComponent(searchData.type)}&PaidSearch=${encodeURIComponent(
        searchData.PaidSearch
      )}`;

      // Create new EventSource
      const eventSource = new EventSource(sseUrl);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log("SSE connection opened");
        setConnectionStatus("connected");
      };

      eventSource.onmessage = (event) => {
        try {
          const data: SSEEvent = JSON.parse(event.data);

          if (data.type === "init") {
            setTotalModules(data.total || 0);
          } else if (data.type === "module" && data.module) {
            // Handle both scenarios: with or without server-provided index
            setModules((prev) => {
              const newModules = [...prev, data.module!];
              // Update index based on actual array length (client-side tracking)
              setCurrentIndex(newModules.length);
              return newModules;
            });
          } else if (data.type === "complete") {
            setIsStreaming(false);
            setConnectionStatus("completed");
            // If we didn't know the total count initially, update it now
            if (data.finalCount && totalModules === 0) {
              setTotalModules(data.finalCount);
            }
            eventSource.close();
          } else if (data.type === "error") {
            setIsStreaming(false);
            setConnectionStatus("error");
            eventSource.close();
          }
        } catch (error) {
          console.error("Error parsing SSE data:", error);
        }
      };

      eventSource.onerror = (error) => {
        console.error("SSE connection error:", error);
        setConnectionStatus("error");
        setIsStreaming(false);
        eventSource.close();

        // Retry logic
        if (attempt < maxRetries) {
          console.log(
            `Retrying SSE connection in 2 seconds... (attempt ${attempt + 2}/${maxRetries + 1})`
          );
          setTimeout(() => {
            connectSSE(attempt + 1);
          }, 2000);
        } else {
          console.error("Max retry attempts reached");
          setConnectionStatus("failed");
        }
      };
    },
    [searchData, maxRetries]
  );

  useEffect(() => {
    if (searchData?.query && searchData?.type && searchData?.PaidSearch) {
      connectSSE();
    }

    // Cleanup function
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [searchData, connectSSE]);
  useEffect(() => {
    // First try to get data from localStorage (for POST method)
    const storedData = localStorage.getItem("searchData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setSearchData(parsedData);
        localStorage.removeItem("searchData"); // Clean up after use
        setLoading(false);
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

    setSearchData(data);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex flex-col gap-4">
        <InfoCardsContainer data={nonHibpData} />
        <div className="flex justify-between w-full">
          <NewTimeline
            data={nonHibpData}
            isStreaming={isStreaming}
            currentIndex={currentIndex}
            totalModules={totalModules}
            connectionStatus={connectionStatus}
          />
        </div>
        <ActivityProfileCard
          userData={nonHibpData}
          isStreaming={isStreaming}
          currentIndex={currentIndex}
          totalModules={totalModules}
          connectionStatus={connectionStatus}
        />
      </div>
      <div id="breached-account" className="flex justify-between w-full">
        <BreachedAccount userData={hibpdata} />
      </div>
      <div className="w-full">
        <InfoCardList
          users={nonHibpData}
          hidebutton={hidebutton}
          PaidSearch={PaidSearch}
          sethidebutton={sethidebutton}
          fulldata={allConvertedData}
        />
      </div>
      <button
        onClick={() => window.close()}
        className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-6 py-3 rounded-lg hover:from-gray-600 hover:to-gray-800 transition-all duration-300"
      >
        Close Window
      </button>
    </div>
  );
}
