"use client";
import {
  X,
  Mail,
  ExternalLink,
  MapPin,
  User,
  AlertCircle,
  Calendar,
  Computer,
  HardDrive,
  Shield,
  Wifi,
  Lock,
  Key,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { Card } from "@/components/ui/card";
import { Copy, CheckCircle, XCircle } from "lucide-react";
import { formatDistanceToNow, fromUnixTime, format } from "date-fns";
import { toast } from "sonner";
import { ProtonResult } from "@/types/proton";
import { Separator } from "@/components/ui/separator";
import LinkookResults from "./LinkookResults";

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

interface BreachEntry {
  Name: string;
  Date?: string;
  Description?: string;
  DataClasses?: string[];
  BreachDate?: string;
  AddedDate?: string;
  ModifiedDate?: string;
  PwnCount?: number;
  Domain?: string;
  IsVerified?: boolean;
  IsFabricated?: boolean;
  IsSpamList?: boolean;
  IsRetired?: boolean;
  IsSensitive?: boolean;
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

interface ApiResult {
  tool: string;
  query: string;
  data: string | TikTokData | GravatarData | LinkookData | InfoStealerData | BreachGuardData | null;
  error?: string;
  loading: boolean;
  timestamp: number;
}

// Define ResultCard at the top-level
interface ResultCardProps {
  result: ProtonResult;
}

const ResultCard = ({ result }: ResultCardProps) => {
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard`);
  };

  const isRecentKey = (timestamp: number) => {
    const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return fromUnixTime(timestamp).getTime() > oneMonthAgo;
  };

  const isOldKey = (timestamp: number) => {
    const twoYearsAgo = Date.now() - 2 * 365 * 24 * 60 * 60 * 1000;
    return fromUnixTime(timestamp).getTime() < twoYearsAgo;
  };

  const isFutureKey = (timestamp: number) => {
    return fromUnixTime(timestamp).getTime() > Date.now();
  };

  return (
    <div className="animate-fade-in w-full">
      <Card className="overflow-hidden border-white/20 p-6  bg-[#17181a] shadow-xl">
        <div>
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              <h2 className="text-xl font-semibold text-white">Proton Key Details</h2>
            </div>
            <div className="flex items-center gap-2">
              {result.isOfficialDomain ? (
                <span className="flex items-center gap-1 text-sm bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                  <CheckCircle className="w-4 h-4" />
                  Official Domain
                </span>
              ) : (
                <span className="flex items-center gap-1 text-sm bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">
                  <Shield className="w-4 h-4" />
                  Custom Domain
                </span>
              )}
            </div>
          </div>

          <Separator className="mb-6 bg-[#2a3442]" />

          {/* Key ID Section */}
          <div className="space-y-6">
            <div className="bg-[#1d2127] rounded-lg p-4 backdrop-blur-sm border border-[#2a3442]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-400 font-medium">KEY ID</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(result.keyId, "Key ID")}
                  className="hover:bg-[#2a3442] text-gray-400"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="mt-2 text-sm font-mono text-white break-all">{result.keyId}</p>
            </div>

            {/* Creation Date Section */}
            <div className="bg-[#1d2127] rounded-lg p-4 backdrop-blur-sm border border-[#2a3442]">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400 font-medium">CREATION DATE</span>
              </div>
              <p className="text-white text-lg">
                {format(fromUnixTime(result.creationDate), "MMMM d, yyyy")}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {isFutureKey(result.creationDate)
                  ? `In ${formatDistanceToNow(fromUnixTime(result.creationDate))}`
                  : `${formatDistanceToNow(fromUnixTime(result.creationDate))} ago`}
              </p>
            </div>

            {/* Key Status Section */}
            <div className="bg-[#1d2127] rounded-lg p-4 backdrop-blur-sm border border-[#2a3442]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isRecentKey(result.creationDate) && !isFutureKey(result.creationDate) ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : isOldKey(result.creationDate) ? (
                    <XCircle className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-blue-400" />
                  )}
                  <span className="text-gray-400 font-medium">KEY STATUS</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    isRecentKey(result.creationDate) && !isFutureKey(result.creationDate)
                      ? "bg-green-500/20 text-green-400"
                      : isOldKey(result.creationDate)
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {isRecentKey(result.creationDate) && !isFutureKey(result.creationDate)
                    ? "Recently Created"
                    : isOldKey(result.creationDate)
                    ? "Key is over 2 years old"
                    : "Valid Key"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Utility: Parse Linkook API result to OsintResult
function parseLinkookResult(raw: unknown): LinkookData | null {
  if (!raw) return null;
  if (typeof raw === "object" && raw !== null) {
    // Already in correct format
    if ("username" in raw && "found_accounts" in raw && "sites" in raw) {
      return raw as LinkookData;
    }
    // If wrapped in { data: ... }
    if ("data" in raw && typeof (raw as any).data === "object") {
      return parseLinkookResult((raw as any).data);
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

function parseProtonResult(raw: unknown): ProtonResult {
  // Example raw input: 'pub:610eeaca8dc1d15f6bca0ba6bdd07f62e32809a1:1::1400277585::\nuid:UserID:1400277585::'
  // We'll extract keyId, creationDate, and set isOfficialDomain based on email domain
  let keyId = "";
  let creationDate = 0;
  let email = "";
  let isOfficialDomain = false;

  if (typeof raw === "object" && raw !== null) {
    // If already in correct format
    if ("keyId" in raw && "creationDate" in raw && "email" in raw) {
      return raw as ProtonResult;
    }
    if ("data" in raw) raw = raw.data;
  }
  if (typeof raw === "string") {
    // Try to extract keyId and creationDate from the string
    // Example: pub:610eeaca8dc1d15f6bca0ba6bdd07f62e32809a1:1::1400277585::
    const pubMatch = raw.match(/pub:([a-f0-9]{40,}):[0-9]*::([0-9]+)::/);
    if (pubMatch) {
      keyId = pubMatch[1];
      creationDate = parseInt(pubMatch[2], 10);
    }
    // Try to extract email if present
    const emailMatch = raw.match(/[\w.-]+@[\w.-]+/);
    if (emailMatch) {
      email = emailMatch[0];
    }
    // Fallback: if not found, set demo email
    if (!email) email = "unknown@protonmail.com";
    isOfficialDomain = email.endsWith("@protonmail.com") || email.endsWith("@proton.me");
  }
  return {
    email,
    keyId,
    creationDate,
    isOfficialDomain,
  };
}

const FreetoolsResult = ({
  results,
  selectedTool,
}: {
  results: ApiResult[];
  selectedTool: string;
}) => {
  // Add imageLoaded state for Gravatar original UI
  const [imageLoaded, setImageLoaded] = React.useState(false);

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
        <div
        className="w-full flex flex-col items-center justify-center"
        >
          {results.length > 0 &&
            results[0].data &&
            typeof results[0].data === "object" &&
            "profile" in results[0].data &&
            "stats" in results[0].data && (
              <div className="bg-[#18181B] text-[#CFCFCF] rounded-xl p-6 py-16 shadow-lg w-full  ">
                <div className="space-y-8 animate-fade-in">
                  <div className="flex flex-col md:flex-row items-center gap-10">
                    {/* Avatar */}
                    <div className="flex flex-col items-center gap-10">
                      <div className="w-28 h-28 rounded-full overflow-hidden border border-[#333536]">
                        <img
                          src={(results[0].data as TikTokData).profile["Avatar URL"]}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 w-full">
                      <h2 className="text-2xl font-semibold">
                        {(results[0].data as TikTokData).profile.Nickname}
                      </h2>
                      <p className="text-sm text-gray-400 mb-4">
                        @{(results[0].data as TikTokData).profile.Username}
                      </p>

                      <div className="space-y-1 text-sm mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Country:</span>
                          <span className="font-medium">
                            {(results[0].data as TikTokData).profile.Country}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Language:</span>
                          <span className="font-medium">
                            {(results[0].data as TikTokData).profile.Language}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">User ID:</span>
                          <span className="font-medium">
                            {(results[0].data as TikTokData).profile["User ID"]}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Joined:</span>
                          <span className="font-medium">
                            {(results[0].data as TikTokData).profile["Account Created"]}
                          </span>
                        </div>
                      </div>

                      <div className="bg-[#27272A] px-4 py-3 rounded-md text-sm italic text-[#CFCFCF] mb-6">
                        &ldquo;{(results[0].data as TikTokData).profile.About}&rdquo;
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        <div className="bg-[#27272A] rounded-md text-center py-3">
                          <p className="text-base font-semibold">
                            {(results[0].data as TikTokData).stats.Followers}
                          </p>
                          <p className="text-xs text-gray-400">Followers</p>
                        </div>

                        <div className="bg-[#27272A] rounded-md text-center py-3">
                          <p className="text-base font-semibold text-teal-300">
                            {(results[0].data as TikTokData).stats.Following}
                          </p>
                          <p className="text-xs text-gray-400">Following</p>
                        </div>

                        <div className="bg-[#27272A] rounded-md text-center py-3">
                          <p className="text-base font-semibold">
                            {(results[0].data as TikTokData).stats.Hearts}
                          </p>
                          <p className="text-xs text-gray-400">Hearts</p>
                        </div>

                        <div className="bg-[#27272A] rounded-md text-center py-3">
                          <p className="text-base font-semibold text-teal-300">
                            {(results[0].data as TikTokData).stats.Videos}
                          </p>
                          <p className="text-xs text-gray-400">Videos</p>
                        </div>

                        <div className="bg-[#27272A] rounded-md text-center py-3">
                          <p className="text-base font-semibold">
                            {(results[0].data as TikTokData).stats.Friends}
                          </p>
                          <p className="text-xs text-gray-400">Friends</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
      )}

      {selectedTool === "Gravaton" && (
        <div>
          {results[0]?.error ? (
            <div className="w-full max-w-xl mx-auto mt-8 overflow-hidden animate-slide-up">
              <div className="border border-red-500/20 rounded-md p-6 bg-red-500/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                    <X className="h-4 w-4 text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-red-400">Gravatar Not Found</h3>
                </div>
                <p className="text-red-300 text-sm">
                  No Gravatar profile was found for the email address:{" "}
                  <span className="font-mono bg-red-500/20 px-2 py-1 rounded">
                    {results[0].query}
                  </span>
                </p>
                <div className="mt-4 p-3 bg-red-500/10 rounded-md border border-red-500/20">
                  <p className="text-xs text-red-300">This could mean:</p>
                  <ul className="text-xs text-red-300 mt-2 space-y-1 list-disc list-inside">
                    <li>The email address doesn&apos;t have a Gravatar account</li>
                    <li>The email address is incorrect</li>
                    <li>The Gravatar profile has been deleted</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            results[0]?.data &&
            typeof results[0].data === "object" &&
            "entry" in results[0].data &&
            (results[0].data as GravatarData).entry.length > 0 &&
            (() => {
              const profile = (results[0].data as GravatarData).entry[0];
              return (
                <div className="w-full max-w-xl mx-auto mt-8 overflow-hidden animate-slide-up">
                  <div className=" border border-white/20 rounded-md p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0 flex justify-center md:justify-start">
                        <div className="relative w-32 h-32 rounded-md overflow-hidden bg-muted flex items-center justify-center border-4 border-white/20">
                          {!imageLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center animate-pulse-light">
                              <span className="text-xs text-gray-300">Loading...</span>
                            </div>
                          )}
                          <img
                            src={profile.thumbnailUrl}
                            alt={profile.displayName}
                            className={`w-full h-full object-cover ${
                              imageLoaded ? "animate-image-load" : "opacity-0"
                            }`}
                            onLoad={() => setImageLoaded(true)}
                            key={profile.thumbnailUrl}
                          />
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="mb-3 text-center md:text-left">
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary/10 text-teal-400 text-xs font-medium mb-2">
                            Gravatar Profile
                          </span>
                          <h1 className="text-2xl md:text-3xl font-bold">{profile.displayName}</h1>
                          <p className="text-gray-300">{profile.preferredUsername}</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-gray-300 mb-4">
                          <Mail className="h-3.5 w-3.5" />
                          <span>{profile.emails && profile.emails[0]?.value}</span>
                        </div>
                        <div className="space-y-4">
                          {profile.profileUrl && (
                            <a
                              href={profile.profileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm text-teal-400 hover:text-teal-400/80 transition-colors"
                            >
                              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                              View Profile
                            </a>
                          )}
                          {profile.currentLocation && (
                            <div className="flex items-center gap-1.5 text-sm">
                              <MapPin className="h-3.5 w-3.5 text-gray-300" />
                              <span>{profile.currentLocation}</span>
                            </div>
                          )}
                          {profile.aboutMe && (
                            <div className="mt-4">
                              <h3 className="text-sm font-medium mb-1.5">About</h3>
                              <p className="text-sm text-gray-300 leading-relaxed">
                                {profile.aboutMe}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()
          )}
        </div>
      )}
      {selectedTool === "Proton Intelligence" && (
        <div className="w-full flex flex-col items-center justify-center">
          {results.length > 0 && results[0].data && (
            <ResultCard result={parseProtonResult(results[0].data)} />
          )}
        </div>
      )}
      {selectedTool === "Linkook" && <LinkookResults data={parseLinkookResult(results[0]?.data)} />}

      {selectedTool === "Breach Guard" && (
        <div className="w-full flex flex-col items-center justify-center">
          {results.length > 0 && results[0].data && (
            <div className="w-full  mx-auto mt-8 overflow-hidden animate-slide-up">
              <div className="border border-teal-400/20 rounded-xl p-4 bg-[#18181B] backdrop-blur-sm">
                {(() => {
                  // Parse the string data to extract breach information
                  let breachData: BreachEntry[] = [];
                  let parsedData: unknown = null;

                  if (typeof results[0].data === "string") {
                    try {
                      // Extract JSON array from the API route response string
                      const jsonMatch = results[0].data.match(/Parsed JSON data: (\[.*\])/);
                      if (jsonMatch) {
                        parsedData = JSON.parse(jsonMatch[1]);
                        breachData = Array.isArray(parsedData) ? parsedData : [];
                      }
                    } catch (error) {
                      console.error("Failed to parse breach data:", error);
                    }
                  } else if (typeof results[0].data === "object") {
                    if (Array.isArray(results[0].data)) {
                      breachData = results[0].data as BreachEntry[];
                    } else if ((results[0].data as BreachGuardData).breaches) {
                      breachData = (results[0].data as BreachGuardData).breaches;
                    }
                  }

                  return (
                    <div className="space-y-4">
                      {/* Header Section */}
                      <div className="text-center space-y-1">
                        <span className="inline-block px-2 py-0.5 rounded bg-teal-400/10 text-teal-400 text-xs font-medium border border-teal-400/20">
                          Breach Guard
                        </span>
                        <h1 className="text-2xl font-bold text-white">Data Breach Report</h1>
                        <p className="text-sm text-white">
                          Query:{" "}
                          <span className="font-mono bg-[#232326] border border-teal-400/10 px-1.5 py-0.5 rounded text-teal-400">
                            {results[0].query}
                          </span>
                        </p>
                      </div>

                      {/* Summary Statistics */}
                      <div className="bg-[#232326] rounded-lg p-3 border border-teal-400/10 flex flex-col md:flex-row items-center justify-center gap-2 text-center">
                        <div className="flex-1 flex flex-col items-center gap-1">
                          <span className="text-lg font-bold text-teal-400">
                            {breachData.length}
                          </span>
                          <span className="text-xs text-white">Total</span>
                        </div>
                        <div className="w-px h-6 bg-teal-400/10 hidden md:block" />
                        <div className="flex-1 flex flex-col items-center gap-1">
                          <span className="text-lg font-bold text-teal-400">
                            {breachData.filter((breach) => breach.IsVerified !== false).length}
                          </span>
                          <span className="text-xs text-white">Verified</span>
                        </div>
                        <div className="w-px h-6 bg-teal-400/10 hidden md:block" />
                        <div className="flex-1 flex flex-col items-center gap-1">
                          <span className="text-lg font-bold text-teal-400">
                            {breachData.filter((breach) => breach.IsSensitive).length}
                          </span>
                          <span className="text-xs text-white">Sensitive</span>
                        </div>
                      </div>

                      {/* Breach Details */}
                      {breachData.length > 0 ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-teal-400 text-sm font-semibold mb-1">
                            <AlertCircle className="h-4 w-4" />
                            Detected Breaches ({breachData.length})
                          </div>
                          {breachData.map((breach, index) => (
                            <div
                              key={index}
                              className="bg-[#232326] rounded-md border border-teal-400/10 px-3 py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-sm"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 font-semibold text-white truncate">
                                  <span className="truncate">{breach.Name}</span>
                                  {breach.BreachDate && (
                                    <span className="text-xs text-teal-400 font-normal">
                                      ({new Date(breach.BreachDate).toLocaleDateString()})
                                    </span>
                                  )}
                                </div>
                                {breach.Domain && (
                                  <div className="text-xs text-teal-400 truncate">
                                    {breach.Domain}
                                  </div>
                                )}
                                {breach.Description && (
                                  <div className="text-xs text-white/70 mt-0.5 line-clamp-2">
                                    {breach.Description}
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-1 items-center justify-end">
                                {breach.IsVerified && (
                                  <span className="px-2 py-0.5 bg-teal-400/20 text-teal-400 text-xs rounded border border-teal-400/20">
                                    Verified
                                  </span>
                                )}
                                {breach.IsSensitive && (
                                  <span className="px-2 py-0.5 bg-teal-400/10 text-teal-400 text-xs rounded border border-teal-400/20">
                                    Sensitive
                                  </span>
                                )}
                                {breach.IsSpamList && (
                                  <span className="px-2 py-0.5 bg-white/10 text-white text-xs rounded border border-white/10">
                                    Spam List
                                  </span>
                                )}
                                {breach.IsFabricated && (
                                  <span className="px-2 py-0.5 bg-white/10 text-white text-xs rounded border border-white/10">
                                    Fabricated
                                  </span>
                                )}
                                {breach.IsRetired && (
                                  <span className="px-2 py-0.5 bg-white/10 text-white text-xs rounded border border-white/10">
                                    Retired
                                  </span>
                                )}
                                {breach.PwnCount && (
                                  <span className="px-2 py-0.5 bg-teal-400/10 text-teal-400 text-xs rounded border border-teal-400/10">
                                    {breach.PwnCount.toLocaleString()} affected
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="flex items-center justify-center mb-2">
                            <Shield className="h-10 w-10 text-teal-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-1">Good News!</h3>
                          <p className="text-white text-sm max-w-md mx-auto">
                            No data breaches were found for this query. Your information appears to
                            be secure.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      )}
      {selectedTool === "Info-Stealer Lookup" && (
        <div>
          {results.length > 0 &&
            results[0].data &&
            typeof results[0].data === "object" &&
            "message" in results[0].data &&
            "stealers" in results[0].data && (
              <div className="w-full max-w-4xl mx-auto mt-8 overflow-hidden animate-slide-up">
                <div className="rounded-xl p-6 bg-[#18181B] shadow-xl">
                  {(() => {
                    const infoStealerData = results[0].data as InfoStealerData;
                    return (
                      <div className="space-y-6">
                        {/* Header Section */}
                        <div className="text-center space-y-1">
                          <span className="inline-block px-2 py-0.5 rounded bg-teal-400/10 text-teal-400 text-xs font-medium border border-teal-400/20">
                            Info-Stealer Lookup
                          </span>
                          <h1 className="text-2xl font-bold text-white">Analysis Complete</h1>
                        </div>

                        {/* Message Alert */}
                        <div className="bg-[#232326] rounded-lg p-4 flex items-center gap-3">
                          <AlertCircle className="h-6 w-6 text-teal-400" />
                          <div>
                            <h3 className="text-base font-semibold text-teal-400 mb-1">Result</h3>
                            <p className="text-white leading-relaxed text-sm">
                              {infoStealerData.message}
                            </p>
                          </div>
                        </div>

                        {/* Summary Statistics */}
                        <div className="bg-[#18181B] rounded-lg p-4 flex flex-col md:flex-row items-center justify-center gap-2 text-center border border-teal-400/10">
                          <div className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-lg font-bold text-teal-400">
                              {infoStealerData.total_corporate_services}
                            </span>
                            <span className="text-xs text-white">Corporate</span>
                          </div>
                          <div className="w-px h-6 bg-teal-400/10 hidden md:block" />
                          <div className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-lg font-bold text-teal-400">
                              {infoStealerData.total_user_services}
                            </span>
                            <span className="text-xs text-white">User</span>
                          </div>
                          <div className="w-px h-6 bg-teal-400/10 hidden md:block" />
                          <div className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-lg font-bold text-teal-400">
                              {infoStealerData.stealers.length}
                            </span>
                            <span className="text-xs text-white">Stealer Instances</span>
                          </div>
                        </div>

                        {/* Stealer Details (if any found) */}
                        {infoStealerData.stealers.length > 0 && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-teal-400 text-sm font-semibold mb-1">
                              <Shield className="h-4 w-4" />
                              Detected Info-Stealer Instances
                            </div>
                            {infoStealerData.stealers.map((stealer, index) => (
                              <div
                                key={index}
                                className="bg-[#232326] rounded-md border border-teal-400/10 px-3 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-sm"
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 font-semibold text-white truncate">
                                    <span className="truncate">
                                      Stealer #{index + 1}
                                      {stealer.stealer_family && ` - ${stealer.stealer_family}`}
                                    </span>
                                    <span className="text-xs text-teal-400 font-normal">
                                      (
                                      {new Date(stealer.date_compromised).toLocaleDateString(
                                        "en-US",
                                        {
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        }
                                      )}
                                      )
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-1 text-teal-400 text-xs">
                                        <Computer className="h-3 w-3" />
                                        <span>Computer:</span>
                                        <span className="text-white font-mono">
                                          {stealer.computer_name}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1 text-teal-400 text-xs">
                                        <HardDrive className="h-3 w-3" />
                                        <span>OS:</span>
                                        <span className="text-white font-mono">
                                          {stealer.operating_system}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1 text-teal-400 text-xs">
                                        <Wifi className="h-3 w-3" />
                                        <span>IP:</span>
                                        <span className="text-white font-mono">{stealer.ip}</span>
                                      </div>
                                      <div className="flex items-center gap-1 text-teal-400 text-xs">
                                        <AlertCircle className="h-3 w-3" />
                                        <span>Malware Path:</span>
                                        <span className="text-white font-mono break-all">
                                          {stealer.malware_path}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1 text-teal-400 text-xs">
                                        <Shield className="h-3 w-3" />
                                        <span>Antiviruses:</span>
                                        <span className="text-white font-mono">
                                          {stealer.antiviruses.length > 0
                                            ? stealer.antiviruses.join(", ")
                                            : "None detected"}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-1 text-teal-400 text-xs mb-1">
                                        <Lock className="h-3 w-3" />
                                        <span>Top Passwords:</span>
                                      </div>
                                      <div className="flex flex-wrap gap-1">
                                        {stealer.top_passwords.map((password, i) => (
                                          <span
                                            key={i}
                                            className="bg-teal-400/10 text-teal-400 border border-teal-400/20 px-2 py-0.5 rounded font-mono text-xs"
                                          >
                                            {password}
                                          </span>
                                        ))}
                                      </div>
                                      <div className="flex items-center gap-1 text-teal-400 text-xs mb-1 mt-2">
                                        <User className="h-3 w-3" />
                                        <span>Top Logins:</span>
                                      </div>
                                      <div className="flex flex-wrap gap-1">
                                        {stealer.top_logins.map((login, i) => (
                                          <span
                                            key={i}
                                            className="bg-teal-400/10 text-teal-400 border border-teal-400/20 px-2 py-0.5 rounded font-mono text-xs"
                                          >
                                            {login}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* No Results Message */}
                        {infoStealerData.stealers.length === 0 && (
                          <div className="text-center py-8">
                            <div className="flex items-center justify-center mb-2">
                              <Shield className="h-10 w-10 text-teal-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-1">Good News!</h3>
                            <p className="text-white text-sm max-w-md mx-auto">
                              No info-stealer infections were found associated with this email
                              address.
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default FreetoolsResult;
