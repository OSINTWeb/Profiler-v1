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

const FreemiumTools = ({ results, selectedTool, loading = false }: FreemiumToolsProps) => {
  
  // Loading state
  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <Card className="border border-gray-300 bg-white shadow-lg">
          <div className="p-8 text-center space-y-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            <h3 className="text-xl font-bold text-black">Processing {selectedTool} Request</h3>
            <p className="text-gray-600">
              {selectedTool === "Mail2Linkedin" 
                ? "Searching LinkedIn profiles..." 
                : selectedTool === "EmailIntel" 
                ? "Scanning platforms for email intelligence..." 
                : "Processing your request..."}
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
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
        <Card className="border border-gray-300 bg-white shadow-lg">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <img
                  src={profile.photoUrl}
                  alt={profile.displayName}
                  className="w-32 h-32 rounded-full border-4 border-gray-300 object-cover"
                />
              </div>
              
              {/* Basic Info */}
              <div className="flex-1 space-y-3">
                <div>
                  <h1 className="text-3xl font-bold text-black">{profile.displayName}</h1>
                  <p className="text-lg text-gray-700 mt-1">{profile.headline}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-black">Company:</span>
                    <span className="text-gray-700">{profile.companyName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-black">Location:</span>
                    <span className="text-gray-700">{profile.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-black">Connections:</span>
                    <span className="text-gray-700">
                      {profile.connectionCount}{profile.isConnectionCountObfuscated ? "+" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-black">Locale:</span>
                    <span className="text-gray-700">
                      {profile.locale.language.toUpperCase()} - {profile.locale.country.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-black">Profile Status:</span>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      profile.isPublic ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {profile.isPublic ? "Public" : "Private"}
                    </span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-3">
                  <Button 
                    onClick={() => window.open(profile.linkedInUrl, '_blank')}
                    className="bg-black text-white hover:bg-gray-800"
                  >
                    View LinkedIn Profile
                  </Button>
                  <Button 
                    onClick={() => window.open(profile.reportProfileUrl, '_blank')}
                    variant="outline"
                    className="border-black text-black hover:bg-gray-100"
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
          <Card className="border border-gray-300 bg-white shadow-lg">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-black mb-4">Skills ({profile.skills.length})</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 border border-gray-300 rounded-full text-sm font-medium text-black hover:bg-gray-200 transition-colors"
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
          <Card className="border border-gray-300 bg-white shadow-lg">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-black mb-4">
                Education ({profile.schools.educationsCount})
              </h2>
              <div className="space-y-4">
                {profile.schools.educationHistory.map((education, index) => (
                  <div key={index} className="border-l-4 border-black pl-6 py-4 bg-gray-50 rounded-r-lg">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg font-bold text-black">
                          {String(education.school || education.schoolName || `Education ${index + 1}`)}
                        </h3>
                        <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded border">
                          #{index + 1}
                        </span>
                      </div>
                      
                      {(education.degree || education.degreeName) && (
                        <div className="text-black font-medium">
                          <span className="text-gray-600">Degree: </span>
                          {String(education.degree || education.degreeName)}
                        </div>
                      )}
                      
                      {(education.field || education.fieldOfStudy) && (
                        <div className="text-gray-700">
                          <span className="text-gray-600">Field: </span>
                          {String(education.field || education.fieldOfStudy)}
                        </div>
                      )}
                      
                      {(education.startDate || education.endDate) && (
                        <div className="text-gray-700 text-sm">
                          <span className="text-gray-600">Duration: </span>
                          {String(education.startDate || 'Unknown')} - {String(education.endDate || 'Present')}
                        </div>
                      )}
                      
                      {education.activities && (
                        <div className="text-gray-700 text-sm">
                          <span className="text-gray-600">Activities: </span>
                          {String(education.activities)}
                        </div>
                      )}
                      
                      {education.description && (
                        <div className="text-gray-700 text-sm mt-2 p-2 bg-white rounded border">
                          {String(education.description)}
                        </div>
                      )}
                      
                      {/* Show all available fields for debugging */}
                      <details className="mt-3">
                        <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700 flex items-center gap-1">
                          <span>🔍</span> View All Available Data
                        </summary>
                        <div className="text-xs text-gray-600 mt-2 p-3 bg-white rounded border">
                          <div className="font-medium mb-2">Available Fields:</div>
                          <pre className="overflow-auto max-h-40 whitespace-pre-wrap">
                            {JSON.stringify(education, null, 2)}
                          </pre>
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
          <Card className="border border-gray-300 bg-white shadow-lg">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-black mb-4">
                Work Experience ({profile.positions.positionsCount})
              </h2>
              <div className="space-y-4">
                {profile.positions.positionHistory.map((position, index) => (
                  <div key={index} className="border-l-4 border-black pl-6 py-4 bg-gray-50 rounded-r-lg">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-black">
                            {String(position.title || position.jobTitle || `Position ${index + 1}`)}
                          </h3>
                          <h4 className="text-base font-semibold text-gray-700 mt-1">
                            {String(position.company || position.companyName || 'Company not specified')}
                          </h4>
                        </div>
                        <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded border">
                          #{index + 1}
                        </span>
                      </div>
                      
                      {(position.startDate || position.endDate) && (
                        <div className="text-gray-700 text-sm">
                          <span className="text-gray-600">Duration: </span>
                          {String(position.startDate || 'Unknown')} - {String(position.endDate || 'Present')}
                        </div>
                      )}
                      
                      {position.location && (
                        <div className="text-gray-700 text-sm">
                          <span className="text-gray-600">Location: </span>
                          {String(position.location)}
                        </div>
                      )}
                      
                      {(position.description || position.summary) && (
                        <div className="text-gray-700 text-sm mt-3 p-3 bg-white rounded border">
                          <span className="text-gray-600 font-medium">Description: </span>
                          <div className="mt-1">
                            {String(position.description || position.summary)}
                          </div>
                        </div>
                      )}
                      
                      {/* Show all available fields for debugging */}
                      <details className="mt-3">
                        <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700 flex items-center gap-1">
                          <span>🔍</span> View All Available Data
                        </summary>
                        <div className="text-xs text-gray-600 mt-2 p-3 bg-white rounded border">
                          <div className="font-medium mb-2">Available Fields:</div>
                          <pre className="overflow-auto max-h-40 whitespace-pre-wrap">
                            {JSON.stringify(position, null, 2)}
                          </pre>
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
          <Card className="border border-gray-300 bg-white shadow-lg">
            <div className="p-4">
              <h3 className="text-lg font-bold text-black mb-2">Skill Endorsements</h3>
              <div className="text-2xl font-bold text-gray-700">
                {profile.skillEndorsements.skillEndorsementsCount}
              </div>
              <div className="text-sm text-gray-600">Total Endorsements</div>
            </div>
          </Card>

          {/* News Mentions */}
          <Card className="border border-gray-300 bg-white shadow-lg">
            <div className="p-4">
              <h3 className="text-lg font-bold text-black mb-2">News Mentions</h3>
              <div className="text-2xl font-bold text-gray-700">
                {profile.newsMentions.newsMentionCount}
              </div>
              <div className="text-sm text-gray-600">Media Coverage</div>
            </div>
          </Card>

          {/* User Generated Content */}
          <Card className="border border-gray-300 bg-white shadow-lg">
            <div className="p-4">
              <h3 className="text-lg font-bold text-black mb-2">Posts & Content</h3>
              <div className="text-2xl font-bold text-gray-700">
                {profile.userGeneratedContents.userGeneratedContentCount}
              </div>
              <div className="text-sm text-gray-600">Published Content</div>
            </div>
          </Card>
        </div>

        {/* Contact Information */}
        <Card className="border border-gray-300 bg-white shadow-lg">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-black mb-4">Contact Information</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-black">Profile ID:</span>
                <span className="text-gray-700 font-mono text-sm break-all">{profile.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-black">First Name:</span>
                <span className="text-gray-700">{profile.firstName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-black">Last Name:</span>
                <span className="text-gray-700">{profile.lastName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-black">Phone Numbers:</span>
                <span className="text-gray-700">
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
        case 'found': return 'bg-green-100 text-green-800 border-green-300';
        case 'not_found': return 'bg-gray-100 text-gray-800 border-gray-300';
        case 'rate_limited': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        case 'error': return 'bg-red-100 text-red-800 border-red-300';
        default: return 'bg-blue-100 text-blue-800 border-blue-300';
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
        <Card className="border border-gray-300 bg-white shadow-lg">
          <div className="p-6">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold text-black">Email Intelligence Report</h1>
              <div className="text-xl text-gray-700 font-mono bg-gray-100 p-3 rounded border">
                {emailData.email}
              </div>
              <p className="text-gray-600">
                Comprehensive scan across {totalPlatforms} platforms and services
              </p>
            </div>
          </div>
        </Card>

        {/* Summary Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border border-green-300 bg-white shadow-lg">
            <div className="p-4 text-center">
              <div className="text-3xl font-bold text-green-600">{foundCount}</div>
              <div className="text-sm text-gray-600">Found</div>
              <div className="text-xs text-green-600">Active Accounts</div>
            </div>
          </Card>
          
          <Card className="border border-gray-300 bg-white shadow-lg">
            <div className="p-4 text-center">
              <div className="text-3xl font-bold text-gray-600">{notFoundCount}</div>
              <div className="text-sm text-gray-600">Not Found</div>
              <div className="text-xs text-gray-600">No Account</div>
            </div>
          </Card>
          
          <Card className="border border-yellow-300 bg-white shadow-lg">
            <div className="p-4 text-center">
              <div className="text-3xl font-bold text-yellow-600">{rateLimitedCount}</div>
              <div className="text-sm text-gray-600">Rate Limited</div>
              <div className="text-xs text-yellow-600">Temporary Block</div>
            </div>
          </Card>
          
          <Card className="border border-red-300 bg-white shadow-lg">
            <div className="p-4 text-center">
              <div className="text-3xl font-bold text-red-600">{errorCount}</div>
              <div className="text-sm text-gray-600">Errors</div>
              <div className="text-xs text-red-600">Check Failed</div>
            </div>
          </Card>
        </div>

        {/* Detailed Results by Status */}
        {Object.entries(platformsByStatus).map(([status, platforms]) => (
          <Card key={status} className="border border-gray-300 bg-white shadow-lg">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(status)}`}>
                  {getStatusIcon(status)} {status.replace('_', ' ').toUpperCase()}
                </span>
                <span className="text-gray-600 text-lg">({platforms.length})</span>
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
        <Card className="border border-gray-300 bg-white shadow-lg">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-black mb-4">All Platforms Checked</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {Object.entries(emailData.results).map(([platform, status], index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="font-medium text-black capitalize">
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
        <Card className="border border-gray-300 bg-gray-50 shadow-lg">
          <div className="p-6">
            <h3 className="text-lg font-bold text-black mb-2">🔒 Security Notice</h3>
            <p className="text-gray-700 text-sm">
              This report shows where the email address <span className="font-mono font-bold">{emailData.email}</span> has 
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
        <Card className="border border-gray-300 bg-gray-50 shadow-lg">
          <div className="p-8 text-center space-y-4">
            <div className="text-4xl text-gray-400">📭</div>
            <h3 className="text-xl font-bold text-black">No Results Found</h3>
            <p className="text-gray-600">
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
        <Card className="border border-gray-300 bg-white shadow-lg">
          <div className="p-6">
            <h2 className="text-xl font-bold text-black mb-4">Results for {selectedTool}</h2>
            <div className="bg-gray-100 p-4 rounded border">
              <pre className="text-sm overflow-auto max-h-96 whitespace-pre-wrap">
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return null;
};

export default FreemiumTools;
