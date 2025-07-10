"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SummaryCard, ResultsGrid } from "./EmailIntel";
import Mail2Linkedin from "./Mail2Linkedin";
// Define proper TypeScript interfaces for the API responses
interface Education {
  school?: string;
  schoolName?: string;
  degree?: string;
  degreeName?: string;
  field?: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  activities?: string;
  description?: string;
  [key: string]: unknown; // Allow additional fields
}

interface Position {
  title?: string;
  jobTitle?: string;
  company?: string;
  companyName?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  summary?: string;
  location?: string;
  [key: string]: unknown; // Allow additional fields
}

interface SkillEndorsement {
  skill?: string;
  endorsementCount?: number;
  [key: string]: unknown; // Allow additional fields
}

interface NewsMention {
  title?: string;
  url?: string;
  date?: string;
  [key: string]: unknown; // Allow additional fields
}

interface UserGeneratedContent {
  title?: string;
  type?: string;
  date?: string;
  [key: string]: unknown; // Allow additional fields
}

interface LinkedInProfile {
  id: string;
  displayName: string;
  firstName: string;
  lastName: string;
  phoneNumbers: string[];
  headline: string;
  companyName: string;
  location: string;
  photoUrl: string;
  linkedInUrl: string;
  reportProfileUrl: string;
  connectionCount: number;
  isConnectionCountObfuscated: boolean;
  skills: string[];
  locale: {
    country: string;
    language: string;
  };
  schools: {
    educationsCount: number;
    educationHistory: Education[];
  };
  positions: {
    positionsCount: number;
    positionHistory: Position[];
  };
  skillEndorsements: {
    skillEndorsementsCount: number;
    skillEndorsements: SkillEndorsement[];
  };
  newsMentions: {
    newsMentionCount: number;
    newsMentions: NewsMention[];
  };
  userGeneratedContents: {
    userGeneratedContentCount: number;
    userGeneratedContents: UserGeneratedContent[];
  };
  isPublic: boolean;
}

interface EmailIntelResults {
  email: string;
  results: {
    [platform: string]: "found" | "not_found" | "rate_limited" | "error" | null;
  };
}

interface EmailResult {
  email: string;
  summary: {
    checked: number;
    time: string;
  };
  used: string[];
  not_used: string[];
  rate_limited: string[];
}

interface FreemiumToolsProps {
  results: LinkedInProfile | EmailIntelResults | EmailResult | Record<string, unknown> | null;
  selectedTool: string;
  loading?: boolean;
}

// Add helper functions at the top of the file after the interfaces
const renderObject = (obj: unknown, depth = 0): string => {
  if (depth > 3) return "[Nested Object]"; // Prevent infinite recursion
  if (obj === null) return "null";
  if (obj === undefined) return "undefined";
  if (typeof obj === "string") return obj;
  if (typeof obj === "number" || typeof obj === "boolean") return String(obj);

  if (Array.isArray(obj)) {
    return obj.map((item) => renderObject(item, depth + 1)).join(", ");
  }

  if (typeof obj === "object") {
    try {
      const entries = Object.entries(obj as Record<string, unknown>);
      if (entries.length === 0) return "{}";
      return `{ ${entries
        .map(([key, value]) => `${key}: ${renderObject(value, depth + 1)}`)
        .join(", ")} }`;
    } catch {
      return String(obj);
    }
  }
  return String(obj);
};

