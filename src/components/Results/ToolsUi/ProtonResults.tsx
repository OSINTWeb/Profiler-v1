import { ProtonResult } from "@/types/proton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow, fromUnixTime, format } from "date-fns";
import { toast } from "sonner";
import { Shield, Key, Calendar, CheckCircle, XCircle, Copy } from "lucide-react";
import NoResultFound from "./NoResultFound";

interface ProtonResultsProps {
  result: unknown;
}

export default function ProtonResults({ result }: ProtonResultsProps) {
  if (!result) {
    return <NoResultFound toolName="Proton" message="No Proton key data found." />;
  }

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
      <Card className="overflow-hidden border-white/20 p-6 bg-[#17181a] shadow-xl">
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
} 