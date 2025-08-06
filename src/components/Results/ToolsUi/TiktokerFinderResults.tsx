"use client";
import React from "react";

// Define proper TypeScript interfaces for the API responses
interface TikTokProfile {
  Nickname: string;
  Username: string;
  Country: string;
  Language: string;
  About: string;
  "User ID": string;
  SecUID: string;
  "Bio Link": string;
  "Account Created": string;
  "Nickname Last Modified": string;
  "Username Last Modified": string;
  "Avatar URL": string;
}

interface TikTokStats {
  Followers: string;
  Following: string;
  Hearts: string;
  Videos: string;
  Friends: string;
}

interface TikTokData {
  profile: TikTokProfile;
  stats: TikTokStats;
  Website: string;
  "You can support me on Ko-fi to keep this project alive!": string;
}

interface TiktokerFinderResultsProps {
  data: TikTokData | null;
}

const TiktokerFinderResults: React.FC<TiktokerFinderResultsProps> = ({ data }) => {
  if (!data || !data.profile || !data.stats) {
    return null;
  }

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="bg-black/50 text-white rounded-xl p-6 py-16 shadow-lg w-full backdrop-blur-sm border border-white/20">
        <div className="space-y-8 animate-fade-in">
          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-10">
              <div className="w-28 h-28 rounded-full overflow-hidden border border-white/20">
                <img
                  src={data.profile["Avatar URL"]}
                  className="w-full h-full object-cover"
                  alt={data.profile.Nickname}
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 w-full">
              <h2 className="text-2xl font-semibold text-white">
                {data.profile.Nickname}
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                @{data.profile.Username}
              </p>

              <div className="space-y-1 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Country:</span>
                  <span className="font-medium text-white">
                    {data.profile.Country}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Language:</span>
                  <span className="font-medium text-white">
                    {data.profile.Language}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">User ID:</span>
                  <span className="font-medium text-white">
                    {data.profile["User ID"]}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Joined:</span>
                  <span className="font-medium text-white">
                    {data.profile["Account Created"]}
                  </span>
                </div>
              </div>

              <div className="bg-white/10 px-4 py-3 rounded-md text-sm italic text-white mb-6 border border-white/20">
                &ldquo;{data.profile.About}&rdquo;
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                <div className="bg-white/10 rounded-md text-center py-3 border border-white/20">
                  <p className="text-base font-semibold text-white">
                    {data.stats.Followers}
                  </p>
                  <p className="text-xs text-gray-400">Followers</p>
                </div>

                <div className="bg-white/10 rounded-md text-center py-3 border border-white/20">
                  <p className="text-base font-semibold text-teal-400">
                    {data.stats.Following}
                  </p>
                  <p className="text-xs text-gray-400">Following</p>
                </div>

                <div className="bg-white/10 rounded-md text-center py-3 border border-white/20">
                  <p className="text-base font-semibold text-white">
                    {data.stats.Hearts}
                  </p>
                  <p className="text-xs text-gray-400">Hearts</p>
                </div>

                <div className="bg-white/10 rounded-md text-center py-3 border border-white/20">
                  <p className="text-base font-semibold text-teal-400">
                    {data.stats.Videos}
                  </p>
                  <p className="text-xs text-gray-400">Videos</p>
                </div>

                <div className="bg-white/10 rounded-md text-center py-3 border border-white/20">
                  <p className="text-base font-semibold text-white">
                    {data.stats.Friends}
                  </p>
                  <p className="text-xs text-gray-400">Friends</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TiktokerFinderResults; 