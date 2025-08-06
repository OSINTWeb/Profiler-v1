import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  Eye,
  MapPin,
  User,
  Shield,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  Plus,
  Mail,
  Globe,
  Clock,
  Hash,
} from "lucide-react";
import { PlatformData } from "./InfocardList";

// Types and Interfaces
interface PlatformVariable {
  key: string;
  proper_key?: string;
  value: string | number | boolean | object;
  type?: string;
}

interface SpecFormatItem {
  registered?: { type?: string; proper_key?: string; value: boolean };
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

// Utility Functions
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

const formatTitle = (title: string): string => {
  return title
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// Memoized Primary Info Extractor
const usePrimaryInfoExtractor = () => {
  return useMemo(
    () => (specFormat: SpecFormatItem[]) => {
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
    },
    []
  );
};

// Reusable Components
const CopyButton = React.memo(
  ({ onClick, isCopied, size = 16 }: { onClick: () => void; isCopied: boolean; size?: number }) => (
    <button
      onClick={onClick}
      aria-label={isCopied ? "Copied" : "Copy"}
      className={`p-1.5 rounded-full transition-all duration-200 ${
        isCopied ? "bg-white/10 text-white" : "hover:bg-white/5 text-gray-400 hover:text-white"
      }`}
    >
      {isCopied ? <Check size={size} /> : <Copy size={size} />}
    </button>
  )
);

CopyButton.displayName = "CopyButton";

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

  const getPrimaryInfo = usePrimaryInfoExtractor();

  // Preserve selected item when data updates
  useEffect(() => {
    if (selectedItem) {
      const updatedItem = filteredUsers.find(
        (user) => user.module === selectedItem.module && user.query === selectedItem.query
      );
      if (updatedItem && JSON.stringify(updatedItem) !== JSON.stringify(selectedItem)) {
        setSelectedItem(updatedItem);
      }
    }
  }, [filteredUsers, selectedItem]);

  // Resize panel logic
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;
      const containerRect = document
        .getElementById("list-detail-container")
        ?.getBoundingClientRect();
      if (containerRect) {
        const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
        setLeftPanelWidth(Math.max(20, Math.min(80, newWidth)));
      }
    },
    [isResizing]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

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

  // Memoized handler for opening details
  const handleOpenDetails = useCallback((item: PlatformData, index: number) => {
    setSelectedItem(item);
    setSelectedItemIndex(index);
  }, []);

  // Memoize the list of users
  const memoizedUsers = useMemo(() => filteredUsers, [filteredUsers]);

