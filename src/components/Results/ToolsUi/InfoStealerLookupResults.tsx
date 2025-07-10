"use client";
import React from "react";
import {
  AlertCircle,
  Computer,
  HardDrive,
  Shield,
  Wifi,
  Lock,
  User,
} from "lucide-react";

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

interface InfoStealerLookupResultsProps {
  data: InfoStealerData | null;
}

const InfoStealerLookupResults: React.FC<InfoStealerLookupResultsProps> = ({ data }) => {
  if (!data || !("message" in data) || !("stealers" in data)) {
    return null;
  }

  const infoStealerData = data as InfoStealerData;

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 overflow-hidden animate-slide-up">
      <div className="rounded-xl p-6 bg-[#18181B] shadow-xl">
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
      </div>
    </div>
  );
};

export default InfoStealerLookupResults; 