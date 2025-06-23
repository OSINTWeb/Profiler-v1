import React, { useState } from "react";
// import { format } from "date-fns"; // Removed unused import
import { Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import JSONPretty from "react-json-pretty";
import CompanyLogo from "@/components/ActivityComponent/Logo";

import type { SpecFormatValue, SpecFormat, PlatformData } from "@/types/streaming";

export type { SpecFormatValue, SpecFormat, PlatformData };

export interface ExpandProps {
  isDetailsOpen: boolean;
  setIsDetailsOpen: (open: boolean) => void;
  selectedItem: PlatformData | null;
}

// Enhanced scrollbar styles for dark theme
const scrollbarStyles = `
  /* For Webkit browsers (Chrome, Safari) */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: #000000;
    border-radius: 6px;
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #374151, #6B7280);
    border-radius: 6px;
    border: 2px solid #000000;
    box-shadow: 0 0 10px rgba(55, 65, 81, 0.3);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #4B5563, #9CA3AF);
    box-shadow: 0 0 15px rgba(55, 65, 81, 0.5);
  }

  /* For Firefox */
  * {
    scrollbar-width: thin;
    scrollbar-color: #374151 #000000;
  }
`;

const CodeBlock = ({ data }: { data: unknown }) => {
  const [toggle, settoggle] = useState(true);
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    const jsonString = JSON.stringify(data, null, 2);
    navigator.clipboard
      .writeText(jsonString)
      .then(() => {
        setCopied(true);
      })
      .catch((err) => {
        console.error("Failed to copy JSON: ", err);
      });
  };

  return toggle === true ? (
    <>
      <button
        onClick={() => settoggle(!toggle)}
        className="rounded-xl w-full my-4 border border-gray-700 bg-gradient-to-br from-[#0f0f12] to-[#131315] hover:from-[#0d0d11] hover:to-[#131315] font-semibold text-white text-sm md:text-base py-3 transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/20 cursor-pointer"
      >
        Show JSON Data
      </button>
    </>
  ) : (
    <div className="relative p-6 bg-gradient-to-br from-black to-gray-900 text-white rounded-xl overflow-hidden border border-gray-700 my-4">
      <style>{scrollbarStyles}</style>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <button
          onClick={() => settoggle(!toggle)}
          className="rounded-xl border border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 font-semibold text-white text-sm md:text-base px-6 py-2 transition-all duration-300 cursor-pointer"
        >
          Hide JSON
        </button>
        <motion.button
          onClick={handleCopy}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`rounded-xl border px-6 py-2 flex items-center justify-center gap-2 text-sm md:text-base font-semibold transition-all duration-300 cursor-pointer min-w-[140px] ${
            copied 
              ? "bg-gradient-to-r from-green-500 to-emerald-600 border-green-400 text-white shadow-lg shadow-green-500/25" 
              : "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 border-gray-700 text-white hover:shadow-lg hover:shadow-gray-500/30"
          }`}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="copied"
                className="flex items-center gap-2"
              >
                <Check size={16} className="text-white" />
                <span>Copied!</span>
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                className="flex items-center gap-2"
              >
                <Copy size={16} />
                <span>Copy JSON</span>  
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
      <div className="overflow-x-auto custom-scrollbar bg-black rounded-lg p-4 border border-gray-800">
        <JSONPretty id="json-pretty" data={data}></JSONPretty>
      </div>
    </div>
  );
};

const isStringValue = (value: SpecFormatValue): value is { value: string } => {
  return typeof value.value === "string";
};

const isBooleanValue = (value: SpecFormatValue): value is { value: boolean } => {
  return typeof value.value === "boolean";
};

const isNumberValue = (value: SpecFormatValue): value is { value: number } => {
  return typeof value.value === "number";
};

const isPictureUrl = (value: SpecFormatValue | undefined): value is { value: string } => {
  return value !== undefined && typeof value.value === "string" && value.value.startsWith("http");
};

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

