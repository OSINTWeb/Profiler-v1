import React, { useState, useCallback, useEffect } from "react";
import {
  Eye,
  MapPin,
  Calendar,
  Phone,
  User,
  MessageCircle,
  Shield,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { PlatformData } from "./InfocardList";

interface PlatformVariable {
  key: string;
  proper_key?: string;
  value: string | number | boolean | object;
  type?: string;
}

interface SpecFormatItem {
  registered?: {
    type?: string;
    proper_key?: string;
    value: boolean;
  };
  platform_variables?: PlatformVariable[];
  verified?: { value: boolean };
  breach?: { value: boolean };
  name?: { value: string };
  picture_url?: { value: string };
  website?: { value: string };
  id?: { value: string };
  bio?: { value: string };
  creation_date?: { value: string };
  gender?: { value: string };
  last_seen?: { value: string };
  username?: { value: string };
  location?: { value: string };
  phone_number?: { value: string };
  phone?: { value: string };
  email?: { value: string };
  birthday?: { value: string };
  language?: { value: string };
  age?: { value: number };
  [key: string]: { value: string | boolean | number } | PlatformVariable[] | undefined;
}

interface ListViewProps {
  filteredUsers: PlatformData[];
  selectedIndices: number[];
  handleCardSelect: (index: number) => void;
  enableselect: boolean;
  deletebutton: boolean;
}

// Format date for display
const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
};

