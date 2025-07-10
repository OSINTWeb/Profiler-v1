import { useState } from "react";
import { GravatarData } from "@/types/types";
import { Mail, ExternalLink, MapPin } from "lucide-react";
import { X } from "lucide-react";
import NoResultFound from "./NoResultFound";

interface GravatarResultsProps {
  data: unknown;
  error?: string;
  query: string;
}

export default function GravatarResults({ data, error, query }: GravatarResultsProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (error) {
    return <NoResultFound toolName="Gravatar" message={`No Gravatar profile found for ${query}`} />;
  }

  if (!data) {
    return <NoResultFound toolName="Gravatar" message="No Gravatar data available." />;
  }

  const profile = (data as GravatarData).entry[0];

  return (
    <div className="w-full max-w-xl mx-auto mt-8 overflow-hidden animate-slide-up">
      <div className="border border-white/20 rounded-md p-6">
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
                className={`w-full h-full object-cover ${imageLoaded ? "animate-image-load" : "opacity-0"}`}
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
                  <p className="text-sm text-gray-300 leading-relaxed">{profile.aboutMe}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 