// Enhanced Copy Button Component
const CopyButton = ({ 
  onClick, 
  isCopied, 
  size = 16 
}: { 
  onClick: () => void; 
  isCopied: boolean; 
  size?: number;
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`rounded-lg transition-all duration-300 p-2 border cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center ${
      isCopied 
        ? "bg-gradient-to-r from-green-500 to-emerald-600 border-green-400 shadow-lg shadow-green-500/25" 
        : "hover:bg-gray-800 border-gray-700 hover:shadow-md"
    }`}
  >
    <AnimatePresence mode="wait">
      {isCopied ? (
        <motion.div
          key="check"
          initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.5, rotate: 180 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
        >
          <Check size={size} className="text-white" />
        </motion.div>
      ) : (
        <motion.div
          key="copy"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.2 }}
        >
          <Copy size={size} className="text-gray-300" />
        </motion.div>
      )}
    </AnimatePresence>
  </motion.button>
);

const renderItemDetails = (
  item: PlatformData, 
  copiedField: string | null, 
  handleCopyField: (text: string, fieldName: string) => void
) => {
  if (!item) return null;

  const spec = item.spec_format?.[0];
  const website = item.module;
  const platformName = item.pretty_name;
  // const gender = spec?.gender?.value as string | undefined;
  // const language = spec?.language?.value as string | undefined;
  const location = spec?.location?.value as string | undefined;
  // const isBreached = spec?.breach?.value as boolean | undefined;
  const query = item.query;
  const id = spec?.id?.value as string | undefined;
  const last_seen = spec?.last_seen?.value as string | undefined;
  const username = spec?.username?.value as string | undefined;
  const phone_number = spec?.phone_number?.value as string | undefined;

  // Type guard to check if value is SpecFormatValue
  const isSpecFormatValue = (value: unknown): value is SpecFormatValue => {
    return value !== null && typeof value === 'object' && 'value' in (value as object);
  };

  return (
    <div className="w-full h-[calc(100vh-200px)] overflow-x-hidden md:h-[70vh] p-6 text-base md:text-lg overflow-y-auto custom-scrollbar border border-white/20 rounded-2xl">
      <style>{scrollbarStyles}</style>
      <div className=" ">
        <div className="flex flex-col space-y-6 w-full text-white">
          {/* Dynamic Fields from spec_format */}
          {spec &&
            Object.entries(spec).map(
              ([key, value]) =>
                key !== "platform_variables" && isSpecFormatValue(value) && (
                  <div
                    key={key}
                    className="flex flex-row items-center  justify-between gap-4 sm:gap-6 border-b border-gray-800 pb-4 bg-gradient-to-br from-[#0f0f12] to-[#131315] rounded-lg p-4"
                  >
                    <div className="text-sm sm:text-base  text-gray-300 font-semibold min-w-[120px] ">
                      {formatTitle(key)}:
                    </div>
                    <div className="flex items-center w-full gap-3 justify-start ">
                      {key === "id" && isStringValue(value) ? (
                        <>
                          <span className="text-white font-mono text-sm sm:text-base break-all bg-black border border-gray-700 px-4 py-2 rounded-lg flex-1 max-w-xs">
                            {value.value}
                          </span>
                          <CopyButton
                            onClick={() => navigator.clipboard.writeText(value.value)}
                            isCopied={false}
                          />
                        </>
                      ) : key.includes("url") && isStringValue(value) ? (
                        <div className="flex items-center gap-3 flex-1">
                          <span className="font-mono text-sm sm:text-base break-all bg-black border border-gray-700 px-4 py-2 rounded-lg flex-1">
                            {" "}
                            <a
                              href={value.value}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-300 hover:text-white transition-colors break-all text-sm sm:text-base font-medium underline decoration-gray-400/30 hover:decoration-white cursor-pointer"
                            >
                              {value.value}
                            </a>
                          </span>
                          <CopyButton
                            onClick={() => navigator.clipboard.writeText(value.value)}
                            isCopied={false}
                          />
                        </div>
                      ) : (key === "last_seen" || key === "creation_date") &&
                        isStringValue(value) ? (
                        <div className="flex items-center gap-3">
                          <span className="text-white font-medium bg-gradient-to-r from-gray-600/20 to-gray-700/20 border border-gray-500/30 px-4 py-2 rounded-lg">
                            {formatDate(value.value)}
                          </span>
                          <CopyButton
                            onClick={() => navigator.clipboard.writeText(value.value)}
                            isCopied={false}
                          />
                        </div>
                      ) : isBooleanValue(value) ? (
                        <span
                          className={`px-6 py-2 rounded-full text-sm font-semibold border-2 ${
                            value.value
                              ? "bg-green-500/20 text-green-400 border-green-500/50"
                              : "bg-red-500/20 text-red-400 border-red-500/50"
                          }`}
                        >
                          {value.value ? "Yes" : "No"}
                        </span>
                      ) : isStringValue(value) ? (
                        <span className="text-white text-sm sm:text-base font-medium bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-800">
                          {value.value}
                        </span>
                      ) : isNumberValue(value) ? (
                        <span className="text-white text-sm sm:text-base font-medium bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-800">
                          {value.value.toString()}
                        </span>
                      ) : null}
                    </div>
                  </div>
                )
            )}

          {/* Platform Information */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-4 border-b border-gray-800 pb-4 bg-gradient-to-br from-[#0f0f12] to-[#131315] rounded-lg p-4">
            <span className="text-gray-300 text-sm sm:text-base font-semibold min-w-[120px]">
              Platform:
            </span>
            <span className="text-white text-sm sm:text-base font-medium bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-800">
              {website }
            </span>
          </div>

          {/* Website */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-4 border-b border-gray-800 pb-4 bg-gradient-to-br from-[#0f0f12] to-[#131315] rounded-lg p-4">
            <span className="text-gray-300 text-sm sm:text-base font-semibold min-w-[120px]">
              Website:
            </span>
            <a
              href={`https://${website || platformName}.com`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base font-medium underline decoration-gray-400/30 hover:decoration-white cursor-pointer"
            >
              {(website || platformName).toUpperCase()}.com
            </a>
          </div>

          {/* Query */}
          {query && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-4 border-b border-gray-800 pb-4 bg-gradient-to-br from-[#0f0f12] to-[#131315] rounded-lg p-4">
              <span className="text-gray-300 text-sm sm:text-base font-semibold min-w-[120px]">
                Query Searched:
              </span>
              <div className="flex items-center gap-3 flex-1">
                <span className="font-mono text-sm sm:text-base break-all bg-black border border-gray-700 px-4 py-2 rounded-lg flex-1">
                  {query}
                </span>
                <CopyButton
                  onClick={() => handleCopyField(query, "query")}
                  isCopied={copiedField === "query"}
                />
              </div>
            </div>
          )}

          {/* ID */}
          {id && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-4 border-b border-gray-800 pb-4 bg-gradient-to-br from-[#0f0f12] to-[#131315] rounded-lg p-4">
              <span className="text-gray-300 text-sm sm:text-base font-semibold min-w-[120px]">
                ID:
              </span>
              <div className="flex items-center gap-3 flex-1">
                <span className="font-mono text-sm sm:text-base break-all bg-black border border-gray-700 px-4 py-2 rounded-lg flex-1">
                  {id}
                </span>
                <CopyButton
                  onClick={() => handleCopyField(id, "id")}
                  isCopied={copiedField === "id"}
                />
              </div>
            </div>
          )}

          {/* Last Seen */}
          {last_seen && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-4 border-b border-gray-800 pb-4 bg-gradient-to-br from-[#0f0f12] to-[#131315] rounded-lg p-4">
              <span className="text-gray-300 text-sm sm:text-base font-semibold min-w-[120px]">
                Last Seen:
              </span>
              <div className="flex items-center gap-3">
                <span className="text-white font-medium bg-gradient-to-r from-gray-600/20 to-gray-700/20 border border-gray-500/30 px-4 py-2 rounded-lg">
                  {formatDate(last_seen)}
                </span>
                <CopyButton
                  onClick={() => navigator.clipboard.writeText(last_seen)}
                  isCopied={false}
                />
              </div>
            </div>
          )}

          {/* Username */}
          {username && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-4 border-b border-gray-800 pb-4 bg-gradient-to-br from-[#0f0f12] to-[#131315] rounded-lg p-4">
              <span className="text-gray-300 text-sm sm:text-base font-semibold min-w-[120px]">
                Username:
              </span>
              <div className="flex items-center gap-3 flex-1">
                <span className="text-white text-sm sm:text-base font-medium bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-800 flex-1">
                  {username}
                </span>
                <CopyButton
                  onClick={() => handleCopyField(username, "username")}
                  isCopied={copiedField === "username"}
                />
              </div>
            </div>
          )}

          {/* Location */}
          {location && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-4 border-b border-gray-800 pb-4 bg-gradient-to-br from-[#0f0f12] to-[#131315] rounded-lg p-4">
              <span className="text-gray-300 text-sm sm:text-base font-semibold min-w-[120px]">
                Location:
              </span>
              <div className="flex items-center gap-3 flex-1">
                <span className="text-white text-sm sm:text-base font-medium bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-800 flex-1">
                  {location}
                </span>
                <CopyButton
                  onClick={() => handleCopyField(location, "location")}
                  isCopied={copiedField === "location"}
                />
              </div>
            </div>
          )}

          {/* Phone Number */}
          {phone_number && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-4 border-b border-gray-800 pb-4 bg-gradient-to-br from-[#0f0f12] to-[#131315] rounded-lg p-4">
              <span className="text-gray-300 text-sm sm:text-base font-semibold min-w-[120px]">
                Phone Number:
              </span>
              <div className="flex items-center gap-3 flex-1">
                <span className="text-white text-sm sm:text-base font-medium bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-800 flex-1">
                  {phone_number}
                </span>
                <CopyButton
                  onClick={() => handleCopyField(phone_number, "phone_number")}
                  isCopied={copiedField === "phone_number"}
                />
              </div>
            </div>
          )}
        </div>
        <CodeBlock data={item} />
      </div>
    </div>
  );
};

export const Expand: React.FC<ExpandProps> = ({
  isDetailsOpen,
  setIsDetailsOpen,
  selectedItem,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopyField = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 500);
    });
  };
  return (
    <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
      <DialogContent className="max-w-[95vw] md:max-w-5xl bg-gradient-to-br from-black to-slate-900 rounded-2xl shadow-2xl h-[90vh] md:h-[85vh] overflow-y-auto border-2 border-white/20 custom-scrollbar flex flex-col">
        <style>{scrollbarStyles}</style>
        <DialogHeader className="border border-white/20 p-6 bg-gradient-to-r from-gray-900/80 to-black/80 rounded-2xl">
          <DialogTitle className="text-white text-xl font-bold">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-base md:text-lg font-medium text-center">
              {selectedItem?.spec_format?.[0]?.picture_url &&
              isPictureUrl(selectedItem.spec_format[0].picture_url) ? (
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-gray-800 to-black p-3 flex items-center justify-center border border-gray-700 shadow-lg cursor-pointer">
                  <img
                    src={selectedItem.spec_format[0].picture_url.value}
                    alt="Platform Logo"
                    className="w-full h-full rounded-xl object-contain"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center border border-gray-700 shadow-lg">
                  <CompanyLogo companyName={selectedItem?.module} />
                </div>
              )}
              <div className="flex-1">
                <div className="text-2xl md:text-3xl text-white font-bold capitalize mb-2">
                  {selectedItem?.pretty_name || selectedItem?.module}
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm md:text-base font-medium">
                  {selectedItem?.spec_format?.[0]?.gender?.value && (
                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 px-4 py-2 rounded-full text-white capitalize shadow-md">
                      {selectedItem.spec_format[0].gender.value}
                    </div>
                  )}
                  {selectedItem?.spec_format?.[0]?.language?.value && (
                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 px-4 py-2 rounded-full text-white capitalize shadow-md">
                      {selectedItem.spec_format[0].language.value}
                    </div>
                  )}
                  <div
                    className={`border-2 px-4 py-2 rounded-full font-semibold shadow-md ${
                      selectedItem?.spec_format?.[0]?.breach?.value
                        ? "bg-gradient-to-r from-red-600 to-red-700 border-red-500 text-white"
                        : "bg-gradient-to-r from-green-600 to-green-700 border-green-500 text-white"
                    }`}
                  >
                    {selectedItem?.spec_format?.[0]?.breach?.value ? "Breached" : "Not Breached"}
                  </div>
                  {selectedItem?.spec_format?.[0]?.location?.value && (
                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 px-4 py-2 rounded-full text-white capitalize shadow-md">
                      {selectedItem.spec_format[0].location.value}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        {selectedItem && renderItemDetails(selectedItem, copiedField, handleCopyField)}
      </DialogContent>
    </Dialog>
  );
};
