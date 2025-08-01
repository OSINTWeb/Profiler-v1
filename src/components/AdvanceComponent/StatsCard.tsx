import { useState, useEffect } from "react";
import { Copy, X } from "lucide-react";
import CompanyLogo from "@/components/ActivityComponent/Logo";
import { motion, AnimatePresence } from "framer-motion";
import { Expand } from "@/components/ActivityComponent/expand";
import type { PlatformData } from "@/types/streaming";

interface InfoCardProps {
  icon: string;
  title: string;
  count: number;
  items: string[];
}

// Helper function to format dates
const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

const ViewMoreModal = ({
  isOpen,
  onClose,
  title,
  data,
  onItemClick,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: PlatformData[];
  onItemClick: (item: PlatformData) => void;
}) => {
  if (!isOpen) return null;

  // Get all items with their associated data for the specific field
  const getAllItemsWithData = () => {
    const allItemsData: Array<{ value: string; sourceData: PlatformData; spec: Record<string, unknown> }> = [];
    
    data.forEach((item) => {
      if (item.spec_format && Array.isArray(item.spec_format)) {
        item.spec_format.forEach((spec) => {
          const fieldKey = title.toLowerCase().replace(" ", "_");
          const field = spec[fieldKey];
          const value = field && typeof field === 'object' && 'value' in field ? field.value : undefined;
          
          if (value && typeof value === 'string') {
            allItemsData.push({
              value: title.includes("date") ? formatDate(value) : value,
              sourceData: item,
              spec
            });
          }
        });
      }
    });
    
    return allItemsData;
  };

  const allItemsData = title === "Sources Found" 
    ? data.filter(item => item.status === "found").map(item => ({ value: item.pretty_name || item.module, sourceData: item, spec: null }))
    : getAllItemsWithData();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 backdrop-blur-xl z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-6xl max-h-[85vh] overflow-hidden rounded-3xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Glassmorphism background */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl backdrop-saturate-150 border border-white/20" />

          {/* Content */}
          <div className="relative">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="h-8 w-1 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full" />
                <h2 className="text-2xl font-medium text-white">All {title}</h2>
                <span className="px-3 py-1 bg-gray-800/50 rounded-full text-sm text-gray-300 border border-gray-700">
                  {allItemsData.length} items
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6 text-white/70" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)]">
              {title === "Sources Found" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {allItemsData.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                      whileHover={{ scale: 1.05 }}
                      className="rounded-2xl p-4 flex flex-col items-center justify-center transition-all duration-300 border border-gray-700 overflow-hidden cursor-pointer hover:bg-gray-800/50 hover:border-gray-600 min-h-[120px] bg-gray-900/50 shadow-xl"
                      onClick={() => onItemClick(item.sourceData)}
                    >
                      <div className="w-16 h-16 mb-3 flex items-center justify-center bg-gray-800/50 rounded-xl border border-gray-700">
                        <CompanyLogo companyName={item.sourceData.module} />
                      </div>
                      <div className="text-sm text-white font-semibold text-center line-clamp-2 leading-tight">
                        {item.value}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allItemsData.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                      whileHover={{ scale: 1.01 }}
                      className="relative group flex flex-row w-full border border-gray-700 justify-between p-4 rounded-2xl hover:bg-gray-800/50 hover:border-gray-600 transition-all duration-300 gap-4 bg-gray-900/50 shadow-xl"
                    >
                      <div className="flex items-start gap-3 flex-1 cursor-pointer">
                        <div className="flex-1 min-w-0">
                          <span className="text-white text-base break-words block font-semibold">
                            {item.value}
                          </span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(item.value);
                          }}
                          className="p-2 text-gray-200 hover:text-white rounded-xl hover:bg-gray-800/50 transition-all duration-200 flex-shrink-0 bg-gray-800/50 border border-gray-700"
                          title="Copy to clipboard"
                        >
                          <Copy size={16} />
                        </motion.button>
                      </div>
                      <div className="flex items-center justify-center">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onItemClick(item.sourceData)}
                          className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:bg-gray-800/50 transition-colors duration-300 cursor-pointer bg-gray-800/50 border border-gray-700"
                        >
                          <CompanyLogo companyName={item.sourceData.module || ""} />
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const InfoCardsContainer = ({ 
  data: originalData 
}: { 
  data: PlatformData[] 
}): React.JSX.Element => {
  const [copied, setCopied] = useState<number | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [curritem, setcurritem] = useState<PlatformData | null>(null);
  const [activeTab, setActiveTab] = useState("sources_found");
  const [isViewMoreOpen, setIsViewMoreOpen] = useState(false);
  const [viewMoreData, setViewMoreData] = useState<{ title: string; items: string[]; data: PlatformData[] }>({ title: "", items: [], data: [] });
  
  // Add the filtering logic as requested
  const [nonHibpData, setNonHibpData] = useState<PlatformData[]>([]);
  const [hibpCount, setHibpCount] = useState(0);

  useEffect(() => {
    if (originalData.length > 0) {
      const hibpItems = originalData.filter((item) => item.module === "hibp");
      const nonHibpItems = originalData.filter((item) => item.module !== "hibp");
      setNonHibpData(nonHibpItems);
      if (hibpItems.length > 0) {
        // Count hibp items from spec_format
        setHibpCount(hibpItems[0].spec_format?.length || 0);
      }
    }
  }, [originalData]);

  // Use filtered data for processing
  const data = nonHibpData; // Use non-HIBP data for regular display

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleImageClick = (item: PlatformData) => {
    setcurritem(item);
    setIsDetailsOpen(true);
  };

  // Fixed function to accurately extract and count unique values
  const extractUniqueValues = (fieldName: string): string[] => {
    const allValues: string[] = [];
    
    data.forEach((item) => {
      if (item.spec_format && Array.isArray(item.spec_format)) {
        item.spec_format.forEach((spec) => {
          const field = spec[fieldName];
          if (field && typeof field === 'object' && 'value' in field) {
            const value = field.value;
            if (typeof value === 'string' && value.trim() !== '') {
              allValues.push(value.trim());
            }
          }
        });
      }
    });

    // Return unique values only
    return [...new Set(allValues)];
  };

  // Count sources that are actually found
  const getSourcesFoundCount = (): number => {
    const uniqueModules = new Set<string>();
    data.forEach((item) => {
      if (item.status === "found" && item.module) {
        uniqueModules.add(item.module);
      }
    });
    return uniqueModules.size;
  };

  const cardData: InfoCardProps[] = [
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/efa2c28f2a98b2f7926696227c835c5dfdaeb007e36131cb0e360c8b0d71b348?placeholderIfAbsent=true",
      title: "Sources Found",
      count: getSourcesFoundCount(),
      items: [],
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/efa2c28f2a98b2f7926696227c835c5dfdaeb007e36131cb0e360c8b0d71b348?placeholderIfAbsent=true",
      title: "Username",
      count: extractUniqueValues("username").length,
      items: extractUniqueValues("username"),
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/10ef79cabb712c00af4445df4fb142aed074c4d58d5a17d9033b3f06cf7f6cf9?placeholderIfAbsent=true",
      title: "name",
      count: extractUniqueValues("name").length,
      items: extractUniqueValues("name"),
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/0e2dc1ea6ea900ff1f3370e131b8ac57a062ed591d743e26aa1d90f0a6b0d844?placeholderIfAbsent=true",
      title: "Location",
      count: extractUniqueValues("location").length,
      items: extractUniqueValues("location"),
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/33925ced5863e73ab901ada4c80ca2bbd72ed9a1b6a75c7d5e85797ec15af165?placeholderIfAbsent=true",
      title: "creation_date",
      count: extractUniqueValues("creation_date").length,
      items: extractUniqueValues("creation_date"),
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/0165293a4391d2724084855a69a8936490d0ee34f096ac1e7fe6aa38f9bdace2?placeholderIfAbsent=true",
      title: "Last Seen",
      count: extractUniqueValues("last_seen").length,
      items: extractUniqueValues("last_seen"),
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/efa2c28f2a98b2f7926696227c835c5dfdaeb007e36131cb0e360c8b0d71b348?placeholderIfAbsent=true",
      title: "Gender",
      count: extractUniqueValues("gender").length,
      items: extractUniqueValues("gender"),
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/efa2c28f2a98b2f7926696227c835c5dfdaeb007e36131cb0e360c8b0d71b348?placeholderIfAbsent=true",
      title: "Language",
      count: extractUniqueValues("language").length,
      items: extractUniqueValues("language"),
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/efa2c28f2a98b2f7926696227c835c5dfdaeb007e36131cb0e360c8b0d71b348?placeholderIfAbsent=true",
      title: "Age",
      count: extractUniqueValues("age").length,
      items: extractUniqueValues("age"),
    },
  ];

  // Filter out cards that have no data
  const filteredCardData = cardData.filter((card) => {
    if (card.title === "Sources Found") return true;
    return card.count > 0;
  });

  const renderTabContent = (card: InfoCardProps) => {
    const uniqueFoundModules: Set<string> = new Set();

    switch (card.title) {
      case "Sources Found":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-y-auto max-h-[350px] sm:max-h-[400px] custom-scrollbar"
          >
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 px-3 sm:px-4 py-4 sm:py-6 ">
              {data
                ?.filter((item) => item.status === "found")
                .map((item, index) => {
                  if (item.module && !uniqueFoundModules.has(item.module)) {
                    uniqueFoundModules.add(item.module);
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        className="rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center transition-all duration-300 border border-gray-700 overflow-hidden cursor-pointer hover:bg-gray-800/50 hover:border-gray-600 min-h-[100px] sm:min-h-[120px] bg-gray-900/50 shadow-xl"
                        onClick={() => handleImageClick(item)}
                      >
                        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mb-2 sm:mb-3 flex items-center justify-center bg-gray-800/50 rounded-xl border border-gray-700">
                          <CompanyLogo companyName={item.module} />
                        </div>
                        <div className="text-xs sm:text-sm text-white font-semibold text-center line-clamp-2 leading-tight">
                          {item.pretty_name || item.module}
                        </div>
                      </motion.div>
                    );
                  }
                  return null;
                })}
            </div>
          </motion.div>
        );
      default:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-y-auto max-h-[350px] sm:max-h-[400px] custom-scrollbar p-3 sm:p-4"
          >
            <div className="grid grid-cols-1 gap-2 sm:gap-4 py-10">
              {data?.map((item, index) =>
                item.spec_format
                  ?.map((spec, specIndex) => {
                    const fieldKey = card.title.toLowerCase().replace(" ", "_");
                    const field = spec[fieldKey];
                    const value = field && typeof field === 'object' && 'value' in field ? field.value : undefined;
                    
                    if (!value || typeof value !== 'string') return null;
                    
                    return (
                      <motion.div
                        key={`${index}-${specIndex}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: specIndex * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                        className="relative group flex flex-row w-full border border-gray-700 justify-between p-4 rounded-2xl hover:bg-gray-800/50 hover:border-gray-600 transition-all duration-300 gap-3 sm:gap-4 bg-gray-900/50 shadow-xl"
                      >
                        <div className="flex items-start gap-3 flex-1 cursor-pointer">
                          <div className="flex-1 min-w-0">
                            <span className="text-white text-sm sm:text-base break-words block font-semibold">
                              {card.title.includes("date") ? formatDate(value) : value}
                            </span>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCopy(value, index)}
                            className="p-2 text-gray-200 hover:text-white rounded-xl hover:bg-gray-800/50 transition-all duration-200 flex-shrink-0 bg-gray-800/50 border border-gray-700"
                            title="Copy to clipboard"
                          >
                            {copied === index ? "✓" : <Copy size={16} />}
                          </motion.button>
                        </div>
                        <div className="flex items-center justify-center sm:justify-end">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleImageClick(item)}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center group-hover:bg-gray-800/50 transition-colors duration-300 cursor-pointer bg-gray-800/50 border border-gray-700"
                          >
                            <CompanyLogo companyName={item.module || ""} />
                          </motion.div>
                        </div>
                        {/* Tooltip - only show on larger screens */}
                        <div className="absolute -top-14 right-4 px-3 py-2 bg-black/95 border border-gray-600 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-2xl z-20 font-semibold hidden lg:block pointer-events-none">
                          {item.module || "Unknown Source"}
                          <div className="text-gray-200 text-xs mt-1 font-normal">
                            Click to view profile
                          </div>
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rotate-45 border-b border-r border-gray-600"></div>
                        </div>
                      </motion.div>
                    );
                  })
                  .filter(Boolean)
              )}
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="w-full px-2 sm:px-4 ">
      <div className="w-full">
        {/* Display HIBP Count if available */}
        {hibpCount > 0 && (
          <div className="mb-4 p-4 bg-gray-900 border border-gray-700 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center">
                <span className="text-red-400 font-bold text-sm">!</span>
              </div>
              <div>
                <h3 className="text-white font-semibold">Data Breach Alert</h3>
                <p className="text-gray-400 text-sm">
                  Found {hibpCount} breach{hibpCount !== 1 ? 'es' : ''} in HIBP database
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Custom Tabs Implementation */}
        <div className="flex justify-center w-full mb-4 sm:mb-6 ">
          <div className="bg-black border border-gray-700 px-2 py-2 overflow-x-scroll overflow-y-hidden custom-scrollbar h-18 w-full flex gap-2 sm:gap-3 rounded-2xl mx-auto shadow-2xl">
            {filteredCardData.map((card, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(card.title.toLowerCase().replace(" ", "_"))}
                className={`${
                  activeTab === card.title.toLowerCase().replace(" ", "_")
                    ? "bg-gray-800 text-white border-gray-600"
                    : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                } transition-all duration-300 whitespace-nowrap h-10 sm:h-12 flex-shrink-0 px-3 sm:px-5 rounded-xl border border-transparent hover:border-gray-600 focus-visible:ring-2 focus-visible:ring-gray-500 flex items-center min-w-fit font-medium cursor-pointer`}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-1.5 sm:gap-2"
                >
                  <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center flex-shrink-0">
                    <img
                      src={card.icon}
                      alt={`${card.title} icon`}
                      className="w-full h-full object-contain filter brightness-110"
                    />
                  </div>
                  <span className="font-medium text-xs sm:text-sm capitalize">
                    {card.title === "creation_date" ? "First Seen" : card.title}
                  </span>
                  {card.count > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-1 px-2 py-0.5 text-xs rounded-full bg-gray-700 border border-gray-600 text-gray-200 font-semibold flex-shrink-0"
                    >
                      {card.count}
                    </motion.span>
                  )}
                </motion.div>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-2 sm:mt-4">
          {filteredCardData.map((card, index) => (
            <div
              key={index}
              className={`${
                activeTab === card.title.toLowerCase().replace(" ", "_") ? "block" : "hidden"
              }`}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-black border border-gray-700 rounded-2xl p-4 sm:p-6 shadow-2xl max-h-[450px] sm:max-h-[500px] flex flex-col"
              >
                <div className="flex flex-row sm:items-center justify-between mb-4 gap-2 sm:gap-0 flex-shrink-0 border-b border-gray-700 pb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0 border border-gray-700"
                    >
                      <img
                        src={card.icon}
                        alt={`${card.title} icon`}
                        className="w-5 h-5 sm:w-6 sm:h-6 object-contain filter brightness-110"
                      />
                    </motion.div>
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                      {card.title === "creation_date" ? "First Seen" : card.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-xs sm:text-sm text-gray-300 flex-shrink-0 bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700 font-medium"
                    >
                      {card.count} {card.count === 1 ? "item" : "items"} found
                    </motion.div>
                    {card.count > 6 && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setViewMoreData({ title: card.title, items: card.items, data });
                          setIsViewMoreOpen(true);
                        }}
                        className="px-4 py-2 rounded-xl text-white/90 text-xs font-medium
                                  backdrop-blur-lg backdrop-saturate-150
                                 border border-white/20  
                                 transition-all duration-300 hover:bg-white/20 cursor-pointer"
                      >
                        View All
                      </motion.button>
                    )}
                  </div>
                </div>
                <div className="flex-1 overflow-hidden">{renderTabContent(card)}</div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
      <Expand
        isDetailsOpen={isDetailsOpen}
        setIsDetailsOpen={setIsDetailsOpen}
        selectedItem={curritem}
      />
      
      <ViewMoreModal
        isOpen={isViewMoreOpen}
        onClose={() => setIsViewMoreOpen(false)}
        title={viewMoreData.title}
        data={viewMoreData.data}
        onItemClick={handleImageClick}
      />
    </div>
  );
};

export default InfoCardsContainer;

export type { PlatformData } from "@/types/streaming";
