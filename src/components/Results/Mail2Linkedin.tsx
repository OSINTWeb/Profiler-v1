"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink, MapPin } from "lucide-react";
// import { Badge } from "@/components/ui/badge"; // Uncomment if you have a Badge component
import mail2LinkedinProfile from "public/Data/Mail2Linkedin.json";

// --- Types ---
interface Education {
  schoolName?: string;
  degreeName?: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  activities?: string;
  description?: string;
  [key: string]: unknown;
}

interface Position {
  title?: string;
  companyName?: string;
  companyLogo?: string;
  linkedInUrl?: string;
  startEndDate?: {
    start?: { month?: number; year?: number };
    end?: { month?: number; year?: number };
  };
  description?: string;
  [key: string]: unknown;
}

interface SkillEndorsement {
  skillName: string;
  endorsementCount: number;
}

export interface LinkedInProfile {
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
  summary?: string;
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
    newsMentions: unknown[];
  };
  userGeneratedContents: {
    userGeneratedContentCount: number;
    userGeneratedContents: unknown[];
  };
  isPublic: boolean;
}

// --- Components ---
    
    interface ProfileHeaderProps {
      profile: LinkedInProfile;
    }
    
    const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
      const {
        displayName,
        firstName,
        photoUrl,
        headline,
        linkedInUrl,
        connectionCount,
        location,
        isConnectionCountObfuscated,
      } = profile;
    
      return (
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 bg-gradient-to-b from-[#252529] to-[#131315] rounded-xl border border-gray-700/50 backdrop-blur-md">
          <Avatar className="w-24 h-24 md:w-40 md:h-40 border-2 border-white/20">
            <AvatarImage src={photoUrl} alt={displayName} />
            <AvatarFallback>{firstName?.charAt(0) || "?"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2 flex-grow text-center md:text-left">
            <h1 className="text-2xl md:text-4xl font-bold text-white">{displayName}</h1>
            <p className="text-md md:text-lg text-gray-300/90">{headline}</p>
            <div className="flex flex-col md:flex-row gap-3 mt-2 items-center md:items-start">
              {location && (
                <div className="flex items-center gap-1 text-gray-400">
                  <MapPin size={16} />
                  <span>{location}</span>
                </div>
              )}
              {connectionCount && (
                <div className="text-gray-400">
                  {isConnectionCountObfuscated ? "500+ connections" : `${connectionCount} connections`}
                </div>
              )}
            </div>
          </div>
          {linkedInUrl && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 mt-4 md:mt-0 bg-gray-800/50 hover:bg-gray-700/50 border-gray-600 text-teal-300"
              onClick={() => window.open(linkedInUrl, "_blank")}
            >
              <ExternalLink size={14} />
              View Profile
            </Button>
          )}
        </div>
      );
    };

interface ProfileSummaryProps {
  profile: LinkedInProfile;
}

const ProfileSummary: React.FC<ProfileSummaryProps> = ({ profile }) => {
  const { summary } = profile;
  if (!summary) return null;
  return (
    <Card className="border border-gray-700/50 bg-gradient-to-b from-[#1a1a1d] to-[#131315] backdrop-blur-md text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="whitespace-pre-wrap text-gray-300">{summary}</div>
      </CardContent>
    </Card>
  );
};

interface ExperienceSectionProps {
  profile: LinkedInProfile;
}

const formatDate = (date?: { month?: number; year?: number }) => {
  if (!date || (!date.month && !date.year)) return "";
  const monthNames = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ];
  let result = "";
  if (date.month) {
    result += monthNames[date.month - 1] + " ";
  }
  if (date.year) {
    result += date.year;
  }
  return result;
};

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ profile }) => {
  const { positions } = profile;
  if (!positions?.positionHistory || positions.positionHistory.length === 0) return null;
  return (
    <Card className="border border-gray-700/50 bg-gradient-to-b from-[#1a1a1d] to-[#131315] backdrop-blur-md text-white ">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Experience</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          {positions.positionHistory.map((position: Position, index: number) => (
            <div key={index} className="flex gap-4">
              <Avatar className="w-12 h-12 rounded-md shrink-0 bg-gray-800">
                {position.companyLogo && <AvatarImage src={position.companyLogo} alt={position.companyName} />}
                <AvatarFallback className="bg-gray-800 text-gray-100">
                  {position.companyName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1  w-full">
                <div className="flex justify-between  ">
                  <h3 className="font-semibold text-lg text-white">{position.title}</h3>
                  {position.linkedInUrl && (
                    <a
                      href={position.linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-400 hover:text-white"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
                <p className="text-gray-300">{position.companyName}</p>
                <p className="text-gray-400 text-sm">
                  {formatDate(position.startEndDate?.start)} - {position.startEndDate?.end && Object.keys(position.startEndDate.end).length ? formatDate(position.startEndDate.end) : "Present"}
                </p>
                {position.description && (
                  <div className="mt-2 text-gray-300 whitespace-pre-wrap text-sm">
                    {position.description}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface SkillsSectionProps {
  profile: LinkedInProfile;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ profile }) => {
  const { skills, skillEndorsements } = profile;
  if (!skills || skills.length === 0) return null;
  // Create a map of endorsed skills with their counts
  const endorsedSkills: Record<string, number> = {};
  if (skillEndorsements && skillEndorsements.skillEndorsements) {
    skillEndorsements.skillEndorsements.forEach((endorsement: SkillEndorsement) => {
      endorsedSkills[endorsement.skillName] = endorsement.endorsementCount;
    });
  }
  return (
    <Card className="border border-gray-700/50 bg-gradient-to-b from-[#1a1a1d] to-[#131315] backdrop-blur-md text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Skills</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill: string, index: number) => {
            const endorsementCount = endorsedSkills[skill] || 0;
            return (
              <span
                key={index} 
                className={`text-sm py-1.5 px-3 rounded-full border ${endorsementCount > 0 ? 'bg-blue-500/30 text-blue-300 border-blue-500/40' : 'bg-transparent text-gray-300 border-gray-500'}`}
              >
                {skill}
                {endorsementCount > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 bg-blue-600/40 text-xs rounded-full">
                    {endorsementCount}
                  </span>
                )}
              </span>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// --- Main Component ---

const Mail2Linkedin: React.FC = () => {
  // If you want to use the imported JSON directly:
  const profile = mail2LinkedinProfile as unknown as LinkedInProfile;
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 py-8">
      <ProfileHeader profile={profile} />
      <ProfileSummary profile={profile} />
      <ExperienceSection profile={profile} />
      <SkillsSection profile={profile} />
      {/* Add more sections as needed, e.g. education, contact, etc. */}
    </div>
  );
};

export default Mail2Linkedin;