import React from "react";
import { motion } from "framer-motion";
import { Copy, Globe, Check, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import CompanyLogo from "@/components/ActivityComponent/Logo";
import { useState } from "react";
import {
  Expand,
  PlatformData,
  SpecFormatValue,
  SpecFormat,
} from "@/components/ActivityComponent/expand";
import "./ProfileSection.css";

interface InfoCardProps {
  userData: PlatformData;
  hidebutton?: boolean;
  PaidSearch?: string;
  isSelected?: boolean;
  onSelect?: () => void;
  enableselect?: boolean;
  onDelete?: () => void;
}

// Helper function to format titles
const formatTitle = (title: string): string => {
  return title
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// Helper function to format dates
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

interface GridViewProps {
  filteredUsers: PlatformData[];
  selectedIndices: number[];
  handleCardSelect: (index: number) => void;
  enableselect: boolean;
  deletebutton: boolean;
  hidebutton: boolean;
  PaidSearch: string;
  handleDelete: (index: number) => void;
}

const GridView: React.FC<GridViewProps> = ({
  filteredUsers,
  selectedIndices,
  handleCardSelect,
  enableselect,
  deletebutton,
  hidebutton,
  PaidSearch,
  handleDelete,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 border border-border rounded-lg p-6 gap-10 sm:gap-4 max-h-[5000px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground scrollbar-track-muted hover:scrollbar-thumb-foreground">
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
                        ? "bg-foreground border-foreground text-background"
                        : "bg-muted-foreground border-muted-foreground text-background"
                      : "bg-background border-border hover:border-foreground hover:bg-accent backdrop-blur-sm"
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
                    <div className="w-3 h-3 rounded-full border border-border"></div>
                  )}
                </div>
              </div>
            )}

            {/* Info Card - convert to compatible format */}
            <div
              className={`transition-all duration-300 ${
                selectedIndices.includes(index)
                  ? enableselect
                    ? "ring-2 ring-foreground rounded-xl shadow-lg"
                    : "ring-2 ring-muted-foreground rounded-xl shadow-lg"
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
                    const converted: { [key: string]: { value: string | boolean | number } } = {};
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
          <div className="w-16 h-16 rounded-full bg-muted border border-border flex items-center justify-center mb-4">
            <User size={24} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-lg font-medium">No user data available</p>
          <p className="text-muted-foreground text-sm mt-1">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default GridView;
const InfoCard: React.FC<InfoCardProps> = ({ userData }) => {
  const { module, pretty_name, spec_format } = userData;

  // Helper function to safely get value from spec format
  const getSpecValue = (
    spec: SpecFormat | undefined,
    key: string
  ): string | boolean | number | null => {
    if (!spec || !spec[key as keyof SpecFormat]) return null;
    const value = spec[key as keyof SpecFormat];
    if (value && typeof value === "object" && "value" in value) {
      return (value as SpecFormatValue).value;
    }
    return null;
  };

  const isBreached = getSpecValue(spec_format?.[0], "breach") || false;
  const verified = getSpecValue(spec_format?.[0], "verified") || false;
  const premium = getSpecValue(spec_format?.[0], "premium") || false;

  const platformName = module;
  const websiteValue = getSpecValue(spec_format?.[0], "website");
  const website = typeof websiteValue === "string" ? websiteValue : platformName;
  const profileURL = String(getSpecValue(spec_format?.[0], "profile_url") || "");
  const [isOpen, setIsOpen] = useState(false);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const handleCopyWithEffect = (text: string, key: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedStates((prev) => ({ ...prev, [key]: true }));
        setTimeout(() => {
          setCopiedStates((prev) => ({ ...prev, [key]: false }));
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div
    className="bg-background  border border-border rounded-lg  h-[700px] overflow-y-auto"
    >
      {/* Header Section */}
      <div className="flex items-center gap-4 p-3 border-b border-border bg-muted/50 rounded-t-xl">
        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center border border-border shadow-lg">
          <CompanyLogo companyName={platformName} />
        </div>
        <div className="flex-1">
          <h3 className="text-foreground text-xl md:text-2xl font-bold capitalize">
            {platformName}
          </h3>
          <p className="text-muted-foreground text-sm">{pretty_name}</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-2 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Image Section */}
          <div className="lg:col-span-1 flex flex-col items-center space-y-2">
            <div className="relative group">
              <img
                className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-xl border-2 border-border shadow-lg transition-all duration-300 group-hover:border-muted-foreground"
                src={String(
                  getSpecValue(spec_format?.[0], "picture_url") ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                )}
                alt="Profile"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
                }}
              />
            </div>

            {profileURL && (
              <motion.a
                href={profileURL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-muted hover:bg-muted/80 border border-border text-foreground px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Globe size={16} />
                <span className="hidden sm:inline">View Profile</span>
                <span className="sm:hidden">Profile</span>
              </motion.a>
            )}

            {/* Status Badges */}
            <div className="flex flex-wrap gap-2 justify-center">
              {premium && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border hover:bg-muted/80 transition-all duration-200 flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></div>
                  Premium
                </motion.span>
              )}
              {verified && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground border border-border hover:bg-accent/80 transition-all duration-200 flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-foreground"></div>
                  Verified
                </motion.span>
              )}
              {isBreached && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-destructive/20 text-destructive border border-destructive/30 hover:bg-destructive/30 transition-all duration-200 flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive"></div>
                  Breached
                </motion.span>
              )}
            </div>
          </div>

          {/* Information Section */}
          <div className="lg:col-span-2 space-y-4">
            {/* Website */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 bg-muted/30 rounded-lg border border-border">
              <span className="text-muted-foreground text-sm font-semibold min-w-[100px]">
                Website:
              </span>
              {website && typeof website === "string" ? (
                <a
                  href={`https://${website}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium underline decoration-muted-foreground/30 hover:decoration-foreground"
                >
                  {website.toUpperCase()}.com
                </a>
              ) : (
                <a
                  href={`https://${platformName}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium underline decoration-muted-foreground/30 hover:decoration-foreground"
                >
                  {platformName.toUpperCase()}.com
                </a>
              )}
            </div>

            {/* Dynamic Spec Format Data */}
            {spec_format?.map((item, index) =>
              Object.entries(item).map(
                ([key, value]) =>
                  key !== "platform_variables" &&
                  !key.includes("url") && (
                    <div
                      key={`${index}-${key}`}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 bg-muted/30 rounded-lg border border-border hover:border-muted-foreground transition-all duration-200"
                    >
                      <span className="text-muted-foreground text-sm font-semibold min-w-[100px]">
                        {formatTitle(key)}:
                      </span>
                      <div className="flex items-center gap-3 flex-1 sm:justify-end">
                        {key === "id" ? (
                          <>
                            <span className="text-foreground font-mono text-sm bg-muted border border-border px-3 py-1 rounded-lg break-all">
                              {(value as SpecFormatValue).value}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                handleCopyWithEffect(
                                  (value as SpecFormatValue).value.toString(),
                                  `${index}-${key}-id`
                                )
                              }
                              className={`rounded-lg transition-all duration-300 p-2 border border-border ${
                                copiedStates[`${index}-${key}-id`]
                                  ? "bg-accent hover:bg-accent/80"
                                  : "hover:bg-muted"
                              }`}
                            >
                              {copiedStates[`${index}-${key}-id`] ? (
                                <Check size={14} className="text-muted-foreground" />
                              ) : (
                                <Copy size={14} className="text-muted-foreground" />
                              )}
                            </motion.button>
                          </>
                        ) : key === "last_seen" || key === "creation_date" ? (
                          <div className="flex items-center gap-3">
                            <span className="text-foreground font-medium bg-muted border border-border px-3 py-1 rounded-lg">
                              {formatDate((value as SpecFormatValue).value.toString())}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                handleCopyWithEffect(
                                  (value as SpecFormatValue).value.toString(),
                                  `${index}-${key}-date`
                                )
                              }
                              className={`rounded-lg transition-all duration-300 p-2 border border-border ${
                                copiedStates[`${index}-${key}-date`]
                                  ? "bg-accent hover:bg-accent/80"
                                  : "hover:bg-muted"
                              }`}
                            >
                              {copiedStates[`${index}-${key}-date`] ? (
                                <Check size={14} className="text-muted-foreground" />
                              ) : (
                                <Copy size={14} className="text-muted-foreground" />
                              )}
                            </motion.button>
                          </div>
                        ) : typeof (value as SpecFormatValue).value === "boolean" ? (
                          <span
                            className={`px-4 py-1 rounded-full text-xs font-medium border-2 ${
                              (value as SpecFormatValue).value
                                ? "bg-accent text-accent-foreground border-border"
                                : "bg-muted text-muted-foreground border-border"
                            }`}
                          >
                            {(value as SpecFormatValue).value ? "Yes" : "No"}
                          </span>
                        ) : (
                          <span className="text-foreground font-medium bg-muted px-3 py-1 rounded-lg border border-border break-all">
                            {(value as SpecFormatValue).value}
                          </span>
                        )}
                      </div>
                    </div>
                  )
              )
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-border bg-muted/50 rounded-b-xl">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-muted cursor-pointer hover:bg-muted/80 border border-border text-foreground text-lg font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          onClick={() => setIsOpen(true)}
        >
          Expand
        </motion.button>
        <Expand isDetailsOpen={isOpen} setIsDetailsOpen={setIsOpen} selectedItem={userData} />
      </div>
    </div>
  );
};