const renderObjectAsTable = (obj: unknown, depth = 0): React.ReactElement => {
  if (depth > 5) return <span className="text-zinc-300">[Maximum Depth Reached]</span>;

  if (typeof obj !== "object" || obj === null) {
    return <span className="text-zinc-300">{renderObject(obj)}</span>;
  }

  if (Array.isArray(obj)) {
    return (
      <div className="space-y-4">
        {obj.map((item, index) => (
          <div key={index} className="border border-zinc-700 rounded-lg p-4">
            <div className="text-zinc-400 text-sm mb-2">Item {index + 1}</div>
            {renderObjectAsTable(item, depth + 1)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="p-2 border border-zinc-700 bg-zinc-800 text-white">Key</th>
            <th className="p-2 border border-zinc-700 bg-zinc-800 text-white">Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(obj).map(([key, value], index) => (
            <tr key={index} className="hover:bg-zinc-800">
              <td className="p-2 border border-zinc-700 text-zinc-300 font-medium">
                {key}
                {Array.isArray(value) && (
                  <span className="ml-2 text-zinc-400 text-sm">({value.length} items)</span>
                )}
              </td>
              <td className="p-2 border border-zinc-700 text-zinc-300">
                {typeof value === "object" && value !== null ? (
                  <details>
                    <summary className="cursor-pointer text-zinc-400 hover:text-zinc-300 flex items-center gap-2">
                      <span>View Details</span>
                      {Array.isArray(value) && (
                        <span className="text-xs bg-zinc-700 px-2 py-1 rounded">
                          {value.length} items
                        </span>
                      )}
                    </summary>
                    <div className="mt-2 pl-4">{renderObjectAsTable(value, depth + 1)}</div>
                  </details>
                ) : (
                  renderObject(value)
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// EmailIntel transformation and rendering logic
function renderEmailIntel(
  selectedTool: string,
  results: LinkedInProfile | EmailIntelResults | EmailResult | Record<string, unknown> | null
) {
  if (selectedTool !== "EmailIntel" || !results) return null;
  let emailResult: EmailResult | null = null;
  if (
    typeof results === "object" &&
    results !== null &&
    "email" in results &&
    "summary" in results &&
    "used" in results &&
    "not_used" in results &&
    "rate_limited" in results
  ) {
    emailResult = results as EmailResult;
  } else if (
    typeof results === "object" &&
    results !== null &&
    "email" in results &&
    "results" in results
  ) {
    const platforms = Object.entries((results as EmailIntelResults).results);
    const used: string[] = [];
    const not_used: string[] = [];
    const rate_limited: string[] = [];
    platforms.forEach(([platform, status]) => {
      if (status === "found") used.push(platform);
      else if (status === "not_found") not_used.push(platform);
      else if (status === "rate_limited") rate_limited.push(platform);
    });
    emailResult = {
      email: (results as EmailIntelResults).email,
      summary: {
        checked: platforms.length,
        time: "N/A",
      },
      used,
      not_used,
      rate_limited,
    };
  }
  if (
    emailResult &&
    typeof emailResult === "object" &&
    "email" in emailResult &&
    "summary" in emailResult &&
    "used" in emailResult &&
    "not_used" in emailResult &&
    "rate_limited" in emailResult
  ) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-6">
        <SummaryCard results={emailResult} />
        <ResultsGrid results={emailResult} />
      </div>
    );
  }
  return null;
}

const FreemiumTools = ({ results, selectedTool, loading = false }: FreemiumToolsProps) => {
  // Loading state
  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <Card className="border border-zinc-700 bg-[#18181B] shadow-lg">
          <div className="p-8 text-center space-y-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <h3 className="text-xl font-bold text-white">Processing {selectedTool} Request</h3>
            <p className="text-zinc-300">
              {selectedTool === "Mail2Linkedin"
                ? "Searching LinkedIn profiles..."
                : selectedTool === "EmailIntel"
                ? "Scanning platforms for email intelligence..."
                : "Processing your request..."}
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-zinc-400">
              <div className="w-2 h-2 bg-zinc-300 rounded-full animate-pulse"></div>
              <div
                className="w-2 h-2 bg-zinc-300 rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-zinc-300 rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (selectedTool === "Mail2Linkedin" && results) {
    const profile = results as LinkedInProfile;

    return <Mail2Linkedin profile={profile} />;
  }
  // EmailIntel rendering block
  const emailIntelRender = renderEmailIntel(selectedTool, results);
  if (emailIntelRender) return emailIntelRender;

  // No results or null results
  if (!results && !loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <Card className="border border-zinc-700 bg-[#18181B] shadow-lg">
          <div className="p-8 text-center space-y-4">
            <div className="text-4xl text-zinc-400">📭</div>
            <h3 className="text-xl font-bold text-white">No Results Found</h3>
            <p className="text-zinc-300">
              We couldn&apos;t find any data for your {selectedTool} search. Please try a different
              query.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // Default return for other tools or unknown data format
  if (results) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <Card className="border border-zinc-700 bg-[#18181B] shadow-lg">
          <div className="p-6">
            <div className="bg-zinc-800 p-4 rounded border border-zinc-700">
              {renderObjectAsTable(results)}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return null;
};

export default FreemiumTools;
