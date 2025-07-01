import React, { useState, useEffect } from "react";
import InfoCard from "./ProfileSection";
import SelectInfo from "./SelectInfo";
import CategoryCard from "./categoryCard";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Grid,
  List,
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

interface PlatformVariable {
  key: string;
  proper_key?: string;
  value: string;
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

interface PlatformData {
  module: string;
  schemaModule: string;
  status: string;
  query: string;
  pretty_name: string;
  from: string;
  reliable_source: boolean;
  category: {
    name: string;
    description: string;
  };
  spec_format: SpecFormatItem[];
}

interface InfoCardListProps {
  users: PlatformData[];
  hidebutton: boolean;
  PaidSearch: string;
  sethidebutton: React.Dispatch<React.SetStateAction<boolean>>;
  fulldata: PlatformData[];
}

const InfoCardList: React.FC<InfoCardListProps> = ({
  users,
  hidebutton,
  PaidSearch,
  sethidebutton,
  fulldata,
}) => {
  const [enableselect, setenableselect] = useState(false);
  const [deletebutton, setdeletebutton] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<PlatformData[]>([]);
  const [Cards, setCards] = useState<PlatformData[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [selectedItem, setSelectedItem] = useState<PlatformData | null>(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [leftPanelWidth, setLeftPanelWidth] = useState(40); // Percentage width of left panel
  const [isResizing, setIsResizing] = useState(false);

  // Function to check if spec_format has only registered and platform_variables
  const hasSimpleSpecFormat = (specFormat: SpecFormatItem[]) => {
    return specFormat.every(
      (item) =>
        Object.keys(item).length === 2 && "registered" in item && "platform_variables" in item
    );
  };
  // Filter users when component mounts or users prop changes
  useEffect(() => {
    const filtered = users.filter((user) => hasSimpleSpecFormat(user.spec_format));
    const withoutCard = users.filter((user) => !hasSimpleSpecFormat(user.spec_format));
    setFilteredUsers(withoutCard);
    setCards(filtered);
    // Reset selection when data changes
    setSelectedIndices([]);
  }, [users]);

  // Function to handle card selection
  const handleCardSelect = (index: number) => {
    setSelectedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Function to permanently delete selected cards
  const permanentlyDeleteSelectedCards = () => {
    const updatedUsers = filteredUsers.filter((_, index) => !selectedIndices.includes(index));
    setFilteredUsers(updatedUsers);
    setSelectedIndices([]);
    setenableselect(false);
    setdeletebutton(false);
  };

  const handleDelete = (index: number) => {
    setFilteredUsers(filteredUsers.filter((_, i) => i !== index));
  };

  // Handle opening detailed view
  const handleOpenDetails = (item: PlatformData, index: number) => {
    setSelectedItem(item);
    setSelectedItemIndex(index);
  };

  // Handle mouse events for resizing
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    const containerRect = document.getElementById('list-detail-container')?.getBoundingClientRect();
    if (containerRect) {
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      setLeftPanelWidth(Math.max(20, Math.min(80, newWidth)));
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  // Add event listeners for mouse events
  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing]);

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
            <Eye size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Select an item to view details</p>
            <p className="text-sm opacity-75">Click on any item from the list to see detailed information</p>
          </div>
        </div>
      );
    }

    const primaryInfo = getPrimaryInfo(selectedItem.spec_format);

    // Helper functions from expand.tsx
    const handleCopyField = (text: string, fieldName: string) => {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedField(fieldName);
        setTimeout(() => setCopiedField(null), 2000);
      });
    };

    const formatDate = (dateString: string): string => {
      if (!dateString) return "";
      try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
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

    const CopyButton = ({ onClick, isCopied, size = 16 }: { onClick: () => void; isCopied: boolean; size?: number }) => (
      <button
        onClick={onClick}
        className={`p-1.5 rounded transition-all duration-200 ${
          isCopied 
            ? "bg-green-500 text-white" 
            : "hover:bg-gray-700 text-gray-400 hover:text-white"
        }`}
      >
        {isCopied ? <Check size={size} /> : <Copy size={size} />}
      </button>
    );





    const renderValue = (value: unknown, key: string) => {
      // Debug logging to catch problematic values
      if (typeof value === "object" && value !== null) {
        console.log("Rendering object for key:", key, "Value:", value);
      }

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
        // Extra safety for primitive conversion
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

    const spec = selectedItem.spec_format?.[0];

    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gray-900/50">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-800 border border-gray-600 flex items-center justify-center">
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
                <User size={24} className="text-gray-400" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {primaryInfo.name || primaryInfo.username || primaryInfo.email || "Unknown"}
              </h2>
              <p className="text-gray-300 text-sm">{selectedItem.pretty_name}</p>
            </div>
          </div>
          <button
                         onClick={() => {
               setSelectedItem(null);
               setSelectedItemIndex(null);
             }}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* All Dynamic Fields from spec_format */}
          {spec && Object.entries(spec)
            .filter(([key, value]) => {
              // Skip platform_variables as they're handled separately
              if (key === "platform_variables") return false;
              
              // Check if value has the expected structure
              return value && typeof value === "object" && "value" in value;
            })
            .map(([key, value]) => {
            
            // Safely extract the actual value from the wrapper object
            let actualValue: unknown;
            try {
              if (value && typeof value === "object" && "value" in value) {
                actualValue = (value as { value: unknown }).value;
              } else {
                actualValue = value;
              }
            } catch (error) {
              console.error("Error extracting value:", error);
              actualValue = "[Error extracting value]";
            }
            
            return (
              <div key={key} className="bg-gray-900/30 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-gray-300 text-sm font-medium mb-2">{formatTitle(key)}:</h4>
                    <div className="flex items-center gap-2">
                      {(() => {
                        try {
                          return renderValue(actualValue, key);
                        } catch (error) {
                          console.error("Error rendering value:", error);
                          return (
                            <span className="text-red-400 bg-gray-800/50 px-3 py-1.5 rounded text-sm">
                              [Error displaying value]
                            </span>
                          );
                        }
                      })()}
                    </div>
                  </div>
                  {actualValue !== null && actualValue !== undefined && (
                    <CopyButton
                      onClick={() => {
                        let copyText: string;
                        try {
                          if (typeof actualValue === "object" && actualValue !== null) {
                            copyText = JSON.stringify(actualValue, null, 2);
                          } else {
                            copyText = String(actualValue);
                          }
                          handleCopyField(copyText, key);
                        } catch (error) {
                          console.error("Error copying value:", error);
                          handleCopyField("[Unable to copy value]", key);
                        }
                      }}
                      isCopied={copiedField === key}
                      size={14}
                    />
                  )}
                </div>
              </div>
            );
          })}

          {/* Platform Information */}
          <div className="bg-gray-900/30 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Platform Information</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Platform:</span>
                <span className="text-white">{String(selectedItem.module || 'Unknown')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Website:</span>
                <a
                  href={`https://${selectedItem.module || selectedItem.pretty_name}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline text-sm flex items-center gap-1"
                >
                  {String(selectedItem.module || selectedItem.pretty_name).toUpperCase()}.com
                  <ExternalLink size={12} />
                </a>
              </div>
              {selectedItem.query && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Query Searched:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm bg-black border border-gray-600 px-3 py-1.5 rounded text-white">
                      {String(selectedItem.query)}
                    </span>
                    <CopyButton
                      onClick={() => handleCopyField(String(selectedItem.query), "query")}
                      isCopied={copiedField === "query"}
                      size={14}
                    />
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Status:</span>
                <span className="text-white">{String(selectedItem.status || 'Unknown')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Source:</span>
                <span className="text-white">{String(selectedItem.from || 'Unknown')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Category:</span>
                <span className="text-white">{String(selectedItem.category?.name || 'Unknown')}</span>
              </div>
            </div>
          </div>

          {/* Platform Variables */}
          {spec?.platform_variables && spec.platform_variables.length > 0 && (
            <div className="bg-gray-900/30 rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Platform Variables</h3>
              <div className="space-y-2">
                {spec.platform_variables.map((variable, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">{formatTitle(String(variable.key || 'Unknown'))}:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white bg-gray-800/50 px-2 py-1 rounded">
                        {typeof variable.value === "object" && variable.value !== null
                          ? JSON.stringify(variable.value)
                          : String(variable.value || 'No value')}
                      </span>
                      <CopyButton
                        onClick={() => handleCopyField(
                          typeof variable.value === "object" && variable.value !== null
                            ? JSON.stringify(variable.value)
                            : String(variable.value || 'No value'), 
                          `platform_var_${index}`
                        )}
                        isCopied={copiedField === `platform_var_${index}`}
                        size={12}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status & Security */}
          <div className="bg-gray-900/30 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Shield size={18} className="mr-2" />
              Status & Security
            </h3>
            <div className="flex flex-wrap gap-3">
              {primaryInfo.verified && (
                <div className="flex items-center space-x-2 bg-green-900/20 text-green-400 px-3 py-1 rounded-full border border-green-700">
                  <Shield size={14} />
                  <span className="text-sm">Verified</span>
                </div>
              )}
              {primaryInfo.breach && (
                <div className="flex items-center space-x-2 bg-red-900/20 text-red-400 px-3 py-1 rounded-full border border-red-700">
                  <AlertTriangle size={14} />
                  <span className="text-sm">Security Breach</span>
                </div>
              )}
              {selectedItem.reliable_source && (
                <div className="flex items-center space-x-2 bg-blue-900/20 text-blue-400 px-3 py-1 rounded-full border border-blue-700">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <span className="text-sm">Reliable Source</span>
                </div>
              )}
            </div>
          </div>

          {/* JSON Data Toggle */}
          <div className="bg-gray-900/30 rounded-lg p-4 border border-gray-700">
            <button
              onClick={() => setShowJson(!showJson)}
              className="w-full text-left text-white hover:text-gray-300 transition-colors"
            >
              <h3 className="text-lg font-semibold mb-2">
                {showJson ? "Hide" : "Show"} Raw JSON Data
              </h3>
            </button>
            {showJson && (
              <div className="mt-4 bg-black rounded border border-gray-600 p-4 max-h-60 overflow-y-auto">
                <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap">
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

    // Format date for display
    const formatDisplayDate = (dateString: string): string => {
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

    return (
      <div
        className={`relative flex items-start p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:border-gray-100 ${
          isSelected
            ? enableselect
              ? "border-white bg-gray-100/10 shadow-lg"
              : "border-gray-400 bg-gray-400/10 shadow-lg"
            : "border-gray-600 bg-black "
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
                  {formatDisplayDate(primaryInfo.creation_date)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Get data for export based on mode
  const getExportData = () => {
    if (enableselect && selectedIndices.length > 0) {
      // Select mode: export ONLY selected items
      return selectedIndices.map((index) => filteredUsers[index]).filter(Boolean);
    } else if (deletebutton && selectedIndices.length > 0) {
      // Delete mode: export ALL items EXCEPT selected ones
      return filteredUsers.filter((_, index) => !selectedIndices.includes(index));
    } else {
      // Default: export all items
      return filteredUsers;
    }
  };

  const exportData = getExportData();
  const selectedCount = selectedIndices.length;
  const exportCount = exportData.length;

  // Convert to format compatible with ActionBar
  const convertedExportData = exportData.map((item) => ({
    module: item.module,
    pretty_name: item.pretty_name,
    query: item.query,
    status: item.status,
    from: item.from,
    reliable_source: item.reliable_source,
    category: item.category,
    spec_format: item.spec_format.map((spec) => {
      const converted: Record<string, unknown> = {};
      Object.entries(spec).forEach(([key, value]) => {
        if (key === "platform_variables") {
          converted[key] = value;
        } else if (value && typeof value === "object" && "value" in value) {
          converted[key] = value;
        }
      });
      return converted;
    }),
  }));

  return (
    <div className="border border-gray-800 rounded-lg p-6">
      {/* ActionBar with export functionality */}
      <SelectInfo
        data={fulldata}
        selectedData={convertedExportData}
        hidebutton={hidebutton}
        sethidebutton={sethidebutton}
        setenableselect={setenableselect}
        enableselect={enableselect}
        filteredUsers={filteredUsers}
        selectedCount={selectedCount}
        exportMode={enableselect ? "selected" : deletebutton ? "excluding_deleted" : "all"}
        exportCount={exportCount}
      />

      {/* Control buttons */}
      <div className="flex flex-col gap-4 my-4">
        {/* View Toggle */}
        <div className="flex justify-between items-center">
          <div className="flex rounded-lg border border-gray-600 bg-black p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                viewMode === "grid"
                  ? "bg-white text-black shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`}
            >
              <Grid size={16} />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                viewMode === "list"
                  ? "bg-white text-black shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`}
            >
              <List size={16} />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <div className="flex justify-end">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => {
                      if (enableselect) {
                        setenableselect(false);
                        setSelectedIndices([]);
                      } else {
                        setenableselect(true);
                        setdeletebutton(false);
                        setSelectedIndices([]);
                      }
                    }}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl ${
                      enableselect
                        ? "bg-white text-black hover:bg-gray-200"
                        : "bg-black text-white border border-gray-600 hover:bg-gray-900"
                    }`}
                  >
                    <span>{enableselect ? "Cancel Selection" : "Select for Export"}</span>
                    {enableselect && selectedCount > 0 && (
                      <span className="bg-black/20 px-2 py-0.5 rounded-full text-sm">
                        {selectedCount}
                      </span>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-black text-white border border-gray-600">
                  <p>
                    {enableselect
                      ? "Cancel selection mode"
                      : "Select specific cards to export ONLY those cards"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex justify-end">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => {
                      if (deletebutton) {
                        setdeletebutton(false);
                        setSelectedIndices([]);
                      } else {
                        setdeletebutton(true);
                        setenableselect(false);
                        setSelectedIndices([]);
                      }
                    }}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl ${
                      deletebutton
                        ? "bg-gray-400 text-black hover:bg-gray-300"
                        : "bg-black text-white border border-gray-600 hover:bg-gray-900"
                    }`}
                  >
                    <span>
                      {deletebutton ? "Cancel Exclude" : "Exclude from Export"}
                      {deletebutton && selectedCount > 0 && (
                        <span className="bg-black/20 px-2 py-0.5 rounded-full text-sm ml-2">
                          {selectedCount} excluded
                        </span>
                      )}
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-black text-white border border-gray-600">
                  <p>
                    {deletebutton
                      ? "Cancel exclude mode"
                      : "Select specific cards to EXCLUDE from export. All other cards will be exported."}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Export info banner */}
        {(enableselect || deletebutton) && (
          <div>
            <div
              className={`p-4 rounded-lg border text-sm font-medium shadow-lg ${
                enableselect
                  ? "bg-gray-100 border-gray-300 text-black"
                  : "bg-gray-800 border-gray-600 text-gray-200"
              }`}
            >
              {enableselect ? (
                selectedCount > 0 ? (
                  <span className="flex items-center gap-2">
                    <span className="text-lg">📤</span>
                    Export will include ONLY {selectedCount} selected record(s)
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span className="text-lg">👆</span>
                    Select cards to export ONLY those specific records
                  </span>
                )
              ) : selectedCount > 0 ? (
                <span className="flex items-center gap-2">
                  <span className="text-lg">📤</span>
                  Export will include {filteredUsers.length - selectedCount} record(s) (excluding{" "}
                  {selectedCount} selected)
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span className="text-lg">❌</span>
                  Select cards to EXCLUDE from export
                </span>
              )}
            </div>
          </div>
        )}

        {/* Permanent delete confirmation dialog */}
        {selectedIndices.length > 0 && deletebutton && (
          <div className="px-2">
            <AlertDialog>
              <AlertDialogTrigger className="text-white font-medium bg-gray-700 hover:bg-gray-600 px-6 py-2.5 rounded-lg text-center transition-all duration-200 shadow-lg">
                Permanently Delete Selected ({selectedIndices.length})
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-black border border-gray-600">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl font-bold text-white">
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-300">
                    This action cannot be undone. This will permanently delete{" "}
                    {selectedIndices.length} selected record(s) from your data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-600">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={permanentlyDeleteSelectedCards}
                    className="bg-gray-600 hover:bg-gray-500 text-white font-medium"
                  >
                    Delete {selectedIndices.length} Record(s)
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      {/* List-Detail Layout */}
      {viewMode === "list" ? (
        <div
          id="list-detail-container"
          className="flex h-[75vh] border border-gray-600 rounded-lg overflow-hidden bg-gray-900/20"
        >
          {/* Left Panel - List View */}
          <div
            className="flex flex-col overflow-hidden border-r border-gray-700"
            style={{ width: `${leftPanelWidth}%` }}
          >
            <div className="p-4 border-b border-gray-700 bg-gray-900/50">
              <h3 className="text-white font-semibold">Results ({filteredUsers.length})</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <div key={index} className={`transition-all duration-200 ${selectedItemIndex === index ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}>
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
      ) : (
        // Grid View (existing InfoCard components)
        <div className="grid grid-cols-1 lg:grid-cols-2 border border-gray-600 rounded-lg p-6 gap-10 sm:gap-4 max-h-[3000px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-500">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <div key={index} className="relative">
                {/* Single selection circle - only show when in selection mode */}
                {(enableselect || deletebutton) && (
                  <div
                    className="absolute top-3 right-3 z-20 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardSelect(index);
                    }}
                  >
                    <div
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 shadow-lg ${
                        selectedIndices.includes(index)
                          ? enableselect
                            ? "bg-white border-white text-black"
                            : "bg-gray-400 border-gray-400 text-black"
                          : "bg-black border-gray-500 hover:border-white hover:bg-gray-900 backdrop-blur-sm"
                      }`}
                    >
                      {selectedIndices.includes(index) ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-gray-500"></div>
                      )}
                    </div>
                  </div>
                )}

                {/* Info Card - convert to compatible format */}
                <div
                  className={`transition-all duration-300 ${
                    selectedIndices.includes(index)
                      ? enableselect
                        ? "ring-2 ring-white rounded-xl shadow-lg"
                        : "ring-2 ring-gray-400 rounded-xl shadow-lg"
                      : ""
                  }`}
                >
                  <InfoCard
                    userData={{
                      module: user.module,
                      schemaModule: user.schemaModule,
                      pretty_name: user.pretty_name,
                      query: user.query,
                      status: user.status,
                      from: user.from,
                      reliable_source: user.reliable_source,
                      category: user.category,
                      spec_format: user.spec_format.map((spec) => {
                        const converted: { [key: string]: { value: string | boolean | number } } =
                          {};
                        Object.entries(spec).forEach(([key, value]) => {
                          if (
                            key !== "platform_variables" &&
                            value &&
                            typeof value === "object" &&
                            "value" in value
                          ) {
                            // Keep fields with value property
                            converted[key] = value as { value: string | boolean | number };
                          }
                        });
                        return converted;
                      }),
                    }}
                    hidebutton={hidebutton}
                    PaidSearch={PaidSearch}
                    isSelected={selectedIndices.includes(index)}
                    onSelect={() => handleCardSelect(index)}
                    enableselect={enableselect || deletebutton}
                    onDelete={() => handleDelete(index)}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center col-span-full">
              <div className="w-16 h-16 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center mb-4">
                <User size={24} className="text-gray-500" />
              </div>
              <p className="text-gray-400 text-lg font-medium">No user data available</p>
              <p className="text-gray-500 text-sm mt-1">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      )}



      {/* Category Cards */}
      {Cards.length > 0 && <CategoryCard CardData={Cards} />}
    </div>
  );
};

export default InfoCardList;
