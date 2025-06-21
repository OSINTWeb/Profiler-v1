import React from "react";
import { motion } from "framer-motion";
import { Copy, Globe, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import CompanyLogo from "@/components/ActivityComponent/Logo";
import { useState } from "react";

import { Expand, PlatformData, SpecFormatValue } from "@/components/ActivityComponent/expand";
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
  const isBreached = spec_format?.[0]?.breach?.value || false;
  const verified = spec_format?.[0]?.verified?.value || false;
  const premium = spec_format?.[0]?.premium?.value || false;

  const platformName = module;
  const websiteValue = spec_format?.[0]?.website?.value;
  const website = typeof websiteValue === 'string' ? websiteValue : platformName;
  const profileURL = (spec_format?.[0]?.profile_url?.value as string) || "";
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
    <Card className="bg-gradient-to-br from-[#0f0f12] to-[#131315] border border-gray-700 flex flex-col w-full rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/40 hover:border-gray-600 h-[700px] relative">
      {/* Header Section */}
      <div className="flex items-center gap-4 p-6 border-b border-gray-800 bg-gradient-to-r from-gray-900/50 to-black/50 rounded-t-xl">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center border border-gray-700 shadow-lg">
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
                className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-xl border-2 border-gray-700 shadow-lg transition-all duration-300 group-hover:border-gray-600"
                src={
                  (spec_format?.[0]?.picture_url?.value as string) ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
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
                className="flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-gray-700 text-white px-4  rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl  "
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
                  className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30 transition-all duration-200 flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></div>
                  Premium
                </motion.span>
              )}
              {verified && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-all duration-200 flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                  Verified
                </motion.span>
              )}
              {isBreached && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all duration-200 flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></div>
                  Breached
                </motion.span>
              )}
            </div>
          </div>

          {/* Information Section */}
          <div className="lg:col-span-2 space-y-4">
            {/* Website */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 bg-gradient-to-r from-gray-900/30 to-black/30 rounded-lg border border-gray-800">
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
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 bg-gradient-to-r from-gray-900/30 to-black/30 rounded-lg border border-gray-800 hover:border-gray-700 transition-all duration-200"
                    >
                      <span className="text-gray-300 text-sm font-semibold min-w-[100px]">
                        {formatTitle(key)}:
                      </span>
                      <div className="flex items-center gap-3 flex-1 sm:justify-end">
                        {key === "id" ? (
                          <>
                            <span className="text-white font-mono text-sm bg-black border border-gray-700 px-3 py-1 rounded-lg break-all">
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
                              className={`rounded-lg transition-all duration-300 p-2 border border-gray-700 ${
                                copiedStates[`${index}-${key}-id`] 
                                  ? 'bg-green-800 hover:bg-green-700' 
                                  : 'hover:bg-gray-800'
                              }`}
                            >
                              {copiedStates[`${index}-${key}-id`] ? (
                                <Check size={14} className="text-green-300" />
                              ) : (
                                <Copy size={14} className="text-gray-300" />
                              )}
                            </motion.button>
                          </>
                        ) : key === "last_seen" || key === "creation_date" ? (
                          <div className="flex items-center gap-3">
                            <span className="text-white font-medium bg-gradient-to-r from-gray-600/20 to-gray-700/20 border border-gray-500/30 px-3 py-1 rounded-lg">
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
                              className={`rounded-lg transition-all duration-300 p-2 border border-gray-700 ${
                                copiedStates[`${index}-${key}-date`] 
                                  ? 'bg-green-800 hover:bg-green-700' 
                                  : 'hover:bg-gray-800'
                              }`}
                            >
                              {copiedStates[`${index}-${key}-date`] ? (
                                <Check size={14} className="text-green-300" />
                              ) : (
                                <Copy size={14} className="text-gray-300" />
                              )}
                            </motion.button>
                          </div>
                        ) : typeof (value as SpecFormatValue).value === "boolean" ? (
                          <span
                            className={`px-4  rounded-full text-xs font-medium border-2 ${
                              (value as SpecFormatValue).value
                                ? "bg-green-500/20 text-green-400 border-green-500/50"
                                : "bg-red-500/20 text-red-400 border-red-500/50"
                            }`}
                          >
                            {(value as SpecFormatValue).value ? "Yes" : "No"}
                          </span>
                        ) : (
                          <span className="text-white font-medium bg-gray-900/50 px-3 py-1 rounded-lg border border-gray-800 break-all">
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
      <div className="p-6 border-t border-gray-800 bg-gradient-to-r from-slate-900/50 to-black/50 rounded-b-xl">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-[#131315] cursor-pointer hover:from-gray-600 hover:to-gray-700 border border-gray-600 text-white text-lg font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
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
