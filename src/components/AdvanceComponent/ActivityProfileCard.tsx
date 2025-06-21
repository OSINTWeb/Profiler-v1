import React, { useState, useRef, useEffect } from "react";
import { Download, Calendar, Globe, Eye, Activity } from "lucide-react";
import { useImageLoader } from "@/components/Card/imageLoader";
import { cn } from "@/lib/utils";
import { Expand, type SpecFormat } from "@/components/ActivityComponent/expand";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Type for SpecFormatValue
interface SpecFormatValue {
  value: string;
}

// Type guards for SpecFormatValue
const isStringValue = (value: unknown): value is SpecFormatValue => {
  return value !== undefined && 
         typeof value === "object" && 
         value !== null && 
         "value" in value && 
         typeof (value as SpecFormatValue).value === "string";
};

const isDateValue = (value: unknown): boolean => {
  if (!isStringValue(value)) return false;
  const dateString = value.value;
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && Boolean(dateString.match(/\d{4}-\d{2}-\d{2}/));
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
          className={cn(className, "object-cover")}
        />
      ) : (
        <div
          className={cn(
            className,
            "flex items-center justify-center bg-gray-800 text-white font-medium"
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
          "transition-all duration-300 cursor-pointer group hover:bg-gray-900/50",
          isHovered ? "bg-gray-900/30" : "",
          isNew ? "bg-gray-800/50 border-l-4 border-gray-500" : ""
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <td className="px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-gray-700 bg-gray-800 group-hover:border-gray-600 transition-all duration-300">
              <ImageWithFallback
                src={pictureUrl}
                alt={name}
                className="w-full h-full rounded-xl object-cover"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white text-sm group-hover:text-gray-200 transition-colors">
                  {name}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-gray-300 transition-colors">
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                  {module || "Unknown"}
                </div>
              </div>
            </div>
          </div>
        </td>
        <td className="px-4 py-4">
          <div className="flex justify-end w-full items-center">
            <div className="relative">
              <div className="text-xs px-4 py-2 border border-gray-700 rounded-lg bg-gray-800/50 text-white text-center whitespace-nowrap group-hover:border-gray-600 transition-all duration-300">
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
          "flex items-center justify-between p-4 rounded-lg transition-all duration-300 cursor-pointer min-w-[320px] sm:min-w-[400px] border border-gray-700",
          isHovered ? "bg-gray-800/50 border-gray-600" : "bg-gray-900/30",
          isNew ? "border-gray-500 bg-gray-800/30" : ""
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <div className="flex items-center gap-4">
          <div className="sm:w-56 sm:h-56 rounded-lg overflow-hidden border border-gray-700 bg-gray-800 relative">
            <ImageWithFallback src={pictureUrl} alt={name} className="w-full h-full object-cover" />
            {isNew && (
              <div className="absolute top-2 right-2 bg-gray-700 text-white px-2 py-1 rounded-full text-xs font-bold">
                NEW
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-white text-base sm:text-lg">{name || module}</span>
              {isNew && <Activity className="w-4 h-4 text-gray-400" />}
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
          className="p-2 rounded-full hover:bg-gray-800/50 transition-colors text-gray-400 hover:text-white"
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

  return (
    <div className="flex flex-col lg:flex-row gap-4 text-white w-full h-full">
      {/* Left: Platform Activity Table */}
      <div className="flex-1 bg-black p-6 rounded-xl overflow-hidden border border-gray-700 flex flex-col h-96 text-sm max-h-[500px]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <h2 className="text-xl font-semibold text-white tracking-tight">Platform Activity</h2>
          </div>
        </div>

        <div className="overflow-auto custom-scrollbar flex-grow bg-gray-900/30 rounded-lg border border-gray-700">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-black z-10">
              <tr className="border-b border-gray-700">
                <th className="py-4 px-4 text-gray-300 font-semibold text-sm tracking-wide">
                  <div className="flex items-center gap-2">
                    <Globe size={14} className="text-gray-400" />
                    Platform
                  </div>
                </th>
                <th className="py-4 px-4 text-gray-300 font-semibold text-sm text-right tracking-wide">
                  <div className="flex items-center justify-end gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    Creation Date
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
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
      <div className="flex-1 bg-black p-4 rounded-md overflow-hidden border border-gray-700 flex flex-col h-[400px] sm:h-[450px] lg:h-96 text-sm max-h-96">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <h2 className="text-lg font-medium">Profile Pictures</h2>
          </div>
          <button
            onClick={() => setIsViewAllOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors text-sm border border-gray-600"
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
        <DialogContent className="max-w-5xl max-h-[90vh] bg-black border border-gray-600 text-white flex flex-col p-6">
          <DialogHeader className="border-b border-gray-700 pb-4">
            <DialogTitle className="text-2xl font-semibold text-white flex items-center gap-3">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              All Profile Pictures{" "}
              {isStreaming && <span className="text-sm text-gray-400">(Live)</span>}
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
                            "group bg-gray-900 hover:bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-300 cursor-pointer",
                            item.module && recentlyAdded.has(item.module)
                              ? "border-gray-500"
                              : ""
                          )}
                        >
                          <div className="w-full aspect-square rounded-lg overflow-hidden border border-gray-700 bg-gray-800 mb-3 group-hover:border-gray-600 transition-colors relative">
                            <ImageWithFallback
                              src={isStringValue(spec.picture_url) ? spec.picture_url.value : ""}
                              alt={isStringValue(spec.name) ? spec.name.value : "Unknown"}
                              className="w-full h-full object-cover"
                            />
                            {item.module && recentlyAdded.has(item.module) && (
                              <div className="absolute top-2 right-2 bg-gray-700 text-white px-2 py-1 rounded-full text-xs font-bold">
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
                              className="w-full flex items-center gap-2 justify-center px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-gray-500 rounded-lg transition-all duration-200 text-xs font-medium text-gray-300 hover:text-white mt-3"
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
                    <Activity className="w-8 h-8 text-gray-400" />
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
    background: rgba(75, 85, 99, 0.5);
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(75, 85, 99, 0.7);
    border-color: rgba(255, 255, 255, 0.1);
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
