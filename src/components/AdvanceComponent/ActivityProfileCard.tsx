import React, { useState, useRef, useEffect } from "react";
import { Download, Calendar, Globe, Eye, Activity, Zap } from "lucide-react";
import { useImageLoader } from "@/components/Card/imageLoader";
import { cn } from "@/lib/utils";
import { Expand, type SpecFormat } from "@/components/ActivityComponent/expand";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Type guards for SpecFormatValue
const isStringValue = (value: any): value is { value: string } => {
  return value !== undefined && typeof value.value === "string";
};

const isDateValue = (value: any): boolean => {
  if (!isStringValue(value)) return false;
  const dateString = value.value;
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && dateString.match(/\d{4}-\d{2}-\d{2}/);
};

interface UserData {
  spec_format?: SpecFormat[];
  pretty_name?: string;
  front_schemas?: Array<{ image?: string }>;
  module?: string;
  query?: string;
  status?: string;
}

interface ActivityProfileCardProps {
  userData: UserData[];
  isStreaming?: boolean;
  currentIndex?: number;
  totalModules?: number;
  connectionStatus?: string;
}

const ImageWithFallback = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) => {
  const imageStatus = useImageLoader(src);

  return (
    <>
      {imageStatus === "loaded" ? (
        <img
          src={src}
          alt={alt}
          className={cn(className, "animate-fade-in image-hover object-cover")}
        />
      ) : (
        <div
          className={cn(
            className,
            "flex items-center justify-center bg-surface-light text-white font-medium"
          )}
        >
          {alt.charAt(0).toUpperCase()}
        </div>
      )}
    </>
  );
};

