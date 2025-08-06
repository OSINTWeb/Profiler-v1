"use client";
import React, { useState } from "react";
import { AlertCircle, Shield, Grid, List, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate, formatDateShort, getRelativeTime } from "../utils/dateUtils";
import { BreachEntry } from "../utils/advancedTypes";

interface BreachGuardResultsProps {
  data: BreachEntry[] | string | null;
  query: string;
}

type ViewMode = 'grid' | 'list';

const BreachGuardResults: React.FC<BreachGuardResultsProps> = ({ data }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  if (!data) {
    return null;
  }

  // Parse the string data to extract breach information
  let breachData: BreachEntry[] = [];

  if (typeof data === "string") {
    try {
      // Extract JSON array from the API route response string
      const jsonMatch = data.match(/Parsed JSON data: (\[.*\])/);
      if (jsonMatch) {
        const parsedData = JSON.parse(jsonMatch[1]);
        breachData = Array.isArray(parsedData) ? parsedData : [];
      }
    } catch (error) {
      console.error("Failed to parse breach data:", error);
    }
  } else if (Array.isArray(data)) {
    breachData = data;
  }

  // Helper function to get icon for data class
  const getDataClassIcon = (dataClass: string) => {
    const lower = dataClass.toLowerCase();
    if (lower.includes('email')) return '📧';
    if (lower.includes('password')) return '🔒';
    if (lower.includes('credit') || lower.includes('card')) return '💳';
    if (lower.includes('phone')) return '📱';
    if (lower.includes('address')) return '📍';
    if (lower.includes('name')) return '👤';
    if (lower.includes('username')) return '👤';
    if (lower.includes('ip')) return '🌐';
    if (lower.includes('message')) return '💬';
    return '📄';
  };

  const GridView = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {breachData.map((breach, index) => (
        <div key={index} className="bg-black/50 border border-white/20 rounded-lg p-4 hover:border-teal-400/50 transition-colors backdrop-blur-sm">
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            {breach.LogoPath ? (
              <img 
                src={breach.LogoPath} 
                alt={`${breach.Name} logo`} 
                className="w-12 h-12 object-contain rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center">
                <Shield className="w-6 h-6 text-teal-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white truncate">{breach.Name}</h3>
              <p className="text-sm text-white/60">{breach.Domain}</p>
            </div>
          </div>

          {/* Breach Info */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-teal-400" />
              <span className="text-white/80">
                {formatDateShort(breach.BreachDate)} • {getRelativeTime(breach.BreachDate)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-teal-400" />
              <span className="text-white/80">
                {breach.PwnCount.toLocaleString()} accounts affected
              </span>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-1 mb-3">
            {breach.IsVerified && (
              <span className="px-2 py-1 bg-teal-400/20 text-teal-400 text-xs rounded border border-teal-400/30">
                Verified
              </span>
            )}
            {breach.IsSensitive && (
              <span className="px-2 py-1 bg-white/20 text-white text-xs rounded border border-white/30">
                Sensitive
              </span>
            )}
            {breach.IsFabricated && (
              <span className="px-2 py-1 bg-white/20 text-white text-xs rounded border border-white/20">
                Fabricated
              </span>
            )}
            {breach.IsSpamList && (
              <span className="px-2 py-1 bg-white/20 text-white text-xs rounded border border-white/20">
                Spam List
              </span>
            )}
          </div>

          {/* Data Classes */}
          <div className="mb-3">
            <p className="text-xs text-teal-400 mb-2">Compromised Data:</p>
            <div className="flex flex-wrap gap-1">
              {breach.DataClasses.slice(0, 4).map((dataClass, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-white/10 text-xs rounded border border-white/20">
                  <span>{getDataClassIcon(dataClass)}</span>
                  <span className="text-white">{dataClass}</span>
                </span>
              ))}
              {breach.DataClasses.length > 4 && (
                <span className="px-2 py-1 bg-white/10 text-xs rounded text-white/60 border border-white/20">
                  +{breach.DataClasses.length - 4} more
                </span>
              )}
            </div>
          </div>

          {/* Description Preview */}
          <div className="text-xs text-white/60 line-clamp-2">
            {breach.Description.replace(/<[^>]*>/g, '')}
          </div>
        </div>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="space-y-3">
      {breachData.map((breach, index) => (
        <div key={index} className="bg-black/50 border border-white/20 rounded-lg p-4 hover:border-teal-400/50 transition-colors backdrop-blur-sm">
          <div className="flex items-start gap-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              {breach.LogoPath ? (
                <img 
                  src={breach.LogoPath} 
                  alt={`${breach.Name} logo`} 
                  className="w-16 h-16 object-contain rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-16 h-16 bg-white/10 rounded flex items-center justify-center">
                  <Shield className="w-8 h-8 text-teal-400" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-white text-lg">{breach.Name}</h3>
                  <p className="text-sm text-white/60">{breach.Domain}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {breach.IsVerified && (
                    <span className="px-2 py-1 bg-teal-400/20 text-teal-400 text-xs rounded border border-teal-400/30">
                      Verified
                    </span>
                  )}
                  {breach.IsSensitive && (
                    <span className="px-2 py-1 bg-white/20 text-white text-xs rounded border border-white/30">
                      Sensitive
                    </span>
                  )}
                </div>
              </div>

              {/* Info Row */}
              <div className="flex items-center gap-6 mb-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-400" />
                  <span className="text-white/80">
                    {formatDate(breach.BreachDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-teal-400" />
                  <span className="text-white/80">
                    {breach.PwnCount.toLocaleString()} accounts
                  </span>
                </div>
              </div>

              {/* Data Classes */}
              <div className="mb-3">
                <p className="text-xs text-teal-400 mb-2">Compromised Data:</p>
                <div className="flex flex-wrap gap-1">
                  {breach.DataClasses.map((dataClass, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-white/10 text-xs rounded border border-white/20">
                      <span>{getDataClassIcon(dataClass)}</span>
                      <span className="text-white">{dataClass}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="text-sm text-white/80">
                {breach.Description.replace(/<[^>]*>/g, '')}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full mx-auto mt-8 overflow-hidden animate-slide-up">
        <div className="border border-white/20 rounded-xl p-6 bg-black/50 backdrop-blur-sm">
          <div className="space-y-6">
            {/* Header Section */}
            <div className="text-center space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-teal-400/20 text-teal-400 text-sm font-medium border border-teal-400/30">
                Breach Guard
              </span>
              <h1 className="text-3xl font-bold text-white">Data Breach Report</h1>
            </div>

            {/* Summary Statistics with View Toggle */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/20 flex flex-col md:flex-row items-center justify-center gap-4 text-center backdrop-blur-sm">
              <div className="flex-1 flex flex-col items-center gap-1">
                <span className="text-2xl font-bold text-teal-400">
                  {breachData.length}
                </span>
                <span className="text-sm text-white">Total Breaches</span>
              </div>
              <div className="w-px h-8 bg-white/20 hidden md:block" />
              <div className="flex-1 flex flex-col items-center gap-1">
                <span className="text-2xl font-bold text-teal-400">
                  {breachData.filter((breach) => breach.IsVerified).length}
                </span>
                <span className="text-sm text-white">Verified</span>
              </div>
              <div className="w-px h-8 bg-white/20 hidden md:block" />
              <div className="flex-1 flex flex-col items-center gap-1">
                <span className="text-2xl font-bold text-teal-400">
                  {breachData.filter((breach) => breach.IsSensitive).length}
                </span>
                <span className="text-sm text-white">Sensitive</span>
              </div>
              <div className="w-px h-8 bg-white/20 hidden md:block" />
              <div className="flex items-center gap-2 bg-black/50 rounded-lg p-1 border border-white/20">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`h-8 w-8 p-0 ${viewMode === 'grid' ? 'bg-teal-400 text-black' : 'text-white hover:text-black hover:bg-white'}`}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`h-8 w-8 p-0 ${viewMode === 'list' ? 'bg-teal-400 text-black' : 'text-white hover:text-black hover:bg-white'}`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Breach Results */}
            {breachData.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-teal-400 text-lg font-semibold">
                    <AlertCircle className="h-5 w-5" />
                    Found {breachData.length} breach{breachData.length !== 1 ? 'es' : ''}
                  </div>
                  <div className="text-sm text-white/60">
                    Showing {viewMode} view
                  </div>
                </div>
                
                {viewMode === 'grid' ? <GridView /> : <ListView />}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="flex items-center justify-center mb-4">
                  <Shield className="h-16 w-16 text-teal-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">Good News!</h3>
                <p className="text-white/80 text-lg max-w-md mx-auto">
                  No data breaches were found for this query. Your information appears to be secure.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreachGuardResults;
