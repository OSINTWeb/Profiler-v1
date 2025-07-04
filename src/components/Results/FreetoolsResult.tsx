"use client";
import {
  X,
  Mail,
  ExternalLink,
  MapPin,
  User,
  Building,
  Hash,
  Eye,
  CheckCircle,
  FileText,
  Github,
  Link,
  AlertCircle,
  Calendar,
  Computer,
  HardDrive,
  Shield,
  Wifi,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";

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

const FreetoolsResult = ({
  results,
  selectedTool,
}: {
  results: ApiResult[];
  selectedTool: string;
}) => {


  const exportToJSON = (data: LinkookData) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `linkook_${data.username}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToCSV = (data: LinkookData) => {
    const csvContent = [
      "Site,URL,Linked Accounts",
      ...data.sites.map(
        (site) => `"${site.site}","${site.url}","${site.linked_accounts?.join("; ") || "None"}"`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `linkook_${data.username}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToDOCX = (data: LinkookData) => {
    const txtContent = [
      `Linkook Results for: ${data.username}`,
      `Found Accounts: ${data.found_accounts}`,
      "",
      ...data.sites.map((site) =>
        [
          `Site: ${site.site}`,
          `URL: ${site.url}`,
          ...(site.linked_accounts
            ? ["Linked Accounts:", ...site.linked_accounts.map((acc) => `  - ${acc}`)]
            : ["Linked Accounts: None"]),
          "",
        ].join("\n")
      ),
    ].join("\n");

    const blob = new Blob([txtContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `linkook_${data.username}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return (
    <div className="w-full  px-4 flex flex-col items-center justify-center gap-4">
      {selectedTool}
      {/* {results.map((result, index) => (
        <div key={index} className="bg-[#18181B] rounded-xl p-6 border border-zinc-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">{result.tool}</h3>
            <span className="text-sm text-zinc-400">
              {new Date(result.timestamp).toLocaleTimeString()}
            </span>
          </div>

          <div className="mb-3">
            <span className="text-zinc-400">Query: </span>
            <span className="text-white font-mono bg-[#27272A] px-2 py-1 rounded">
              {result.query}
            </span>
          </div>

          {result.loading && (
            <div className="flex items-center gap-2 text-blue-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
              <span>Loading...</span>
            </div>
          )}

          {result.error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="text-red-400 font-semibold mb-2">Error:</div>
              <div className="text-red-300 text-sm">{result.error}</div>
            </div>
          )}

          {result.data && !result.loading && (
            <div className="bg-[#27272A] rounded-lg p-4">
              <div className="text-green-400 font-semibold mb-2">Result:</div>
              <pre className="text-zinc-300 text-sm overflow-x-auto whitespace-pre-wrap">
                {(() => {
                  if (typeof result.data === "string") {
                    return result.data;
                  }
                  return JSON.stringify(result.data, null, 2);
                })()}
              </pre>
            </div>
          )}
        </div>
      ))} */}
      {selectedTool === "TiktokerFinder" && (
        <div>
          {results.length > 0 &&
            results[0].data &&
            typeof results[0].data === "object" &&
            "profile" in results[0].data &&
            "stats" in results[0].data && (
              <div className="bg-[#18181B] text-[#CFCFCF] rounded-xl p-6 py-16 shadow-lg w-full max-w-4xl mx-auto">
                <div className="space-y-8 animate-fade-in">
                  <div className="flex flex-col md:flex-row items-center gap-10">
                    {/* Avatar */}
                    <div className="flex flex-col items-center gap-10">
                      <div className="w-28 h-28 rounded-full overflow-hidden border border-[#333536]">
                        <img
                          src={(results[0].data as TikTokData).profile["Avatar URL"]}
                          alt={(results[0].data as TikTokData).profile.Nickname}
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
            (results[0].data as GravatarData).entry.length > 0 && (
              <div className="w-full max-w-4xl mx-auto mt-8 overflow-hidden animate-slide-up">
                <div className="border border-white/20 rounded-xl p-8 bg-[#18181B] backdrop-blur-sm">
                  {(() => {
                    const profile = (results[0].data as GravatarData).entry[0];
                    return (
                      <div className="space-y-8">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row items-center gap-8">
                          {/* Profile Image */}
                          <div className="flex-shrink-0">
                            <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-zinc-800 border-4 border-teal-500/30 shadow-2xl">
                              <img
                                src={profile.thumbnailUrl}
                                alt={profile.displayName}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>
                          </div>

                          {/* Basic Info */}
                          <div className="flex-1 text-center md:text-left">
                            <div className="mb-4">
                              <span className="inline-block px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 text-sm font-medium mb-3 border border-teal-500/30">
                                Gravatar Profile
                              </span>
                              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                {profile.displayName}
                              </h1>
                              <p className="text-xl text-gray-300 mb-1">
                                @{profile.preferredUsername}
                              </p>
                              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400 mb-4">
                                <Mail className="h-4 w-4" />
                                <span className="text-sm">{results[0].query}</span>
                              </div>
                            </div>

                            {/* Basic Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              {profile.currentLocation && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-teal-400" />
                                  <span className="text-gray-300">{profile.currentLocation}</span>
                                </div>
                              )}
                              {profile.job_title && (
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-blue-400" />
                                  <span className="text-gray-300">{profile.job_title}</span>
                                </div>
                              )}
                              {profile.company && (
                                <div className="flex items-center gap-2">
                                  <Building className="h-4 w-4 text-purple-400" />
                                  <span className="text-gray-300">{profile.company}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Hash className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-400 font-mono text-xs">
                                  {profile.hash}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* About Section */}
                        {profile.aboutMe && (
                          <div className="bg-[#27272A] rounded-lg p-6 border border-zinc-700/50">
                            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                              <Eye className="h-5 w-5 text-teal-400" />
                              About
                            </h3>
                            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                              {profile.aboutMe}
                            </p>
                          </div>
                        )}

                        {/* Email Addresses */}
                        {profile.emails && profile.emails.length > 0 && (
                          <div className="bg-[#27272A] rounded-lg p-6 border border-zinc-700/50">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                              <Mail className="h-5 w-5 text-blue-400" />
                              Email Addresses
                            </h3>
                            <div className="space-y-2">
                              {profile.emails.map((email, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-3 p-3 bg-[#27272A] rounded-md"
                                >
                                  <Mail className="h-4 w-4 text-gray-400" />
                                  <span className="text-gray-300 font-mono">{email.value}</span>
                                  {email.primary === "true" && (
                                    <span className="px-2 py-1 bg-teal-500/20 text-teal-400 text-xs rounded-full border border-teal-500/30">
                                      Primary
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Social Accounts */}
                        {profile.accounts && profile.accounts.length > 0 && (
                          <div className="bg-[#27272A] rounded-lg p-6 border border-zinc-700/50">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                              <ExternalLink className="h-5 w-5 text-green-400" />
                              Social Accounts ({profile.accounts.length})
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {profile.accounts.map((account, idx) => (
                                <a
                                  key={idx}
                                  href={account.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block p-4 bg-[#27272A] rounded-lg border border-zinc-700/30 hover:border-zinc-600/50 transition-all duration-200 hover:bg-zinc-800/50 group"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0">
                                      <img
                                        src={account.iconUrl}
                                        alt={account.name}
                                        className="w-8 h-8 rounded-md"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-white group-hover:text-teal-400 transition-colors">
                                          {account.name}
                                        </span>
                                        {account.verified && (
                                          <CheckCircle className="h-4 w-4 text-blue-400" />
                                        )}
                                        {account.is_hidden && (
                                          <span className="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded border border-yellow-500/30">
                                            Hidden
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-gray-400 text-sm truncate">
                                        {account.display}
                                      </p>
                                      <p className="text-gray-500 text-xs">{account.domain}</p>
                                    </div>
                                    <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-teal-400 transition-colors" />
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Additional Photos */}
                        {profile.photos && profile.photos.length > 1 && (
                          <div className="bg-[#27272A] rounded-lg p-6 border border-zinc-700/50">
                            <h3 className="text-lg font-semibold text-white mb-4">
                              Additional Photos ({profile.photos.length})
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {profile.photos.map((photo, idx) => (
                                <div key={idx} className="relative group">
                                  <img
                                    src={photo.value}
                                    alt={`${profile.displayName} - ${photo.type}`}
                                    className="w-full h-24 object-cover rounded-lg border border-zinc-700/50 group-hover:border-teal-500/50 transition-colors"
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg" />
                                  <span className="absolute bottom-1 left-1 px-2 py-1 bg-black/70 text-white text-xs rounded">
                                    {photo.type}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Profile Link */}
                        {profile.profileUrl && (
                          <div className="text-center">
                            <a
                              href={profile.profileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 hover:text-teal-300 border border-teal-500/30 hover:border-teal-500/50 rounded-lg transition-all duration-200 font-medium"
                            >
                              <ExternalLink className="h-5 w-5" />
                              View Full Gravatar Profile
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )
          )}
        </div>
      )}
      {selectedTool === "Linkook" && (
        <div>
          {results.length > 0 &&
            results[0].data &&
            typeof results[0].data === "object" &&
            "username" in results[0].data &&
            "sites" in results[0].data && (
              <div className="w-full max-w-4xl mx-auto mt-8 overflow-hidden animate-slide-up">
                <div className="border border-white/20 rounded-xl p-8 bg-[#18181B] backdrop-blur-sm">
                  {(() => {
                    const linkookData = results[0].data as LinkookData;
                    return (
                      <div className="space-y-8">
                        {/* Header Section */}
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                          <div>
                            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium mb-3 border border-blue-500/30">
                              Linkook Results
                            </span>
                            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                              @{linkookData.username}
                            </h1>
                            <p className="text-xl text-gray-300">
                              Found {linkookData.found_accounts} connected accounts across{" "}
                              {linkookData.sites.length} platforms
                            </p>
                          </div>

                          {/* Export Buttons */}
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-zinc-800/50 hover:bg-zinc-700/50 border-zinc-600 text-white"
                              onClick={() => exportToCSV(linkookData)}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              CSV
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-zinc-800/50 hover:bg-zinc-700/50 border-zinc-600 text-white"
                              onClick={() => exportToDOCX(linkookData)}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              TXT
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-zinc-800/50 hover:bg-zinc-700/50 border-zinc-600 text-white"
                              onClick={() => exportToJSON(linkookData)}
                            >
                              <Github className="h-4 w-4 mr-2" />
                              JSON
                            </Button>
                          </div>
                        </div>

                        {/* Sites Grid */}
                        <div className="grid gap-4">
                          {linkookData.sites.map((site, index) => (
                            <div
                              key={`${site.site}-${index}`}
                              className="bg-[#27272A] rounded-lg border border-zinc-700/50 overflow-hidden hover:border-zinc-600/50 transition-colors"
                            >
                              {/* Site Header */}
                              <div className="p-6 border-b border-zinc-700/50">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center">
                                      <span className="text-sm font-bold text-blue-400">
                                        {site.site.charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                    <div>
                                      <h3 className="text-lg font-semibold text-white">
                                        {site.site}
                                      </h3>
                                      <p className="text-sm text-gray-400">Profile found</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    {site.linked_accounts && site.linked_accounts.length > 0 && (
                                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                                        {site.linked_accounts.length} linked
                                      </span>
                                    )}
                                    <a
                                      href={site.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 border border-blue-500/30 hover:border-blue-500/50 rounded-lg transition-all duration-200 text-sm font-medium"
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                      View Profile
                                    </a>
                                  </div>
                                </div>
                              </div>

                              {/* Site URL */}
                              <div className="px-6 py-3 bg-[#27272A]">
                                <div className="flex items-center gap-2 text-sm">
                                  <Link className="h-4 w-4 text-gray-400" />
                                  <span className="text-gray-400">URL:</span>
                                  <span className="text-gray-300 font-mono break-all">
                                    {site.url}
                                  </span>
                                </div>
                              </div>

                              {/* Linked Accounts */}
                              {site.linked_accounts && site.linked_accounts.length > 0 && (
                                <div className="p-6">
                                  <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                    <Hash className="h-4 w-4 text-green-400" />
                                    Linked Accounts ({site.linked_accounts.length})
                                  </h4>
                                  <div className="space-y-3">
                                    {site.linked_accounts.map((account, accIndex) => {
                                      const parts = account.split(": ");
                                      const platform = parts[0];
                                      const urls = parts.slice(1).join(": ").split(", ");

                                      return (
                                        <div
                                          key={accIndex}
                                          className="p-4 bg-[#27272A] rounded-lg border border-zinc-700/30"
                                        >
                                          <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                                              <span className="text-xs font-bold text-green-400">
                                                {platform.charAt(0).toUpperCase()}
                                              </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <p className="text-sm font-medium text-white mb-2">
                                                {platform}
                                              </p>
                                              <div className="space-y-1">
                                                {urls.map((url, urlIndex) => (
                                                  <a
                                                    key={urlIndex}
                                                    href={url.trim()}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block text-xs text-blue-400 hover:text-blue-300 hover:underline break-all transition-colors"
                                                  >
                                                    {url.trim()}
                                                  </a>
                                                ))}
                                              </div>
                                            </div>
                                            <ExternalLink className="h-4 w-4 text-gray-400 mt-1" />
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Summary */}
                        <div className="bg-[#27272A] rounded-lg p-6 border border-zinc-700/30">
                          <h3 className="text-lg font-semibold text-white mb-4">Summary</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                            <div className="p-4 bg-[#27272A] rounded-lg">
                              <div className="text-2xl font-bold text-blue-400">
                                {linkookData.found_accounts}
                              </div>
                              <div className="text-sm text-gray-400">Total Accounts</div>
                            </div>
                            <div className="p-4 bg-[#27272A] rounded-lg">
                              <div className="text-2xl font-bold text-green-400">
                                {linkookData.sites.length}
                              </div>
                              <div className="text-sm text-gray-400">Platforms</div>
                            </div>
                            <div className="p-4 bg-[#27272A] rounded-lg">
                              <div className="text-2xl font-bold text-purple-400">
                                {linkookData.sites.reduce(
                                  (acc, site) => acc + (site.linked_accounts?.length || 0),
                                  0
                                )}
                              </div>
                              <div className="text-sm text-gray-400">Linked Accounts</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
        </div>
      )}
      {selectedTool === "Proton Intelligence" && (
        <div>
          <h1>Proton Intelligence</h1>
        </div>
      )}
      {selectedTool === "Breach Guard" && (
        <div>
          {results.length > 0 && results[0].data && (
            <div className="w-full max-w-4xl mx-auto mt-8 overflow-hidden animate-slide-up">
              <div className="border border-white/20 rounded-xl p-8 bg-[#18181B] backdrop-blur-sm">
                {(() => {
                  // Parse the string data to extract breach information
                  let breachData: BreachEntry[] = [];
                  let parsedData: any = null;
                  
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
                    } else if ((results[0].data as any).breaches) {
                      breachData = (results[0].data as BreachGuardData).breaches;
                    }
                  }

                  return (
                    <div className="space-y-8">
                      {/* Header Section */}
                      <div className="text-center">
                        <span className="inline-block px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-medium mb-3 border border-red-500/30">
                          Breach Guard Analysis
                        </span>
                        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                          Data Breach Report
                        </h1>
                        <p className="text-xl text-gray-300">
                          Query: <span className="font-mono bg-[#27272A] px-2 py-1 rounded">{results[0].query}</span>
                        </p>
                      </div>

                      {/* Summary Statistics */}
                      <div className="bg-[#27272A] rounded-lg p-6 border border-zinc-700/50">
                        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                          <Shield className="h-5 w-5 text-red-400" />
                          Breach Summary
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="text-center p-6 bg-[#18181B] rounded-lg border border-zinc-700/30">
                            <div className="flex items-center justify-center mb-3">
                              <AlertCircle className="h-8 w-8 text-red-400" />
                            </div>
                            <div className="text-2xl font-bold text-red-400 mb-1">
                              {breachData.length}
                            </div>
                            <div className="text-sm text-gray-400 uppercase tracking-wide">
                              Total Breaches Found
                            </div>
                          </div>
                          <div className="text-center p-6 bg-[#18181B] rounded-lg border border-zinc-700/30">
                            <div className="flex items-center justify-center mb-3">
                              <Calendar className="h-8 w-8 text-orange-400" />
                            </div>
                            <div className="text-2xl font-bold text-orange-400 mb-1">
                              {breachData.filter(breach => breach.IsVerified !== false).length}
                            </div>
                            <div className="text-sm text-gray-400 uppercase tracking-wide">
                              Verified Breaches
                            </div>
                          </div>
                          <div className="text-center p-6 bg-[#18181B] rounded-lg border border-zinc-700/30">
                            <div className="flex items-center justify-center mb-3">
                              <Eye className="h-8 w-8 text-blue-400" />
                            </div>
                            <div className="text-2xl font-bold text-blue-400 mb-1">
                              {breachData.filter(breach => breach.IsSensitive).length}
                            </div>
                            <div className="text-sm text-gray-400 uppercase tracking-wide">
                              Sensitive Breaches
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Breach Details */}
                      {breachData.length > 0 ? (
                        <div className="space-y-6">
                          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-red-400" />
                            Detected Breaches ({breachData.length})
                          </h3>
                          {breachData.map((breach, index) => (
                            <div
                              key={index}
                              className="bg-[#27272A] rounded-lg border border-zinc-700/50 overflow-hidden"
                            >
                              {/* Breach Header */}
                              <div className="bg-red-500/10 border-b border-red-500/20 p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                  <div>
                                    <h4 className="text-lg font-semibold text-white mb-2">
                                      {breach.Name}
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-3">
                                      {breach.BreachDate && (
                                        <div className="flex items-center gap-2 text-red-400">
                                          <Calendar className="h-4 w-4" />
                                          <span className="text-sm">
                                            Breached: {new Date(breach.BreachDate).toLocaleDateString()}
                                          </span>
                                        </div>
                                      )}
                                      {breach.PwnCount && (
                                        <div className="flex items-center gap-2 text-orange-400">
                                          <User className="h-4 w-4" />
                                          <span className="text-sm">
                                            {breach.PwnCount.toLocaleString()} accounts affected
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {breach.IsVerified && (
                                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                                        Verified
                                      </span>
                                    )}
                                    {breach.IsSensitive && (
                                      <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full border border-red-500/30">
                                        Sensitive
                                      </span>
                                    )}
                                    {breach.IsSpamList && (
                                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full border border-yellow-500/30">
                                        Spam List
                                      </span>
                                    )}
                                    {breach.IsFabricated && (
                                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full border border-purple-500/30">
                                        Fabricated
                                      </span>
                                    )}
                                    {breach.IsRetired && (
                                      <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full border border-gray-500/30">
                                        Retired
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Breach Details */}
                              <div className="p-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                  {/* Basic Information */}
                                  <div>
                                    <h5 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                                      <Building className="h-5 w-5 text-blue-400" />
                                      Breach Information
                                    </h5>
                                    <div className="space-y-4">
                                      {breach.Domain && (
                                        <div>
                                          <div className="flex items-center gap-2 text-gray-400 mb-1">
                                            <Link className="h-4 w-4" />
                                            <span className="text-sm uppercase tracking-wide">Domain</span>
                                          </div>
                                          <p className="font-mono text-white bg-[#18181B] px-3 py-2 rounded border">
                                            {breach.Domain}
                                          </p>
                                        </div>
                                      )}
                                      {breach.Description && (
                                        <div>
                                          <div className="flex items-center gap-2 text-gray-400 mb-1">
                                            <FileText className="h-4 w-4" />
                                            <span className="text-sm uppercase tracking-wide">Description</span>
                                          </div>
                                          <p className="text-white bg-[#18181B] px-3 py-2 rounded border text-sm leading-relaxed">
                                            {breach.Description}
                                          </p>
                                        </div>
                                      )}
                                      {breach.AddedDate && (
                                        <div>
                                          <div className="flex items-center gap-2 text-gray-400 mb-1">
                                            <Calendar className="h-4 w-4" />
                                            <span className="text-sm uppercase tracking-wide">Added to Database</span>
                                          </div>
                                          <p className="font-mono text-white bg-[#18181B] px-3 py-2 rounded border">
                                            {new Date(breach.AddedDate).toLocaleDateString()}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Data Classes */}
                                  {breach.DataClasses && breach.DataClasses.length > 0 && (
                                    <div>
                                      <h5 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                                        <Lock className="h-5 w-5 text-red-400" />
                                        Compromised Data Types
                                      </h5>
                                      <div className="grid grid-cols-1 gap-2">
                                        {breach.DataClasses.map((dataClass, i) => (
                                          <span
                                            key={i}
                                            className="font-mono text-red-300 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded text-sm"
                                          >
                                            {dataClass}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="flex items-center justify-center mb-4">
                            <Shield className="h-16 w-16 text-green-400" />
                          </div>
                          <h3 className="text-xl font-semibold text-white mb-2">Good News!</h3>
                          <p className="text-gray-400 max-w-md mx-auto">
                            No data breaches were found for this query. Your information appears to be secure.
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
                <div className="border border-white/20 rounded-xl p-8 bg-[#18181B] backdrop-blur-sm">
                  {(() => {
                    const infoStealerData = results[0].data as InfoStealerData;
                    return (
                      <div className="space-y-8">
                        {/* Header Section */}
                        <div className="text-center">
                          <span className="inline-block px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-medium mb-3 border border-red-500/30">
                            Info-Stealer Lookup
                          </span>
                          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                            Analysis Complete
                          </h1>
                        </div>

                        {/* Message Alert */}
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                          <div className="flex items-start gap-4">
                            <div className="text-blue-400 mt-1">
                              <AlertCircle className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-blue-400 mb-2">Result</h3>
                              <p className="text-blue-300 leading-relaxed">{infoStealerData.message}</p>
                            </div>
                          </div>
                        </div>

                        {/* Summary Statistics */}
                        <div className="bg-[#27272A] rounded-lg p-6 border border-zinc-700/50">
                          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            <Eye className="h-5 w-5 text-teal-400" />
                            Summary Statistics
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center p-6 bg-[#27272A] rounded-lg border border-zinc-700/30">
                              <div className="flex items-center justify-center mb-3">
                                <Lock className="h-8 w-8 text-blue-400" />
                              </div>
                              <div className="text-2xl font-bold text-blue-400 mb-1">
                                {infoStealerData.total_corporate_services}
                              </div>
                              <div className="text-sm text-gray-400 uppercase tracking-wide">
                                Corporate Services
                              </div>
                            </div>
                            <div className="text-center p-6 bg-[#27272A] rounded-lg border border-zinc-700/30">
                              <div className="flex items-center justify-center mb-3">
                                <User className="h-8 w-8 text-green-400" />
                              </div>
                              <div className="text-2xl font-bold text-green-400 mb-1">
                                {infoStealerData.total_user_services}
                              </div>
                              <div className="text-sm text-gray-400 uppercase tracking-wide">
                                User Services
                              </div>
                            </div>
                            <div className="text-center p-6 bg-[#27272A] rounded-lg border border-zinc-700/30">
                              <div className="flex items-center justify-center mb-3">
                                <AlertCircle className="h-8 w-8 text-red-400" />
                              </div>
                              <div className="text-2xl font-bold text-red-400 mb-1">
                                {infoStealerData.stealers.length}
                              </div>
                              <div className="text-sm text-gray-400 uppercase tracking-wide">
                                Stealer Instances
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Stealer Details (if any found) */}
                        {infoStealerData.stealers.length > 0 && (
                          <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                              <Shield className="h-5 w-5 text-red-400" />
                              Detected Info-Stealer Instances
                            </h3>
                            {infoStealerData.stealers.map((stealer, index) => (
                              <div
                                key={index}
                                className="bg-[#27272A] rounded-lg border border-zinc-700/50 overflow-hidden"
                              >
                                {/* Stealer Header */}
                                <div className="bg-red-500/10 border-b border-red-500/20 p-6">
                                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div>
                                      <h4 className="text-lg font-semibold text-white mb-2">
                                        Stealer Instance #{index + 1}
                                        {stealer.stealer_family && ` - ${stealer.stealer_family}`}
                                      </h4>
                                      <div className="flex items-center gap-2 text-red-400">
                                        <Calendar className="h-4 w-4" />
                                        <span className="text-sm">
                                          Compromised: {new Date(stealer.date_compromised).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Stealer Details */}
                                <div className="p-6">
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* System Information */}
                                    <div>
                                      <h5 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                                        <Computer className="h-5 w-5 text-blue-400" />
                                        System Information
                                      </h5>
                                      <div className="space-y-4">
                                        <div>
                                          <div className="flex items-center gap-2 text-gray-400 mb-1">
                                            <Computer className="h-4 w-4" />
                                            <span className="text-sm uppercase tracking-wide">Computer Name</span>
                                          </div>
                                          <p className="font-mono text-white bg-[#27272A] px-3 py-2 rounded border">
                                            {stealer.computer_name}
                                          </p>
                                        </div>
                                        <div>
                                          <div className="flex items-center gap-2 text-gray-400 mb-1">
                                            <HardDrive className="h-4 w-4" />
                                            <span className="text-sm uppercase tracking-wide">Operating System</span>
                                          </div>
                                          <p className="font-mono text-white bg-[#27272A] px-3 py-2 rounded border">
                                            {stealer.operating_system}
                                          </p>
                                        </div>
                                        <div>
                                          <div className="flex items-center gap-2 text-gray-400 mb-1">
                                            <AlertCircle className="h-4 w-4" />
                                            <span className="text-sm uppercase tracking-wide">Malware Path</span>
                                          </div>
                                          <p className="font-mono text-white bg-[#27272A] px-3 py-2 rounded border break-all text-sm">
                                            {stealer.malware_path}
                                          </p>
                                        </div>
                                        <div>
                                          <div className="flex items-center gap-2 text-gray-400 mb-1">
                                            <Wifi className="h-4 w-4" />
                                            <span className="text-sm uppercase tracking-wide">IP Address</span>
                                          </div>
                                          <p className="font-mono text-white bg-[#27272A] px-3 py-2 rounded border">
                                            {stealer.ip}
                                          </p>
                                        </div>
                                        <div>
                                          <div className="flex items-center gap-2 text-gray-400 mb-2">
                                            <Shield className="h-4 w-4" />
                                            <span className="text-sm uppercase tracking-wide">Antiviruses</span>
                                          </div>
                                          {stealer.antiviruses.length > 0 ? (
                                            <div className="grid grid-cols-1 gap-2">
                                              {stealer.antiviruses.map((av, i) => (
                                                <span
                                                  key={i}
                                                  className="font-mono text-white bg-[#27272A] px-3 py-2 rounded border text-sm"
                                                >
                                                  {av}
                                                </span>
                                              ))}
                                            </div>
                                          ) : (
                                            <p className="text-gray-400 italic">None detected</p>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Compromised Credentials */}
                                    <div>
                                      <h5 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                                        <Lock className="h-5 w-5 text-red-400" />
                                        Compromised Credentials
                                      </h5>
                                      <div className="space-y-6">
                                        <div>
                                          <div className="flex items-center gap-2 text-gray-400 mb-3">
                                            <Lock className="h-4 w-4" />
                                            <span className="text-sm uppercase tracking-wide">Top Passwords (Masked)</span>
                                          </div>
                                          <div className="grid grid-cols-1 gap-2">
                                            {stealer.top_passwords.map((password, i) => (
                                              <span
                                                key={i}
                                                className="font-mono text-red-300 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded text-sm"
                                              >
                                                {password}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="flex items-center gap-2 text-gray-400 mb-3">
                                            <User className="h-4 w-4" />
                                            <span className="text-sm uppercase tracking-wide">Top Logins (Masked)</span>
                                          </div>
                                          <div className="grid grid-cols-1 gap-2">
                                            {stealer.top_logins.map((login, i) => (
                                              <span
                                                key={i}
                                                className="font-mono text-orange-300 bg-orange-500/10 border border-orange-500/20 px-3 py-2 rounded text-sm"
                                              >
                                                {login}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
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
                          <div className="text-center py-12">
                            <div className="flex items-center justify-center mb-4">
                              <Shield className="h-16 w-16 text-green-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Good News!</h3>
                            <p className="text-gray-400 max-w-md mx-auto">
                              No info-stealer infections were found associated with this email address.
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
