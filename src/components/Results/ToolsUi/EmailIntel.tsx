// EmailResult type defined locally since it is missing from the codebase
export interface EmailResult {
  email: string;
  summary: {
    checked: number;
    time: string;
  };
  used: string[];
  not_used: string[];
  rate_limited: string[];
}

import { Card } from "@/components/ui/card";
import { Clock, Hash, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Check, X, AlertTriangle, ExternalLink } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SummaryCardProps {
  results: EmailResult | null;
}

export function SummaryCard({ results }: SummaryCardProps) {
  if (!results) return null;

  return (
    <Card className="bg-black/50 text-white border-white/20 p-4 mb-6 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center">
          <Mail className="h-5 w-5 mr-2 text-teal-400" />
          <span className="font-medium mr-1 text-white">Email:</span>
          <div className="flex items-center justify-center">
            <span className="text-white text-center text-[12px] md:text-[16px] font-bold font-mono">{results.email}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <Hash className="h-5 w-5 mr-2 text-teal-400" />
            <span className="font-medium mr-1 text-white">Platforms Checked:</span>
            <span className="text-white">{results.summary.checked}</span>
          </div>

          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-teal-400" />
            <span className="font-medium mr-1 text-white">Process Time:</span>
            <span className="text-white">{results.summary.time}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

interface ResultsGridProps {
  results: EmailResult | null;
}

export function ResultsGrid({ results }: ResultsGridProps) {
  if (!results) return null;

  const renderDomain = (domain: string) => {
    if (domain.includes(" / ")) {
      const parts = domain.split(" / ");
      const domainName = parts[0];
      const extraInfo = parts.slice(1).join(" / ");

      return (
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="font-medium text-teal-400">{domainName}</span>
            {extraInfo.includes("http") && (
              <a
                href={extraInfo.match(/(https?:\/\/[^\s]+)/)?.[0] || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-pink-400 hover:text-pink-300 transition-colors"
              >
                <ExternalLink size={14} />
              </a>
            )}
          </div>
          <span className="text-xs text-gray-400">{extraInfo}</span>
        </div>
      );
    }

    return (
     <div>
       <div className="flex items-center group">
              <div className="w-4 h-4 mr-2">{getFavicon(domain)}</div>
              <span className="group-hover:text-teal-400 transition-colors text-white">{domain}</span>
            </div>
     </div>
    );
  };

  const getFavicon = (domain: string) => {
    const baseDomain = domain.replace(/^https?:\/\//, "").split("/")[0].split(" ")[0];;
    return (
      <img
        src={`https://www.google.com/s2/favicons?domain=${baseDomain}.com`}
        alt={domain}
        className="w-4 h-4"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10 w-full">
      {/* Used Card */}
      <Card className="bg-black/50 border-2 border-green-500/50 hover:border-green-400/70 transition-all p-4 overflow-hidden shadow-lg backdrop-blur-sm">
        <div className="flex items-center text-green-400 mb-4">
          <Check className="mr-2 text-green-400" />
          <h3 className="text-lg font-semibold text-white">Used ({results.used.length})</h3>
        </div>
        <Separator className="mb-4 bg-white/20" />
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {results.used
            .filter((d: string) => !d.includes("Email used"))
            .map((domain: string, index: number) => (
              <div
                key={`used-${index}`}
                className="py-2 px-3 rounded-md bg-white/10 hover:bg-white/20 transition-colors border-l-2 border-green-500 text-white"
              >
                {renderDomain(domain)}
              </div>
            ))}
        </div>
      </Card>

      {/* Not Used Card */}
      <Card className="bg-black/50 border-2 border-red-500/50 hover:border-red-400/70 transition-all p-4 overflow-hidden shadow-lg backdrop-blur-sm">
        <div className="flex items-center text-red-400 mb-4">
          <X className="mr-2 text-red-400" />
          <h3 className="text-lg font-semibold text-white">Not Used ({results.not_used.length})</h3>
        </div>
        <Separator className="mb-4 bg-white/20" />
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {results.not_used.map((domain: string, index: number) => (
            <div
              key={`not-used-${index}`}
              className="py-2 px-3 rounded-md bg-white/10 hover:bg-white/20 transition-colors border-l-2 border-red-500 text-white"
            >
              {renderDomain(domain)}
            </div>
          ))}
        </div>
      </Card>

      {/* Rate Limited Card */}
      <Card className="bg-black/50 border-2 border-yellow-500/50 hover:border-yellow-400/70 transition-all p-4 overflow-hidden shadow-lg backdrop-blur-sm">
        <div className="flex items-center text-yellow-400 mb-4">
          <AlertTriangle className="mr-2 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">
            Rate Limited ({results.rate_limited.length})
          </h3>
        </div>
        <Separator className="mb-4 bg-white/20" />
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {results.rate_limited.map((domain: string, index: number) => (
            <div
              key={`rate-limited-${index}`}
              className="py-2 px-3 rounded-md bg-white/10 hover:bg-white/20 transition-colors border-l-2 border-yellow-500 text-white"
            >
                {renderDomain(domain)}
            </div>
          ))}
        </div>
      </Card>

      <style>
        {`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
        `}
      </style>
    </div>
  );
}
