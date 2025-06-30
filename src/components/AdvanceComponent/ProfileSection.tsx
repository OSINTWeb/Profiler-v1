import React from "react";
import { motion } from "framer-motion";
import { Copy, Globe, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import CompanyLogo from "@/components/ActivityComponent/Logo";
import { useState } from "react";

import { Expand, PlatformData, SpecFormatValue, SpecFormat } from "@/components/ActivityComponent/expand";
import "./ProfileSection.css"
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

const InfoCard: React.FC<InfoCardProps> = ({
  userData, 

}) => {
  const { module, pretty_name, spec_format } = userData;
  
  // Helper function to safely get value from spec format
  const getSpecValue = (spec: SpecFormat | undefined, key: string): string | boolean | number | null => {
    if (!spec || !spec[key as keyof SpecFormat]) return null;
    const value = spec[key as keyof SpecFormat];
    if (value && typeof value === 'object' && 'value' in value) {
      return (value as SpecFormatValue).value;
    }
    return null;
  };

  const isBreached = getSpecValue(spec_format?.[0], 'breach') || false;
  const verified = getSpecValue(spec_format?.[0], 'verified') || false;
  const premium = getSpecValue(spec_format?.[0], 'premium') || false;

  const platformName = module;
  const websiteValue = getSpecValue(spec_format?.[0], 'website');
  const website = typeof websiteValue === 'string' ? websiteValue : platformName;
  const profileURL = String(getSpecValue(spec_format?.[0], 'profile_url') || "");
  const [isOpen, setIsOpen] = useState(false);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const handleCopyWithEffect = (text: string, key: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedStates(prev => ({ ...prev, [key]: true }));
        setTimeout(() => {
          setCopiedStates(prev => ({ ...prev, [key]: false }));
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };



  return (
    <Card className="bg-black border border-gray-600 flex flex-col w-full rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/40 hover:border-gray-500 h-[700px] relative "
    
    
    >
      {/* Header Section */}
      <div className="flex items-center gap-4 p-6 border-b border-gray-700 bg-gray-900/50 rounded-t-xl">
        <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center border border-gray-600 shadow-lg">
          <CompanyLogo companyName={platformName} />
        </div>
        <div className="flex-1">
          <h3 className="text-white text-xl md:text-2xl font-bold capitalize">{platformName}</h3>
          <p className="text-gray-400 text-sm">{pretty_name}</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Image Section */}
          <div className="lg:col-span-1 flex flex-col items-center space-y-4">
            <div className="relative group">
              <img
                className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-xl border-2 border-gray-600 shadow-lg transition-all duration-300 group-hover:border-gray-500 "
                src={
                  String(getSpecValue(spec_format?.[0], 'picture_url') || 
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png")
                }
                alt="Profile"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
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
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
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
                  className="px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700 transition-all duration-200 flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                  Premium
                </motion.span>
              )}
              {verified && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-200 border border-gray-500 hover:bg-gray-600 transition-all duration-200 flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                  Verified
                </motion.span>
              )}
              {isBreached && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-gray-900 text-gray-400 border border-gray-700 hover:bg-gray-800 transition-all duration-200 flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                  Breached
                </motion.span>
              )}
            </div>
          </div>

          {/* Information Section */}
          <div className="lg:col-span-2 space-y-4">
            {/* Website */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 bg-gray-900/30 rounded-lg border border-gray-700">
              <span className="text-gray-300 text-sm font-semibold min-w-[100px]">Website:</span>
              {website && typeof website === 'string' ? (
                <a
                  href={`https://${website}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors font-medium underline decoration-gray-400/30 hover:decoration-white"
                >
                  {website.toUpperCase()}.com
                </a>
              ) : (
                <a
                  href={`https://${platformName}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors font-medium underline decoration-gray-400/30 hover:decoration-white"
                >
                  {platformName.toUpperCase()}.com
                </a>
              )}
            </div>

            {/* Dynamic Spec Format Data */}
            {spec_format?.map((item, index) =>
              Object.entries(item).map(
                ([key, value]) =>
                  key !== "platform_variables" && !key.includes("url") && (
                    <div
                      key={`${index}-${key}`}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 bg-gray-900/30 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-200"
                    >
                      <span className="text-gray-300 text-sm font-semibold min-w-[100px]">
                        {formatTitle(key)}:
                      </span>
                      <div className="flex items-center gap-3 flex-1 sm:justify-end">
                        {key === "id" ? (
                          <>
                            <span className="text-white font-mono text-sm bg-gray-800 border border-gray-600 px-3 py-1 rounded-lg break-all">
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
                              className={`rounded-lg transition-all duration-300 p-2 border border-gray-600 ${
                                copiedStates[`${index}-${key}-id`] 
                                  ? 'bg-gray-700 hover:bg-gray-600' 
                                  : 'hover:bg-gray-800'
                              }`}
                            >
                              {copiedStates[`${index}-${key}-id`] ? (
                                <Check size={14} className="text-gray-300" />
                              ) : (
                                <Copy size={14} className="text-gray-300" />
                              )}
                            </motion.button>
                          </>
                        ) : key === "last_seen" || key === "creation_date" ? (
                          <div className="flex items-center gap-3">
                            <span className="text-white font-medium bg-gray-800 border border-gray-600 px-3 py-1 rounded-lg">
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
                              className={`rounded-lg transition-all duration-300 p-2 border border-gray-600 ${
                                copiedStates[`${index}-${key}-date`] 
                                  ? 'bg-gray-700 hover:bg-gray-600' 
                                  : 'hover:bg-gray-800'
                              }`}
                            >
                              {copiedStates[`${index}-${key}-date`] ? (
                                <Check size={14} className="text-gray-300" />
                              ) : (
                                <Copy size={14} className="text-gray-300" />
                              )}
                            </motion.button>
                          </div>
                        ) : typeof (value as SpecFormatValue).value === "boolean" ? (
                          <span
                            className={`px-4 py-1 rounded-full text-xs font-medium border-2 ${
                              (value as SpecFormatValue).value
                                ? "bg-gray-700 text-gray-200 border-gray-500"
                                : "bg-gray-800 text-gray-400 border-gray-600"
                            }`}
                          >
                            {(value as SpecFormatValue).value ? "Yes" : "No"}
                          </span>
                        ) : (
                          <span className="text-white font-medium bg-gray-800 px-3 py-1 rounded-lg border border-gray-600 break-all">
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
      <div className="p-6 border-t border-gray-700 bg-gray-900/50 rounded-b-xl">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gray-800 cursor-pointer hover:bg-gray-700 border border-gray-600 text-white text-lg font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          onClick={() => setIsOpen(true)}
        >
          Expand
        </motion.button>
        <Expand
          isDetailsOpen={isOpen}
          setIsDetailsOpen={setIsOpen}
          selectedItem={userData}
        />
      </div>
    </Card>
  );
};

export default InfoCard;