const ActivityRow = ({
  spec,
  module,
  query,
  isNew = false,
}: {
  spec: SpecFormat;
  module?: string;
  query?: string;
  isNew?: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleClick = () => {
    setIsDetailsOpen(true);
  };

  const pictureUrl = isStringValue(spec.picture_url) ? spec.picture_url.value : "";
  const name = isStringValue(spec.name) ? spec.name.value : "Unknown";
  const creationDate = isStringValue(spec.creation_date) ? spec.creation_date.value : null;

  if (!creationDate || !isDateValue(spec.creation_date)) {
    return null;
  }

  return (
    <>
      <tr
        className={cn(
          "transition-all duration-300 cursor-pointer group hover:bg-gradient-to-r hover:from-blue-500/5 hover:to-purple-500/5",
          isHovered ? "bg-white/2 shadow-lg shadow-black/10" : "",
          isNew ? "animate-pulse bg-green-500/10 border-l-4 border-green-400" : ""
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <td className="px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg group-hover:border-white/20 transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
              <ImageWithFallback
                src={pictureUrl}
                alt={name}
                className="w-full h-full rounded-xl object-cover"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white text-sm group-hover:text-blue-100 transition-colors">
                  {name}
                </span>
                {isNew && <Zap className="w-3 h-3 text-yellow-400 animate-pulse" />}
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-blue-300 transition-colors">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-sm shadow-green-500/50"></div>
                  {module || "Unknown"}
                </div>
              </div>
            </div>
          </div>
        </td>
        <td className="px-4 py-4">
          <div className="flex justify-end w-full items-center">
            <div className="relative">
              <div className="text-xs px-4 py-2 border border-white/10 rounded-lg bg-gradient-to-r from-gray-800/50 to-gray-900/50 text-white text-center whitespace-nowrap backdrop-blur-sm group-hover:border-purple-500/30 group-hover:bg-gradient-to-r group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-all duration-300 shadow-sm">
                {new Date(creationDate).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        </td>
      </tr>
      <Expand
        isDetailsOpen={isDetailsOpen}
        setIsDetailsOpen={setIsDetailsOpen}
        selectedItem={{
          module: module || "",
          pretty_name: name,
          query: query || "",
          spec_format: [spec],
          category: { name: "", description: "" },
        }}
      />
    </>
  );
};

const ProfileImageCard = ({
  spec,
  module,
  query,
  isNew = false,
}: {
  spec: SpecFormat;
  module?: string;
  query?: string;
  isNew?: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const pictureUrl = isStringValue(spec.picture_url) ? spec.picture_url.value : "";
  const name = isStringValue(spec.name) ? spec.name.value : "Unknown";
  const creationDate = isStringValue(spec.creation_date) ? spec.creation_date.value : null;

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!pictureUrl) return;

    const link = document.createElement("a");
    link.href = pictureUrl;
    link.download = `${name}-image.jpg`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClick = () => {
    setIsDetailsOpen(true);
  };

  if (!pictureUrl) return null;

  return (
    <>
      <div
        className={cn(
          "flex items-center justify-between p-4 rounded-lg card-hover transition-all duration-300 cursor-pointer min-w-[320px] sm:min-w-[400px] border border-white/5",
          isHovered ? "bg-surface-light border-white/10" : "bg-surface",
          isNew ? "ring-2 ring-green-400/50 bg-green-500/5" : ""
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <div className="flex items-center gap-4">
          <div className="sm:w-56 sm:h-56 rounded-lg overflow-hidden border border-white/10 bg-surface-light relative">
            <ImageWithFallback src={pictureUrl} alt={name} className="w-full h-full object-cover" />
            {isNew && (
              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                NEW
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-white text-base sm:text-lg">{name || module}</span>
              {isNew && <Activity className="w-4 h-4 text-green-400 animate-pulse" />}
            </div>
            <span className="text-sm text-gray-400 flex items-center gap-2">
              <Globe size={14} />
              {module || "Unknown"}
            </span>
            {creationDate && (
              <span className="text-sm text-gray-400 flex items-center gap-2">
                <Calendar size={14} />
                {new Date(creationDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={handleDownload}
          className="download-button p-2 rounded-full hover:bg-gray-800/50 transition-colors"
          aria-label="Download image"
        >
          <Download size={20} />
        </button>
      </div>
      <Expand
        isDetailsOpen={isDetailsOpen}
        setIsDetailsOpen={setIsDetailsOpen}
        selectedItem={{
          module: module || "",
          pretty_name: name,
          query: query || "",
          spec_format: [spec],
          category: { name: "", description: "" },
        }}
      />
    </>
  );
};

export const ActivityProfileCard = ({
  userData,
  isStreaming = false,
  currentIndex = 0,
  totalModules = 0,
  connectionStatus = "disconnected",
}: ActivityProfileCardProps) => {
  const profilePicturesRef = useRef<HTMLDivElement>(null);
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState<Set<string>>(new Set());

  // Track new items for animation
  useEffect(() => {
    if (userData.length > 0) {
      const latestItem = userData[userData.length - 1];
      if (latestItem.module) {
        setRecentlyAdded((prev) => new Set([...prev, latestItem.module!]));

        // Remove from recently added after 3 seconds
        setTimeout(() => {
          setRecentlyAdded((prev) => {
            const newSet = new Set(prev);
            newSet.delete(latestItem.module!);
            return newSet;
          });
        }, 3000);
      }
    }
  }, [userData.length]);

  useEffect(() => {
    const container = profilePicturesRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY * 5;
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  const validItems = userData.filter((item) =>
    item.spec_format?.some((spec) => isStringValue(spec.picture_url))
  );

  return (
    <div className="flex flex-col lg:flex-row gap-4 text-white w-full h-full animate-scale-in">
      {/* Left: Platform Activity Table */}
      <div className="flex-1 bg-gradient-to-br from-[#0f0f11] to-[#131315] p-6 rounded-xl overflow-hidden shadow-2xl flex flex-col transition-all duration-300 hover:shadow-3xl h-96 text-sm max-h-[500px] border border-white/5 hover:border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-gradient-to-r from-gray-500 to-[#000000] rounded-full shadow-lg shadow-blue-500/20"></div>
            <h2 className="text-xl font-semibold text-white tracking-tight">Platform Activity</h2>
          </div>
        </div>

        <div className="overflow-auto custom-scrollbar flex-grow bg-[#0a0a0c]/50 rounded-lg border border-white/5">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-gradient-to-r from-[#0f0f11] to-[#131315] z-10 backdrop-blur-sm">
              <tr className="border-b border-gray-700/50">
                <th className="py-4 px-4 text-gray-300 font-semibold text-sm tracking-wide">
                  <div className="flex items-center gap-2">
                    <Globe size={14} className="text-blue-400" />
                    Platform
                  </div>
                </th>
                <th className="py-4 px-4 text-gray-300 font-semibold text-sm text-right tracking-wide">
                  <div className="flex items-center justify-end gap-2">
                    <Calendar size={14} className="text-purple-400" />
                    Creation Date
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/30">
              {userData.map((item, index) => (
                <React.Fragment key={index}>
                  {item.spec_format?.map(
                    (spec, specIndex) =>
                      isStringValue(spec.picture_url) && (
                        <ActivityRow
                          key={`activity-${index}-${specIndex}`}
                          spec={spec}
                          module={item.module}
                          query={item.query}
                          isNew={item.module ? recentlyAdded.has(item.module) : false}
                        />
                      )
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right: Profile Pictures */}
      <div className="flex-1 bg-[#131315] p-4 rounded-md overflow-hidden shadow-lg flex flex-col transition-all duration-300 hover:shadow-xl h-[400px] sm:h-[450px] lg:h-96 text-sm max-h-96">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <h2 className="text-lg font-medium">Profile Pictures</h2>
          </div>
          <button
            onClick={() => setIsViewAllOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-surface-light hover:bg-gray-700 rounded-md transition-colors text-sm border border-white/10"
          >
            <Eye size={14} />
            View All
          </button>
        </div>

        <div
          ref={profilePicturesRef}
          className="overflow-x-auto overflow-y-hidden custom-scrollbar flex-grow flex flex-col"
          style={{ scrollBehavior: "smooth" }}
        >
          <div className="flex h-full">
            {userData.map((item, index) => (
              <React.Fragment key={index}>
                {item.spec_format?.map(
                  (spec, specIndex) =>
                    isStringValue(spec.picture_url) && (
                      <div
                        key={`profile-wrapper-${index}-${specIndex}`}
                        className="flex flex-col h-full justify-stretch flex-1"
                      >
                        <div className="h-full min-w-[380px] sm:min-w-[500px] max-w-full flex-1 flex">
                          <ProfileImageCard
                            key={`profile-${index}-${specIndex}`}
                            spec={spec}
                            module={item.module}
                            query={item.query}
                            isNew={item.module ? recentlyAdded.has(item.module) : false}
                          />
                        </div>
                      </div>
                    )
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* View All Dialog */}
      <Dialog open={isViewAllOpen} onOpenChange={setIsViewAllOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] bg-[#0a0a0b] border border-white/20 text-white flex flex-col p-6">
          <DialogHeader className="border-b border-white/10 pb-4">
            <DialogTitle className="text-2xl font-semibold text-white flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              All Profile Pictures{" "}
              {isStreaming && <span className="text-sm text-yellow-400">(Live)</span>}
            </DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto w-full custom-scrollbar py-6 px-2 max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {userData.map((item, index) => (
                <React.Fragment key={index}>
                  {item.spec_format?.map(
                    (spec, specIndex) =>
                      isStringValue(spec.picture_url) && (
                        <div
                          key={`dialog-profile-${index}-${specIndex}`}
                          className={cn(
                            "group bg-[#131315] hover:bg-[#1a1a1c] p-4 rounded-lg border border-white/5 hover:border-white/15 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-black/20",
                            item.module && recentlyAdded.has(item.module)
                              ? "ring-2 ring-green-400/50"
                              : ""
                          )}
                        >
                          <div className="w-full aspect-square rounded-lg overflow-hidden border border-white/10 bg-surface-light mb-3 group-hover:border-white/20 transition-colors relative">
                            <ImageWithFallback
                              src={isStringValue(spec.picture_url) ? spec.picture_url.value : ""}
                              alt={isStringValue(spec.name) ? spec.name.value : "Unknown"}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {item.module && recentlyAdded.has(item.module) && (
                              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                                NEW
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <h3 className="font-semibold text-white text-sm truncate">
                              {isStringValue(spec.name)
                                ? spec.name.value
                                : item.module || "Unknown"}
                            </h3>

                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                              <Globe size={11} />
                              <span className="truncate">{item.module || "Unknown"}</span>
                            </div>

                            {isStringValue(spec.creation_date) && (
                              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                <Calendar size={11} />
                                <span>
                                  {new Date(spec.creation_date.value).toLocaleDateString()}
                                </span>
                              </div>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const pictureUrl = isStringValue(spec.picture_url)
                                  ? spec.picture_url.value
                                  : "";
                                if (!pictureUrl) return;
                                const link = document.createElement("a");
                                link.href = pictureUrl;
                                link.download = `${
                                  isStringValue(spec.name) ? spec.name.value : "profile"
                                }-image.jpg`;
                                link.target = "_blank";
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                              className="w-full flex items-center gap-2 justify-center px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 hover:border-blue-500/50 rounded-lg transition-all duration-200 text-xs font-medium text-blue-300 hover:text-blue-200 mt-3"
                            >
                              <Download size={12} />
                              Download
                            </button>
                          </div>
                        </div>
                      )
                  )}
                </React.Fragment>
              ))}
            </div>

            {userData.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  {isStreaming ? (
                    <Activity className="w-8 h-8 animate-spin text-blue-400" />
                  ) : (
                    <Globe size={24} className="text-gray-500" />
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">
                  {isStreaming ? "Waiting for Data..." : "No Profile Pictures"}
                </h3>
                <p className="text-sm text-gray-500">
                  {isStreaming
                    ? "Profile pictures will appear here as they stream in from the server."
                    : "No profile pictures are available to display."}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Custom scrollbar styles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(10, 10, 12, 0.3);
    border-radius: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3));
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.5), rgba(147, 51, 234, 0.5));
    border-color: rgba(255, 255, 255, 0.1);
  }

  .shadow-3xl {
    box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.8);
  }

  @keyframes fade-in {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }

  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }

  @keyframes scale-in {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }

  .animate-scale-in {
    animation: scale-in 0.5s ease-out;
  }
`;

// Add the styles to the component
const ActivityProfileCardWithStyles = (props: ActivityProfileCardProps) => {
  return (
    <>
      <style>{scrollbarStyles}</style>
      <ActivityProfileCard {...props} />
    </>
  );
};

export default ActivityProfileCardWithStyles;