const ListView: React.FC<ListViewProps> = ({
  filteredUsers,
  selectedIndices,
  handleCardSelect,
  enableselect,
  deletebutton,
}) => {
  const [selectedItem, setSelectedItem] = useState<PlatformData | null>(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [leftPanelWidth, setLeftPanelWidth] = useState(40);
  const [isResizing, setIsResizing] = useState(false);

  // Handle mouse events for resizing
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    const containerRect = document.getElementById("list-detail-container")?.getBoundingClientRect();
    if (containerRect) {
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      setLeftPanelWidth(Math.max(20, Math.min(80, newWidth)));
    }
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Add event listeners for mouse events
  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // Simple handler for opening details
  const handleOpenDetails = (item: PlatformData, index: number) => {
    setSelectedItem(item);
    setSelectedItemIndex(index);
  };

  // Get primary info from spec_format for list view
  const getPrimaryInfo = (specFormat: SpecFormatItem[]) => {
    const info = {
      name: "",
      picture_url: "",
      platform: "",
      email: "",
      username: "",
      location: "",
      bio: "",
      phone_number: "",
      creation_date: "",
      website: "",
      verified: false,
      breach: false,
      age: "",
      gender: "",
      language: "",
    };

    specFormat.forEach((spec) => {
      if (spec.name?.value) info.name = String(spec.name.value);
      if (spec.picture_url?.value) info.picture_url = String(spec.picture_url.value);
      if (spec.email?.value) info.email = String(spec.email.value);
      if (spec.username?.value) info.username = String(spec.username.value);
      if (spec.location?.value) info.location = String(spec.location.value);
      if (spec.bio?.value) info.bio = String(spec.bio.value);
      if (spec.phone_number?.value) info.phone_number = String(spec.phone_number.value);
      if (spec.creation_date?.value) info.creation_date = String(spec.creation_date.value);
      if (spec.website?.value) info.website = String(spec.website.value);
      if (spec.verified?.value) info.verified = Boolean(spec.verified.value);
      if (spec.breach?.value) info.breach = Boolean(spec.breach.value);
      if (spec.age?.value) info.age = String(spec.age.value);
      if (spec.gender?.value) info.gender = String(spec.gender.value);
      if (spec.language?.value) info.language = String(spec.language.value);
    });

    return info;
  };

  // Detail Panel Component
  const DetailPanel: React.FC = () => {
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [showJson, setShowJson] = useState(false);

    if (!selectedItem) {
      return (
        <div className="flex items-center justify-center h-full text-gray-400">
          <div className="text-center">
            <Eye size={48} className="mx-auto mb-4 opacity-25" />
            <p className="text-lg font-medium">Select an item to view details</p>
            <p className="text-sm opacity-50">Click on any item from the list to see detailed information</p>
          </div>
        </div>
      );
    }

    const primaryInfo = getPrimaryInfo(selectedItem.spec_format);
    const spec = selectedItem.spec_format?.[0];

    // Helper functions
    const handleCopyField = (text: string, fieldName: string) => {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedField(fieldName);
        setTimeout(() => setCopiedField(null), 2000);
      });
    };

    const formatTitle = (title: string): string => {
      return title
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
    };

    const CopyButton = ({ onClick, isCopied, size = 16 }: { onClick: () => void; isCopied: boolean; size?: number }) => (
      <button
        onClick={onClick}
        className={`p-1.5 rounded-full transition-all duration-200 ${
          isCopied 
            ? "bg-white/10 text-white" 
            : "hover:bg-white/5 text-gray-400 hover:text-white"
        }`}
      >
        {isCopied ? <Check size={size} /> : <Copy size={size} />}
      </button>
    );

    const renderValue = (value: unknown, key: string) => {
      // Handle null/undefined
      if (value === null || value === undefined) {
        return (
          <span className="text-gray-500 bg-gray-800/50 px-3 py-1.5 rounded text-sm italic">
            No value
          </span>
        );
      }

      // Handle all object types (arrays and objects) as JSON
      if (typeof value === "object") {
        try {
          return (
            <div className="bg-black rounded border border-gray-600 p-3 max-h-32 overflow-y-auto">
              <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap">
                {JSON.stringify(value, null, 2)}
              </pre>
            </div>
          );
        } catch (jsonError) {
          console.error("Error stringifying object:", jsonError);
          return (
            <span className="text-red-400 bg-gray-800/50 px-3 py-1.5 rounded text-sm">
              [Complex object - unable to display]
            </span>
          );
        }
      }

      // Handle primitive values safely
      let stringValue: string;
      try {
        if (typeof value === "string") {
          stringValue = value;
        } else if (typeof value === "number") {
          stringValue = value.toString();
        } else if (typeof value === "boolean") {
          stringValue = value.toString();
        } else {
          stringValue = String(value);
        }
      } catch (error) {
        console.error("Error converting value to string:", error);
        stringValue = "[Unable to display value]";
      }
      
      if (key === "id") {
        return (
          <span className="font-mono text-sm bg-black border border-gray-600 px-3 py-1.5 rounded text-white break-all">
            {stringValue}
          </span>
        );
      }

      if (key.includes("url") || key.includes("link")) {
        return (
          <a
            href={stringValue}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline text-sm break-all flex items-center gap-1"
          >
            {stringValue}
            <ExternalLink size={12} />
          </a>
        );
      }

      if (key === "last_seen" || key === "creation_date" || key.includes("date")) {
        return (
          <span className="text-white bg-gray-800/50 px-3 py-1.5 rounded text-sm">
            {formatDate(stringValue)}
          </span>
        );
      }

      if (typeof value === "boolean") {
        return (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            value
              ? "bg-green-500/20 text-green-400 border border-green-500/50"
              : "bg-red-500/20 text-red-400 border border-red-500/50"
          }`}>
            {value ? "Yes" : "No"}
          </span>
        );
      }

      return (
        <span className="text-white bg-gray-800/50 px-3 py-1.5 rounded text-sm">
          {stringValue}
        </span>
      );
    };

    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-black">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-900 flex items-center justify-center">
              {primaryInfo.picture_url ? (
                <img
                  src={primaryInfo.picture_url}
                  alt={primaryInfo.name || "Profile"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <User size={24} className="text-gray-600" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {primaryInfo.name || primaryInfo.username || primaryInfo.email || "Unknown"}
              </h2>
              <p className="text-gray-400">{selectedItem.pretty_name}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedItem(null);
              setSelectedItemIndex(null);
            }}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8">
          {/* Dynamic Fields */}
          <div className="grid grid-cols-2 gap-6">
            {spec && Object.entries(spec)
              .filter(([key, value]) => {
                if (key === "platform_variables") return false;
                return value && typeof value === "object" && "value" in value;
              })
              .map(([key, value]) => {
                let actualValue: unknown;
                try {
                  actualValue = value && typeof value === "object" && "value" in value ? value.value : value;
                } catch (error) {
                  console.error("Error extracting value:", error);
                  actualValue = "[Error extracting value]";
                }
                
                if (actualValue === null || actualValue === undefined) return null;

                return (
                  <div key={key} className="group">
                    <div className="text-gray-400 text-xs mb-1.5 uppercase tracking-wider font-medium">
                      {formatTitle(key)}
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {renderValue(actualValue, key)}
                      </div>
                      <CopyButton
                        onClick={() => {
                          let copyText: string;
                          try {
                            copyText = typeof actualValue === "object" ? JSON.stringify(actualValue, null, 2) : String(actualValue);
                            handleCopyField(copyText, key);
                          } catch (error) {
                            console.error("Error copying value:", error);
                            handleCopyField("[Unable to copy value]", key);
                          }
                        }}
                        isCopied={copiedField === key}
                        size={14}
                      />
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Platform Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-white opacity-80">Platform Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-1.5">Platform</div>
                <div className="text-white">{selectedItem.module || 'Unknown'}</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-1.5">Website</div>
                <a
                  href={`https://${selectedItem.module || selectedItem.pretty_name}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1 group"
                >
                  {selectedItem.module || selectedItem.pretty_name}.com
                  <ExternalLink size={12} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
              {selectedItem.query && (
                <div className="col-span-2">
                  <div className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-1.5">Query</div>
                  <div className="flex items-center gap-2">
                    <code className="text-white bg-white/5 px-3 py-1.5 rounded-lg text-sm font-mono">
                      {selectedItem.query}
                    </code>
                    <CopyButton
                      onClick={() => handleCopyField(selectedItem.query, "query")}
                      isCopied={copiedField === "query"}
                      size={14}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status & Security */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white opacity-80 flex items-center gap-2">
              <Shield size={18} className="opacity-50" />
              Status & Security
            </h3>
            <div className="flex flex-wrap gap-3">
              {primaryInfo.verified && (
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
                  <Shield size={14} className="text-blue-400" />
                  <span className="text-sm text-white">Verified</span>
                </div>
              )}
              {primaryInfo.breach && (
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
                  <AlertTriangle size={14} className="text-red-400" />
                  <span className="text-sm text-white">Security Breach</span>
                </div>
              )}
              {selectedItem.reliable_source && (
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-sm text-white">Reliable Source</span>
                </div>
              )}
            </div>
          </div>

          {/* JSON Data Toggle */}
          <div>
            <button
              onClick={() => setShowJson(!showJson)}
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <div className={`transform transition-transform duration-200 ${showJson ? 'rotate-90' : ''}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <span className="text-sm font-medium">Raw JSON Data</span>
            </button>
            {showJson && (
              <div className="mt-4 bg-white/5 rounded-lg p-4 overflow-x-auto">
                <pre className="text-green-400 text-xs font-mono">
                  {JSON.stringify(selectedItem, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // List View Item Component
  const ListViewItem: React.FC<{
    user: PlatformData;
    isSelected: boolean;
    onSelect: () => void;
    showSelection: boolean;
    index: number;
  }> = ({ user, isSelected, onSelect, showSelection, index }) => {
    const primaryInfo = getPrimaryInfo(user.spec_format);
    const displayName = primaryInfo.name || primaryInfo.username || primaryInfo.email || "Unknown";

    return (
      <div
        className={`relative flex items-start p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:border-gray-100 ${
          isSelected
            ? enableselect
              ? "border-white bg-gray-100/10 shadow-lg"
              : "border-gray-400 bg-gray-400/10 shadow-lg"
            : "border-gray-600 bg-black"
        }`}
        onClick={() => {
          if (!showSelection) {
            handleOpenDetails(user, index);
          } else {
            onSelect();
          }
        }}
      >
        {/* Selection checkbox */}
        {showSelection && (
          <div className="cursor-pointer mr-4">
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-start transition-all duration-200 ${
                isSelected
                  ? enableselect
                    ? "bg-white border-white text-black"
                    : "bg-gray-400 border-gray-400 text-black"
                  : "border-gray-500 hover:border-white"
              }`}
            >
              {isSelected && (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </div>
        )}

        {/* Profile Image */}
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800 border border-gray-600 flex items-center justify-center flex-shrink-0">
          {primaryInfo.picture_url ? (
            <img
              src={primaryInfo.picture_url}
              alt={displayName}
              className="w-full h-full object-cover "
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <User size={16} className="text-gray-400" />
          )}
        </div>

        {/* Main Content - Horizontal Layout */}
        <div className="flex-1 flex items-center justify-start ml-4 min-w-0">
          {/* Left Section - Name and Platform */}
          <div className="flex flex-col min-w-0 flex-shrink-0 mr-4">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-white font-semibold text-sm truncate max-w-[200px]">
                {displayName}
              </h3>

              {/* Status Badges - Compact */}
              <div className="flex items-center space-x-1">
                {primaryInfo.verified && (
                  <div title="Verified">
                    <Shield size={10} className="text-gray-400" />
                  </div>
                )}
                {primaryInfo.breach && (
                  <div title="Breached">
                    <AlertTriangle size={10} className="text-gray-500" />
                  </div>
                )}
                {user.reliable_source && (
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-gray-400"
                    title="Reliable Source"
                  ></div>
                )}
              </div>
            </div>
          </div>

          {/* Middle Section - Contact Info */}
          <div className="flex items-center gap-4 text-xs text-gray-300 flex-shrink-0">
            {primaryInfo.email && (
              <div className="flex items-center gap-1 bg-gray-800/70 px-2 py-1 rounded-lg shadow-sm max-w-[180px]">
                <MessageCircle size={13} className="text-blue-400 flex-shrink-0" />
                <span className="truncate font-medium" title={primaryInfo.email}>
                  {primaryInfo.email}
                </span>
              </div>
            )}

            {primaryInfo.username && (
              <div className="flex items-center gap-1 bg-gray-800/70 px-2 py-1 rounded-lg shadow-sm max-w-[120px]">
                <User size={13} className="text-green-400 flex-shrink-0" />
                <span className="truncate font-medium" title={primaryInfo.username}>
                  @{primaryInfo.username}
                </span>
              </div>
            )}

            {primaryInfo.phone_number && (
              <div className="flex items-center gap-1 bg-gray-800/70 px-2 py-1 rounded-lg shadow-sm max-w-[140px]">
                <Phone size={13} className="text-yellow-400 flex-shrink-0" />
                <span className="truncate font-medium" title={primaryInfo.phone_number}>
                  {primaryInfo.phone_number}
                </span>
              </div>
            )}
          </div>

          {/* Right Section - Additional Info */}
          <div className="flex items-center space-x-4 text-xs text-gray-400 flex-shrink-0">
            {primaryInfo.location && (
              <div className="flex items-center space-x-1 max-w-[120px]">
                <MapPin size={12} className="text-gray-500 flex-shrink-0" />
                <span className="truncate">{primaryInfo.location}</span>
              </div>
            )}

            {primaryInfo.age && (
              <div className="flex items-center space-x-1">
                <Calendar size={12} className="text-gray-500" />
                <span>{primaryInfo.age}</span>
              </div>
            )}

            {primaryInfo.creation_date && (
              <div className="flex items-center space-x-1">
                <Calendar size={12} className="text-gray-500" />
                <span className="whitespace-nowrap">
                  {formatDate(primaryInfo.creation_date)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      id="list-detail-container"
      className="flex h-[1000px] border border-gray-600 rounded-lg overflow-hidden bg-gray-900/20"
    >
      {/* Left Panel - List View */}
      <div
        className="flex flex-col overflow-hidden border-r border-gray-700"
        style={{ width: `${leftPanelWidth}%` }}
      >
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <div key={`${user.module}-${index}`} className={`transition-all duration-200 ${selectedItemIndex === index ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}>
                <ListViewItem
                  user={user}
                  isSelected={selectedIndices.includes(index)}
                  onSelect={() => handleCardSelect(index)}
                  showSelection={enableselect || deletebutton}
                  index={index}
                />
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center mb-4">
                <User size={24} className="text-gray-500" />
              </div>
              <p className="text-gray-400 text-lg font-medium">No user data available</p>
              <p className="text-gray-500 text-sm mt-1">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Resizer */}
      <div
        className="w-1 bg-gray-700 hover:bg-gray-600 cursor-col-resize flex items-center justify-center group"
        onMouseDown={handleMouseDown}
      >
        <div className="w-1 h-8 bg-gray-500 group-hover:bg-gray-400 rounded-full"></div>
      </div>

      {/* Right Panel - Detail View */}
      <div
        className="flex flex-col bg-gray-900/30"
        style={{ width: `${100 - leftPanelWidth - 0.5}%` }}
      >
        <DetailPanel />
      </div>
    </div>
  );
};

export default ListView; 