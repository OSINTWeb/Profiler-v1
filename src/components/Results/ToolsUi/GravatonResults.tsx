"use client";
import React from "react";
import { X, Mail, ExternalLink, MapPin } from "lucide-react";

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

interface GravatonResultsProps {
  data: GravatarData | null;
  error?: string;
  query: string;
}

const GravatonResults: React.FC<GravatonResultsProps> = ({ data, error, query }) => {
  // Add imageLoaded state for Gravatar original UI
  const [imageLoaded, setImageLoaded] = React.useState(false);

  if (error) {
    return (
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
              {query}
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
    );
  }

  if (!data || !data.entry || data.entry.length === 0) {
    return null;
  }

  const profile = data.entry[0];

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
};

export default GravatonResults; 