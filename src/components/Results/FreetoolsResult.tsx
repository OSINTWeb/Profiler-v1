"use client";
import React from "react";
import LinkookResults from "./ToolsUi/LinkookResults";
import TiktokerFinderResults from "./ToolsUi/TiktokerFinderResults";
import GravatonResults from "./ToolsUi/GravatonResults";
import ProtonIntelligenceResults from "./ToolsUi/ProtonIntelligenceResults";
import BreachGuardResults from "./ToolsUi/BreachGuardResults";
import InfoStealerLookupResults from "./ToolsUi/InfoStealerLookupResults";
// Define proper TypeScript interfaces for the API responses
interface TikTokProfile {
  Nickname: string;
  Username: string;
  Country: string;
  Language: string;
  About: string;
  "User ID": string;
  SecUID: string;
  "Bio Link": string;
  "Account Created": string;
  "Nickname Last Modified": string;
  "Username Last Modified": string;
  "Avatar URL": string;
}

interface TikTokStats {
  Followers: string;
  Following: string;
  Hearts: string;
  Videos: string;
  Friends: string;
}

interface TikTokData {
  profile: TikTokProfile;
  stats: TikTokStats;
  Website: string;
  "You can support me on Ko-fi to keep this project alive!": string;
}

interface GravatarPhoto {
  value: string;
  type: string;
}

interface GravatarEmail {
  primary: string;
  value: string;
}

interface GravatarAccount {
  domain: string;
  display: string;
  url: string;
  iconUrl: string;
  is_hidden: boolean;
  username: string;
  verified: boolean;
  name: string;
  shortname: string;
}

interface GravatarProfileBackground {
  opacity: number;
}

interface GravatarEntry {
  hash: string;
  requestHash: string;
  profileUrl: string;
  preferredUsername: string;
  thumbnailUrl: string;
  photos: GravatarPhoto[];
  displayName: string;
  aboutMe: string;
  currentLocation: string;
  job_title: string;
  company: string;
  emails: GravatarEmail[];
  accounts: GravatarAccount[];
  profileBackground: GravatarProfileBackground;
}

interface GravatarData {
  entry: GravatarEntry[];
}

interface BreachEntry {
  Name: string;
  Title: string;
  Domain: string;
  BreachDate: string;
  AddedDate: string;
  ModifiedDate: string;
  PwnCount: number;
  Description: string;
  LogoPath?: string;
  Attribution?: string | null;
  DataClasses: string[];
  IsVerified: boolean;
  IsFabricated: boolean;
  IsSensitive: boolean;
  IsRetired: boolean;
  IsSpamList: boolean;
  IsMalware: boolean;
  IsSubscriptionFree: boolean;
  IsStealerLog: boolean;
}

interface BreachGuardData {
  breaches: BreachEntry[];
  total_breaches?: number;
  email?: string;
}

interface LinkookSite {
  site: string;
  url: string;
  linked_accounts?: string[];
}

interface LinkookData {
  username: string;
  found_accounts: number;
  sites: LinkookSite[];
}

interface InfoStealerEntry {
  stealer_family: string;
  date_compromised: string;
  computer_name: string;
  operating_system: string;
  malware_path: string;
  antiviruses: string[];
  ip: string;
  top_passwords: string[];
  top_logins: string[];
}

interface InfoStealerData {
  message: string;
  stealers: InfoStealerEntry[];
  total_corporate_services: number;
  total_user_services: number;
}

interface ApiResult {
  tool: string;
  query: string;
  data: string | TikTokData | GravatarData | LinkookData | InfoStealerData | BreachGuardData ;
  error?: string;
  loading: boolean;
  timestamp: number;
}

// Utility: Parse Linkook API result to OsintResult
function parseLinkookResult(raw: unknown): LinkookData | null {
  if (!raw) return null;
  if (typeof raw === "object" && raw !== null) {
    // Already in correct format
    if ("username" in raw && "found_accounts" in raw && "sites" in raw) {
      return raw as LinkookData;
    }
    // If wrapped in { data: ... }
    if ("data" in raw && typeof (raw as { data: unknown }).data === "object") {
      return parseLinkookResult((raw as { data: unknown }).data);
    }
  }
  if (typeof raw === "string") {
    try {
      // Try to parse JSON string
      const parsed = JSON.parse(raw);
      return parseLinkookResult(parsed);
    } catch {
      // Not JSON, try to extract JSON from string
      const match = raw.match(/Parsed JSON data: (\{[\s\S]*\})/);
      if (match) {
        try {
          const parsed = JSON.parse(match[1]);
          return parseLinkookResult(parsed);
        } catch {}
      }
    }
  }
  return null;
}

function parseTikTokResult(raw: unknown): TikTokData | null {
  if (!raw) return null;
  if (typeof raw === "object" && raw !== null) {
    // Already in correct format
    if ("profile" in raw && "stats" in raw) {
      return raw as TikTokData;
    }
  }
  return null;
}

function parseGravatarResult(raw: unknown): GravatarData | null {
  if (!raw) return null;
  if (typeof raw === "object" && raw !== null) {
    // Already in correct format
    if ("entry" in raw) {
      return raw as GravatarData;
    }
  }
  return null;
}

function parseBreachGuardResult(raw: unknown): BreachEntry[] | string | null {
  if (!raw) return null;
  if (typeof raw === "string") {
    return raw;
  }
  if (typeof raw === "object" && raw !== null) {
    if (Array.isArray(raw)) {
      return raw as BreachEntry[];
    }
    if ("breaches" in raw) {
      return (raw as BreachGuardData).breaches;
    }
  }
  return null;
}

function parseInfoStealerResult(raw: unknown): InfoStealerData | null {
  if (!raw) return null;
  if (typeof raw === "object" && raw !== null) {
    // Already in correct format
    if ("message" in raw && "stealers" in raw) {
      return raw as InfoStealerData;
    }
  }
  return null;
}

const FreetoolsResult = ({
  results,
  selectedTool,
}: {
  results: ApiResult[];
  selectedTool: string;
}) => {
  return (
    <div className="w-full  px-4 flex flex-col items-center justify-center gap-4">
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

      {selectedTool === "TiktokerFinder" && (
        <TiktokerFinderResults data={parseTikTokResult(results[0]?.data)} />
      )}

      {selectedTool === "Gravaton" && (
        <GravatonResults 
          data={parseGravatarResult(results[0]?.data)} 
          error={results[0]?.error}
          query={results[0]?.query || ""}
        />
      )}

      {selectedTool === "Proton Intelligence" && (
        <ProtonIntelligenceResults data={results[0]?.data} />
      )}

      {selectedTool === "Linkook" && (
        <LinkookResults data={parseLinkookResult(results[0]?.data)} />
      )}

      {selectedTool === "Breach Guard" && (
        <BreachGuardResults 
          data={parseBreachGuardResult(results[0]?.data)} 
          query={results[0]?.query || ""}
        />
      )}

      {selectedTool === "Info-Stealer Lookup" && (
        <InfoStealerLookupResults data={parseInfoStealerResult(results[0]?.data)} />
      )}
    </div>
  );
};

export default FreetoolsResult;
