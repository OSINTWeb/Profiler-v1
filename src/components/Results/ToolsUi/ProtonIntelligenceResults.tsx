"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle, XCircle, Shield, Key, Calendar } from "lucide-react";
import { formatDistanceToNow, fromUnixTime, format } from "date-fns";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { ProtonResult } from "@/types/proton";

interface ProtonIntelligenceResultsProps {
  data: unknown;
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
      <Card className="overflow-hidden border-white/20 p-6 bg-black/50 shadow-xl backdrop-blur-sm">
        <div>
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              <h2 className="text-xl font-semibold text-white">Proton Key Details</h2>
            </div>
            <div className="flex items-center gap-2">
              {result.isOfficialDomain ? (
                <span className="flex items-center gap-1 text-sm bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30">
                  <CheckCircle className="w-4 h-4" />
                  Official Domain
                </span>
              ) : (
                <span className="flex items-center gap-1 text-sm bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30">
                  <Shield className="w-4 h-4" />
                  Custom Domain
                </span>
              )}
            </div>
          </div>

          <Separator className="mb-6 bg-white/20" />

          {/* Key ID Section */}
          <div className="space-y-6">
            <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-400 font-medium">KEY ID</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(result.keyId, "Key ID")}
                  className="hover:bg-white/10 text-gray-400"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="mt-2 text-sm font-mono text-white break-all">{result.keyId}</p>
            </div>

            {/* Creation Date Section */}
            <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/20">
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
            <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/20">
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
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : isOldKey(result.creationDate)
                      ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
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
    if ("data" in raw) raw = (raw as { data: unknown }).data;
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

const ProtonIntelligenceResults: React.FC<ProtonIntelligenceResultsProps> = ({ data }) => {
  if (!data) {
    return null;
  }

  const parsedResult = parseProtonResult(data);
  
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <ResultCard result={parsedResult} />
    </div>
  );
};

export default ProtonIntelligenceResults; 