  // Render methods
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-4">
        <User size={24} className="text-gray-400" />
      </div>
      <p className="text-gray-300 text-lg font-medium">No user data available</p>
      <p className="text-gray-400 text-sm mt-1">Try adjusting your search criteria</p>
    </div>
  );

  // ListViewItem Component
  const ListViewItem = React.memo<{
    user: PlatformData;
    isSelected: boolean;
    onSelect: () => void;
    showSelection: boolean;
    index: number;
  }>(({ user, isSelected, onSelect, showSelection, index }) => {
    const primaryInfo = getPrimaryInfo(user.spec_format);
    const displayName = primaryInfo.name || primaryInfo.username || primaryInfo.email || "Unknown";

    return (
      <div
        className={`relative flex flex-col p-4 rounded-lg transition-all duration-200 cursor-pointer hover:border-teal-400/30 border-2 overflow-hidden ${
          isSelected
            ? enableselect
              ? "border-teal-400 bg-teal-400/10 shadow-lg"
              : "border-gray-400 bg-gray-400/10 shadow-lg"
            : "border-white/20 bg-black/50 backdrop-blur-sm"
        }`}
        onClick={() => {
          if (!showSelection) {
            handleOpenDetails(user, index);
          } else {
            onSelect();
          }
        }}
        aria-selected={isSelected}
      >
        {/* Selection checkbox */}
        {showSelection && (
          <div className="cursor-pointer mb-3">
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-start transition-all duration-200 ${
                isSelected
                  ? enableselect
                    ? "bg-teal-400 border-teal-400 text-black"
                    : "bg-gray-400 border-gray-400 text-black"
                  : "border-white/30 hover:border-teal-400"
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

        {/* Main Content */}
        <div className="flex items-center gap-3">
          {/* Profile img */}
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
            {primaryInfo.picture_url ? (
              <img
                src={primaryInfo.picture_url}
                alt={displayName}
                width={40}
                height={40}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <User size={14} className="text-gray-400" />
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            {/* Header with Name, Status, and Plus */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-white font-semibold text-sm truncate max-w-[180px]">
                  {displayName}
                </h3>
                {/* Status Badges */}
                <div className="flex items-center space-x-1">
                  {primaryInfo.verified && (
                    <div title="Verified">
                      <Shield size={8} className="text-teal-400" />
                    </div>
                  )}
                  {primaryInfo.breach && (
                    <div title="Breached">
                      <AlertTriangle size={8} className="text-red-400" />
                    </div>
                  )}
                </div>
              </div>
              {/* Plus sign indicator */}
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white/10 border border-white/20 group-hover:bg-teal-400/20 group-hover:border-teal-400/30 transition-all duration-200">
                <Plus size={10} className="text-white/60 group-hover:text-teal-400 transition-colors duration-200" />
              </div>
            </div>

            {/* Platform and Contact Info Row */}
            <div className="flex items-center gap-3 mb-1">
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Globe size={8} className="text-blue-400" />
                <span className="font-medium">{user.module || user.pretty_name}</span>
              </div>
              
              {/* Contact Info Pills */}
              <div className="flex items-center gap-1">
                {primaryInfo.email && (
                  <div className="flex items-center gap-1 bg-white/5 px-1.5 py-0.5 rounded text-xs border border-white/10">
                    <Mail size={8} className="text-blue-400" />
                    <span className="truncate max-w-[100px] text-gray-300" title={primaryInfo.email}>
                      {primaryInfo.email.split('@')[0]}
                    </span>
                  </div>
                )}
                {primaryInfo.username && (
                  <div className="flex items-center gap-1 bg-white/5 px-1.5 py-0.5 rounded text-xs border border-white/10">
                    <Hash size={8} className="text-green-400" />
                    <span className="truncate max-w-[60px] text-gray-300" title={primaryInfo.username}>
                      {primaryInfo.username}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Info Row */}
            <div className="flex items-center gap-3 text-xs text-gray-400">
              {primaryInfo.location && (
                <div className="flex items-center gap-1">
                  <MapPin size={8} className="text-gray-400" />
                  <span className="truncate max-w-[60px]">{primaryInfo.location}</span>
                </div>
              )}
              {primaryInfo.age && (
                <div className="flex items-center gap-1">
                  <User size={8} className="text-gray-400" />
                  <span>{primaryInfo.age}</span>
                </div>
              )}
              {primaryInfo.creation_date && (
                <div className="flex items-center gap-1">
                  <Clock size={8} className="text-gray-400" />
                  <span className="whitespace-nowrap">{formatDate(primaryInfo.creation_date)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  });

  ListViewItem.displayName = "ListViewItem";

  // Detailed Panel Component
  const DetailPanel: React.FC = () => {
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [showJson, setShowJson] = useState(false);

    if (!selectedItem) {
      return (
        <div className="flex items-center justify-center h-full text-gray-400">
          <div className="text-center">
            <Eye size={48} className="mx-auto mb-4 opacity-25" />
            <p className="text-lg font-medium">Select an item to view details</p>
            <p className="text-sm opacity-50">
              Click on any item from the list to see detailed information
            </p>
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

    const renderValue = (value: unknown, key: string) => {
      // Handle null/undefined
      if (value === null || value === undefined) {
        return (
          <span className="text-gray-400 bg-white/5 px-3 py-1.5 rounded text-sm italic border border-white/20">
            No value
          </span>
        );
      }

      // Handle all object types (arrays and objects) as JSON
      if (typeof value === "object") {
        try {
          return (
            <div className="bg-black/50 rounded border border-white/20 p-3 max-h-32 overflow-y-auto">
              <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap">
                {JSON.stringify(value, null, 2)}
              </pre>
            </div>
          );
        } catch (jsonError) {
          console.error("Error stringifying object:", jsonError);
          return (
            <span className="text-red-400 bg-white/5 px-3 py-1.5 rounded text-sm border border-white/20">
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
          <span className="font-mono text-sm bg-black/50 border border-white/20 px-3 py-1.5 rounded text-white break-all">
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
          <span className="text-white bg-white/5 px-3 py-1.5 rounded text-sm border border-white/20">
            {formatDate(stringValue)}
          </span>
        );
      }

      if (typeof value === "boolean") {
        return (
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium border ${
              value
                ? "bg-green-500/20 text-green-400 border-green-500/30"
                : "bg-red-500/20 text-red-400 border-red-500/30"
            }`}
          >
            {value ? "Yes" : "No"}
          </span>
        );
      }

      return (
        <span className="text-white bg-white/5 px-3 py-1.5 rounded text-sm border border-white/20">{stringValue}</span>
      );
    };

    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-black/50 backdrop-blur-sm border-b border-white/20">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-white/10 flex items-center justify-center border border-white/20">
              {primaryInfo.picture_url ? (
                <img
                  src={primaryInfo.picture_url}
                  alt={primaryInfo.name || "Profile"}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <User size={24} className="text-gray-400" />
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
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8">
          {/* Dynamic Fields */}
          <div className="flex flex-col gap-4">
            {spec &&
              Object.entries(spec)
                .filter(([key, value]) => {
                  if (key === "platform_variables") return false;
                  return value && typeof value === "object" && "value" in value;
                })
                .map(([key, value]) => {
                  let actualValue: unknown;
                  try {
                    actualValue =
                      value && typeof value === "object" && "value" in value ? value.value : value;
                  } catch (error) {
                    console.error("Error extracting value:", error);
                    actualValue = "[Error extracting value]";
                  }

                  if (actualValue === null || actualValue === undefined) return null;

                  return (
                    <div
                      key={key}
                      className="group w-full rounded-xl bg-gradient-to-br from-white/5 via-white/2 to-white/0 border border-white/10 hover:border-teal-400/40 shadow-sm hover:shadow-teal-400/10 transition-all duration-200 px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="text-xs font-semibold text-teal-300 uppercase tracking-wider mb-1.5 select-none">
                            {formatTitle(key)}
                          </span>
                          <span className="text-white text-base break-words leading-snug">
                            {renderValue(actualValue, key)}
                          </span>
                        </div>
                        <div className="ml-2">
                          <CopyButton
                            onClick={() => {
                              let copyText: string;
                              try {
                                copyText =
                                  typeof actualValue === "object"
                                    ? JSON.stringify(actualValue, null, 2)
                                    : String(actualValue);
                                handleCopyField(copyText, key);
                              } catch (error) {
                                console.error("Error copying value:", error);
                                handleCopyField("[Unable to copy value]", key);
                              }
                            }}
                            isCopied={copiedField === key}
                            size={16}
                          />
                        </div>
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
                <div className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-1.5">
                  Platform
                </div>
                <div className="text-white">{selectedItem.module || "Unknown"}</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-1.5">
                  Website
                </div>
                <a
                  href={`https://${selectedItem.module || selectedItem.pretty_name}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1 group"
                >
                  {selectedItem.module || selectedItem.pretty_name}.com
                  <ExternalLink
                    size={12}
                    className="opacity-50 group-hover:opacity-100 transition-opacity"
                  />
                </a>
              </div>
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
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/20">
                  <Shield size={14} className="text-teal-400" />
                  <span className="text-sm text-white">Verified</span>
                </div>
              )}
              {primaryInfo.breach && (
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/20">
                  <AlertTriangle size={14} className="text-red-400" />
                  <span className="text-sm text-white">Security Breach</span>
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
              <div
                className={`transform transition-transform duration-200 ${
                  showJson ? "rotate-90" : ""
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">Raw JSON Data</span>
            </button>
            {showJson && (
              <div className="mt-4 bg-white/5 rounded-lg p-4 overflow-x-auto border border-white/20">
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

  DetailPanel.displayName = "DetailPanel";

  return (
    <div
      id="list-detail-container"
      className="flex h-[1000px] border border-white/20 rounded-lg overflow-hidden bg-black/50 backdrop-blur-sm"
      role="region"
      aria-label="User Details List View"
    >
      {/* Left Panel - List View */}
      <div
        className="flex flex-col overflow-hidden border-r border-white/20"
        style={{ width: `${leftPanelWidth}%` }}
        role="list"
      >
        {/* List Header */}
        <div className="p-4 border-b border-white/20 bg-black/30 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Variable Window</h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Resize window:</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setLeftPanelWidth(30)}
                  className={`px-2 py-1 rounded transition-colors ${
                    leftPanelWidth <= 30 ? "bg-white/10 text-white" : "hover:bg-white/5"
                  }`}
                >
                  30%
                </button>
                <button
                  onClick={() => setLeftPanelWidth(50)}
                  className={`px-2 py-1 rounded transition-colors ${
                    leftPanelWidth > 30 && leftPanelWidth <= 50
                      ? "bg-white/10 text-white"
                      : "hover:bg-white/5"
                  }`}
                >
                  50%
                </button>
                <button
                  onClick={() => setLeftPanelWidth(70)}
                  className={`px-2 py-1 rounded transition-colors ${
                    leftPanelWidth > 50 ? "bg-white/10 text-white" : "hover:bg-white/5"
                  }`}
                >
                  70%
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-white/10">
          {memoizedUsers.length > 0
            ? memoizedUsers.map((user, index) => (
                <div
                  key={`${user.module}-${user.query}-${index}`}
                  className={`transition-all duration-200 ${
                    selectedItemIndex === index ? "ring-2 ring-teal-400 rounded-lg" : ""
                  }`}
                  role="listitem"
                >
                  <ListViewItem
                    user={user}
                    isSelected={selectedIndices.includes(index)}
                    onSelect={() => handleCardSelect(index)}
                    showSelection={enableselect || deletebutton}
                    index={index}
                  />
                </div>
              ))
            : renderEmptyState()}
        </div>
      </div>

      {/* Resizer */}
      <div
        className="w-1.5 bg-gradient-to-b from-white/20 to-white/30 hover:from-teal-400/50 hover:to-teal-400/30 cursor-col-resize flex items-center justify-center group transition-all duration-200 relative"
        onMouseDown={handleMouseDown}
        role="separator"
        aria-label="Resize panel"
      >
        <div className="w-0.5 h-12 bg-white/40 group-hover:bg-teal-400 rounded-full shadow-sm transition-all duration-200"></div>
        <div className="absolute inset-0 bg-transparent group-hover:bg-teal-400/10 rounded-sm transition-all duration-200"></div>
      </div>

      {/* Right Panel - Detail View */}
      <div
        className="flex flex-col bg-black/30 backdrop-blur-sm"
        style={{ width: `${100 - leftPanelWidth - 0.5}%` }}
        role="region"
        aria-label="User Details"
      >
        <DetailPanel />
      </div>
    </div>
  );
};

ListView.displayName = "ListView";

// Memoize the entire ListView component
export default React.memo(ListView);
