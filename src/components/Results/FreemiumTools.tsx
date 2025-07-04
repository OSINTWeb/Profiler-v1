"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

interface FreemiumToolsProps {
  results: LinkedInProfile | EmailIntelResults | Record<string, unknown> | null;
  selectedTool: string;
  loading?: boolean;
}

// Add helper functions at the top of the file after the interfaces
const renderObject = (obj: unknown, depth = 0): string => {
  if (depth > 3) return '[Nested Object]'; // Prevent infinite recursion
  if (obj === null) return 'null';
  if (obj === undefined) return 'undefined';
  if (typeof obj === 'string') return obj;
  if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);
  
  if (Array.isArray(obj)) {
    return obj.map(item => renderObject(item, depth + 1)).join(', ');
  }
  
  if (typeof obj === 'object') {
    try {
      const entries = Object.entries(obj as Record<string, unknown>);
      if (entries.length === 0) return '{}';
      return `{ ${entries
        .map(([key, value]) => `${key}: ${renderObject(value, depth + 1)}`)
        .join(', ')} }`;
    } catch {
      return String(obj);
    }
  }
  return String(obj);
};

const renderObjectAsTable = (obj: unknown, depth = 0): React.ReactElement => {
  if (depth > 5) return <span className="text-zinc-300">[Maximum Depth Reached]</span>;
  
  if (typeof obj !== 'object' || obj === null) {
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
                  <span className="ml-2 text-zinc-400 text-sm">
                    ({value.length} items)
                  </span>
                )}
              </td>
              <td className="p-2 border border-zinc-700 text-zinc-300">
                {typeof value === 'object' && value !== null ? (
                  <details>
                    <summary className="cursor-pointer text-zinc-400 hover:text-zinc-300 flex items-center gap-2">
                      <span>View Details</span>
                      {Array.isArray(value) && (
                        <span className="text-xs bg-zinc-700 px-2 py-1 rounded">
                          {value.length} items
                        </span>
                      )}
                    </summary>
                    <div className="mt-2 pl-4">
                      {renderObjectAsTable(value, depth + 1)}
                    </div>
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
              <div className="w-2 h-2 bg-zinc-300 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-zinc-300 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        </Card>
      </div>
    );
  }
  
  if (selectedTool === "Mail2Linkedin" && results) {
    const profile = results as LinkedInProfile;
    
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header Section */}
        <Card className="border border-zinc-700 bg-[#18181B] shadow-lg">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <img
                  src={profile.photoUrl}
                  alt={profile.displayName}
                  className="w-32 h-32 rounded-full border-4 border-zinc-700 object-cover"
                />
              </div>
              
              {/* Basic Info */}
              <div className="flex-1 space-y-3">
                <div>
                  <h1 className="text-3xl font-bold text-white">{profile.displayName}</h1>
                  <p className="text-lg text-zinc-300 mt-1">{profile.headline}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">Company:</span>
                    <span className="text-zinc-300">{profile.companyName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">Location:</span>
                    <span className="text-zinc-300">{profile.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">Connections:</span>
                    <span className="text-zinc-300">
                      {profile.connectionCount}{profile.isConnectionCountObfuscated ? "+" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">Locale:</span>
                    <span className="text-zinc-300">
                      {profile.locale.language.toUpperCase()} - {profile.locale.country.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">Profile Status:</span>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      profile.isPublic ? "bg-green-900 text-green-100" : "bg-red-900 text-red-100"
                    }`}>
                      {profile.isPublic ? "Public" : "Private"}
                    </span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-3">
                  <Button 
                    onClick={() => window.open(profile.linkedInUrl, '_blank')}
                    className="bg-white text-[#18181B] hover:bg-zinc-200"
                  >
                    View LinkedIn Profile
                  </Button>
                  <Button 
                    onClick={() => window.open(profile.reportProfileUrl, '_blank')}
                    variant="outline"
                    className="border-white text-white hover:bg-zinc-800"
                  >
                    Report Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Skills Section */}
        {profile.skills && profile.skills.length > 0 && (
          <Card className="border border-zinc-700 bg-[#18181B] shadow-lg">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Skills ({profile.skills.length})</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Education Section */}
        {profile.schools && profile.schools.educationsCount > 0 && (
          <Card className="border border-zinc-700 bg-[#18181B] shadow-lg">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                Education ({profile.schools.educationsCount})
              </h2>
              <div className="space-y-4">
                {Array.isArray(profile.schools.educationHistory) && 
                  profile.schools.educationHistory.map((education, index) => (
                    <div key={index} className="border-l-4 border-white pl-6 py-4 bg-zinc-800 rounded-r-lg">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="text-lg font-bold text-white">
                            {renderObject(education.schoolName || `Education ${index + 1}`)}
                          </h3>
                          <span className="text-sm text-zinc-300 bg-[#18181B] px-2 py-1 rounded border border-zinc-700">
                            #{index + 1}
                          </span>
                        </div>
                        
                        {(education.degree || education.degreeName) && (
                          <div className="text-white font-medium">
                            <span className="text-zinc-400">Degree: </span>
                            {renderObject(education.degree || education.degreeName)}
                          </div>
                        )}
                        
                        {(education.field || education.fieldOfStudy) && (
                          <div className="text-zinc-300">
                            <span className="text-zinc-400">Field: </span>
                            {renderObject(education.field || education.fieldOfStudy)}
                          </div>
                        )}
                        
                        {(education.startDate || education.endDate) && (
                          <div className="text-zinc-300 text-sm">
                            <span className="text-zinc-400">Duration: </span>
                            {renderObject(education.startDate || 'Unknown')} - {renderObject(education.endDate || 'Present')}
                          </div>
                        )}
                        
                        {education.activities && (
                          <div className="text-zinc-300 text-sm">
                            <span className="text-zinc-400">Activities: </span>
                            {renderObject(education.activities)}
                          </div>
                        )}
                        
                        {education.description && (
                          <div className="text-zinc-300 text-sm mt-2 p-2 bg-[#18181B] rounded border">
                            {typeof education.description === 'object' 
                              ? renderObjectAsTable(education.description)
                              : renderObject(education.description)}
                          </div>
                        )}
                        
                        <details className="mt-3">
                          <summary className="text-xs text-zinc-400 cursor-pointer hover:text-zinc-300 flex items-center gap-1">
                            <span>🔍</span> View All Available Data
                          </summary>
                          <div className="text-xs text-zinc-400 mt-2 p-3 bg-[#18181B] rounded border border-zinc-700">
                            <div className="font-medium mb-2">Available Fields:</div>
                            {renderObjectAsTable(education)}
                          </div>
                        </details>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </Card>
        )}

        {/* Work Experience Section */}
        {profile.positions && profile.positions.positionsCount > 0 && (
          <Card className="border border-zinc-700 bg-[#18181B] shadow-lg">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                Work Experience ({profile.positions.positionsCount})
              </h2>
              <div className="space-y-4">
                {Array.isArray(profile.positions.positionHistory) &&
                  profile.positions.positionHistory.map((position, index) => (
                    <div key={index} className="border-l-4 border-white pl-6 py-4 bg-zinc-800 rounded-r-lg">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white">
                              {renderObject(position.title || position.jobTitle || `Position ${index + 1}`)}
                            </h3>
                            <h4 className="text-base font-semibold text-zinc-300 mt-1">
                              {renderObject(position.companyName || 'Company not specified')}
                            </h4>
                          </div>
                          <span className="text-sm text-zinc-300 bg-[#18181B] px-2 py-1 rounded border border-zinc-700">
                            #{index + 1}
                          </span>
                        </div>
                        
                        {(position.startDate || position.endDate) && (
                          <div className="text-zinc-300 text-sm">
                            <span className="text-zinc-400">Duration: </span>
                            {renderObject(position.startDate || 'Unknown')} - {renderObject(position.endDate || 'Present')}
                          </div>
                        )}
                        
                        {position.location && (
                          <div className="text-zinc-300 text-sm">
                            <span className="text-zinc-400">Location: </span>
                            {renderObject(position.location)}
                          </div>
                        )}
                        
                        {(position.description || position.summary) && (
                          <div className="text-zinc-300 text-sm mt-3 p-3 bg-[#18181B] rounded border">
                            <span className="text-zinc-400 font-medium">Description: </span>
                            <div className="mt-1">
                              {typeof position.description === 'object' || typeof position.summary === 'object'
                                ? renderObjectAsTable(position.description || position.summary)
                                : renderObject(position.description || position.summary)}
                            </div>
                          </div>
                        )}
                        
                        <details className="mt-3">
                          <summary className="text-xs text-zinc-400 cursor-pointer hover:text-zinc-300 flex items-center gap-1">
                            <span>🔍</span> View All Available Data
                          </summary>
                          <div className="text-xs text-zinc-400 mt-2 p-3 bg-[#18181B] rounded border border-zinc-700">
                            <div className="font-medium mb-2">Available Fields:</div>
                            {renderObjectAsTable(position)}
                          </div>
                        </details>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </Card>
        )}

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Skill Endorsements */}
          <Card className="border border-zinc-700 bg-[#18181B] shadow-lg">
            <div className="p-4">
              <h3 className="text-lg font-bold text-white mb-2">Skill Endorsements</h3>
              <div className="text-2xl font-bold text-zinc-300">
                {profile.skillEndorsements.skillEndorsementsCount}
              </div>
              <div className="text-sm text-zinc-400">Total Endorsements</div>
            </div>
          </Card>

          {/* News Mentions */}
          <Card className="border border-zinc-700 bg-[#18181B] shadow-lg">
            <div className="p-4">
              <h3 className="text-lg font-bold text-white mb-2">News Mentions</h3>
              <div className="text-2xl font-bold text-zinc-300">
                {profile.newsMentions.newsMentionCount}
              </div>
              <div className="text-sm text-zinc-400">Media Coverage</div>
            </div>
          </Card>

          {/* User Generated Content */}
          <Card className="border border-zinc-700 bg-[#18181B] shadow-lg">
            <div className="p-4">
              <h3 className="text-lg font-bold text-white mb-2">Posts & Content</h3>
              <div className="text-2xl font-bold text-zinc-300">
                {profile.userGeneratedContents.userGeneratedContentCount}
              </div>
              <div className="text-sm text-zinc-400">Published Content</div>
            </div>
          </Card>
        </div>

        {/* Contact Information */}
        <Card className="border border-zinc-700 bg-[#18181B] shadow-lg">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">Profile ID:</span>
                <span className="text-zinc-300 font-mono text-sm break-all">{profile.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">First Name:</span>
                <span className="text-zinc-300">{profile.firstName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">Last Name:</span>
                <span className="text-zinc-300">{profile.lastName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">Phone Numbers:</span>
                <span className="text-zinc-300">
                  {profile.phoneNumbers.length > 0 ? profile.phoneNumbers.join(", ") : "Not available"}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }
  if (selectedTool === "EmailIntel" && results) {
    const emailData = results as EmailIntelResults;
    
    // Group platforms by status for better organization
    const platformsByStatus = Object.entries(emailData.results).reduce((acc, [platform, status]) => {
      const statusKey = status || 'unknown';
      if (!acc[statusKey]) acc[statusKey] = [];
      acc[statusKey].push(platform);
      return acc;
    }, {} as Record<string, string[]>);

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'found': return 'bg-green-900 text-green-100 border-green-700';
        case 'not_found': return 'bg-zinc-800 text-zinc-100 border-zinc-700';
        case 'rate_limited': return 'bg-yellow-900 text-yellow-100 border-yellow-700';
        case 'error': return 'bg-red-900 text-red-100 border-red-700';
        default: return 'bg-blue-900 text-blue-100 border-blue-700';
      }
    };

    const getStatusIcon = (status: string) => {
      switch (status) {
        case 'found': return '✓';
        case 'not_found': return '✗';
        case 'rate_limited': return '⏳';
        case 'error': return '⚠';
        default: return '?';
      }
    };

    const totalPlatforms = Object.keys(emailData.results).length;
    const foundCount = Object.values(emailData.results).filter(status => status === 'found').length;
    const notFoundCount = Object.values(emailData.results).filter(status => status === 'not_found').length;
    const rateLimitedCount = Object.values(emailData.results).filter(status => status === 'rate_limited').length;
    const errorCount = Object.values(emailData.results).filter(status => status === 'error').length;

    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Header Section */}
        <Card className="border border-zinc-700 bg-[#18181B] shadow-lg">
          <div className="p-6">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold text-white">Email Intelligence Report</h1>
              <div className="text-xl text-zinc-300 font-mono bg-zinc-800 p-3 rounded border">
                {emailData.email}
              </div>
              <p className="text-zinc-400">
                Comprehensive scan across {totalPlatforms} platforms and services
              </p>
            </div>
          </div>
        </Card>

        {/* Summary Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border border-green-900 bg-[#18181B] shadow-lg">
            <div className="p-4 text-center">
              <div className="text-3xl font-bold text-green-400">{foundCount}</div>
              <div className="text-sm text-zinc-300">Found</div>
              <div className="text-xs text-green-400">Active Accounts</div>
            </div>
          </Card>
          
          <Card className="border border-zinc-700 bg-[#18181B] shadow-lg">
            <div className="p-4 text-center">
              <div className="text-3xl font-bold text-zinc-300">{notFoundCount}</div>
              <div className="text-sm text-zinc-300">Not Found</div>
              <div className="text-xs text-zinc-400">No Account</div>
            </div>
          </Card>
          
          <Card className="border border-yellow-900 bg-[#18181B] shadow-lg">
            <div className="p-4 text-center">
              <div className="text-3xl font-bold text-yellow-400">{rateLimitedCount}</div>
              <div className="text-sm text-zinc-300">Rate Limited</div>
              <div className="text-xs text-yellow-400">Temporary Block</div>
            </div>
          </Card>
          
          <Card className="border border-red-900 bg-[#18181B] shadow-lg">
            <div className="p-4 text-center">
              <div className="text-3xl font-bold text-red-400">{errorCount}</div>
              <div className="text-sm text-zinc-300">Errors</div>
              <div className="text-xs text-red-400">Check Failed</div>
            </div>
          </Card>
        </div>

        {/* Detailed Results by Status */}
        {Object.entries(platformsByStatus).map(([status, platforms]) => (
          <Card key={status} className="border border-zinc-700 bg-[#18181B] shadow-lg">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(status)}`}>
                  {getStatusIcon(status)} {status.replace('_', ' ').toUpperCase()}
                </span>
                <span className="text-zinc-400 text-lg">({platforms.length})</span>
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {platforms.map((platform, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-2 text-center font-medium ${getStatusColor(status)} hover:shadow-md transition-shadow`}
                  >
                    <div className="text-sm">{getStatusIcon(status)}</div>
                    <div className="text-xs mt-1 capitalize font-bold">
                      {platform.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}

        {/* Platform List */}
        <Card className="border border-zinc-700 bg-[#18181B] shadow-lg">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">All Platforms Checked</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {Object.entries(emailData.results).map(([platform, status], index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-zinc-700 rounded-lg hover:bg-zinc-800"
                >
                  <div className="font-medium text-white capitalize">
                    {platform.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(status || 'unknown')}`}>
                    {getStatusIcon(status || 'unknown')} {(status || 'unknown').replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Security Notice */}
        <Card className="border border-zinc-700 bg-[#18181B] shadow-lg">
          <div className="p-6">
            <h3 className="text-lg font-bold text-white mb-2">🔒 Security Notice</h3>
            <p className="text-zinc-300 text-sm">
              This report shows where the email address <span className="font-mono font-bold text-white">{emailData.email}</span> has 
              registered accounts across various platforms. Results marked as &quot;found&quot; indicate active or previously active 
              accounts on those services. Rate-limited results may require manual verification.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // No results or null results
  if (!results && !loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <Card className="border border-zinc-700 bg-[#18181B] shadow-lg">
          <div className="p-8 text-center space-y-4">
            <div className="text-4xl text-zinc-400">📭</div>
            <h3 className="text-xl font-bold text-white">No Results Found</h3>
            <p className="text-zinc-300">
              We couldn&apos;t find any data for your {selectedTool} search. Please try a different query.
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
            <h2 className="text-xl font-bold text-white mb-4">Results for {selectedTool}</h2>
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
