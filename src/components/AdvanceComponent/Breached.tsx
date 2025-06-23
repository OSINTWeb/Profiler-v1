import React, { useState } from "react";
import { Globe, X } from "lucide-react";
import { useImageLoader, getFallbackInitials } from "../Card/imageLoader";
import { cn } from "@/lib/utils";
import { Expand } from "@/components/ActivityComponent/expand";
import { motion, AnimatePresence } from "framer-motion";

interface SpecFormatValue {
  value: string | boolean | number;
}

interface SpecFormat {
  registered?: SpecFormatValue;
  breach?: SpecFormatValue;
  name?: SpecFormatValue;
  picture_url?: SpecFormatValue;
  website?: SpecFormatValue;
  creation_date?: SpecFormatValue;
  id?: SpecFormatValue;
  bio?: SpecFormatValue;
  last_seen?: SpecFormatValue;
  username?: SpecFormatValue;
  location?: SpecFormatValue;
  gender?: SpecFormatValue;
  language?: SpecFormatValue;
  age?: SpecFormatValue;
  phone_number?: SpecFormatValue;
  [key: string]: SpecFormatValue | undefined;
}

interface UserData {
  pretty_name: string;
  query: string;
  category: {
    name: string;
    description: string;
  };
  spec_format?: SpecFormat[];
  front_schemas?: Array<{ image: string }>;
  status?: string;
  module: string;
}

interface BreachedAccountProps {
  userData: UserData[];
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
  const fallbackInitials = getFallbackInitials(alt);

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
          {fallbackInitials}
        </div>
      )}
    </>
  );
};

const PlatformCard = ({ spec, module }: { spec: SpecFormat; module: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleClick = () => {
    setIsDetailsOpen(true);
  };

  // Type-safe value extraction
  const getPictureUrl = (spec: SpecFormat): string => {
    const value = spec.picture_url?.value;
    return typeof value === "string" ? value : "";
  };

  const getName = (spec: SpecFormat): string => {
    const value = spec.name?.value;
    return typeof value === "string" ? value : "Unknown";
  };

  // Convert SpecFormat to Expand component's expected format
  const convertSpecFormat = (
    spec: SpecFormat
  ): { [key: string]: { value: string | boolean | number } }[] => {
    const converted: { [key: string]: { value: string | boolean | number } } = {};
    Object.entries(spec).forEach(([key, value]) => {
      if (value && typeof value === "object" && "value" in value) {
        converted[key] = { value: value.value };
      }
    });
    return [converted];
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        className={cn(
          "relative overflow-hidden cursor-pointer ",
          "backdrop-blur-md backdrop-saturate-150",
          "bg-gradient-to-br from-[#0f0f12] to-[#131315] border border-white/20",
          "rounded-2xl transition-all duration-300"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {/* Glass reflection effect */}
        <div
          className="absolute -inset-[400px] bg-gradient-to-b from-blue-500/20 to-purple-500/20 opacity-[15%] transition-all duration-500"
          style={{
            transform: isHovered
              ? "translate(200px, 200px) rotate(45deg)"
              : "translate(500px, 500px) rotate(45deg)",
          }}
        />

        {/* Content */}
        <div className="relative p-6 flex flex-col items-center">
          <div className="w-20 h-20 overflow-hidden mb-4 ring-2 ring-white/20 ring-offset-2 ring-offset-black/50">
            <ImageWithFallback
              src={getPictureUrl(spec)}
              alt={getName(spec)}
              className="w-full h-full object-cover"
            />
          </div>

          <h3 className="text-base font-medium text-white mb-2">{getName(spec)}</h3>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-md border border-white/10">
            <Globe size={12} className="text-blue-400" />
            <span className="text-xs text-gray-300">{module}</span>
          </div>
        </div>
      </motion.div>

      {isDetailsOpen && (
        <Expand
          isDetailsOpen={isDetailsOpen}
          setIsDetailsOpen={setIsDetailsOpen}
          selectedItem={{
            module: module,
            schemaModule: module,
            status: "found",
            pretty_name: getName(spec),
            query: "",
            from: "breach_data",
            reliable_source: true,
            spec_format: convertSpecFormat(spec),
            category: { name: module, description: "" },
          }}
        />
      )}
    </>
  );
};

const ViewMoreModal = ({
  isOpen,
  onClose,
  items,
}: {
  isOpen: boolean;
  onClose: () => void;
  items: { spec: SpecFormat; module: string }[];
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0  backdrop-blur-xl z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-5xl max-h-[85vh] overflow-hidden rounded-3xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Glassmorphism background */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl backdrop-saturate-150 border border-white/20" />

          {/* Content */}
          <div className="relative">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="h-8 w-1 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full" />
                <h2 className="text-2xl font-medium text-white">All Breached Accounts</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6 text-white/70" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)]">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map((item, index) => (
                  <PlatformCard
                    key={`modal-platform-${index}`}
                    spec={item.spec}
                    module={item.module}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const BreachedAccount = ({ userData }: BreachedAccountProps) => {
  const [isViewMoreOpen, setIsViewMoreOpen] = useState(false);

  // Add validation for userData
  if (!userData || !Array.isArray(userData)) {
    return null;
  }

  // Create a flat array of all breached items from the SSE data
  const allBreachedItems = userData.flatMap((item) =>
    (item?.spec_format || [])
      .filter((spec) => {
        // Check if the account has breach data and picture_url
        const hasBreach = spec?.breach?.value === true;
        const hasPicture = spec?.picture_url?.value && typeof spec.picture_url.value === "string";
        return hasBreach && hasPicture;
      })
      .map((spec) => ({
        spec,
        module: item?.module || "Unknown",
      }))
  );

  // Get first 9 items for initial display
  const initialItems = allBreachedItems.slice(0, 9);
  const hasMoreItems = allBreachedItems.length > 9;

  // If no breached accounts, return null or show empty state
  if (allBreachedItems.length === 0) {
    return <div className="w-full h-full animate-scale-in p-4"></div>;
  }

  return (
    <div className="w-full h-full animate-scale-in p-4">
      <div className="relative rounded-2xl border border-white/50 overflow-hidden">
        {/* Glassmorphism background */}
        <div className="absolute inset-0 backdrop-blur-2xl backdrop-saturate-150 " />
       
        {/* Content */}
        <div className="relative p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="h-8 w-1 bg-gradient-to-b from-slate-400 to-slate-900 rounded-full" />
              <h2 className="text-2xl font-medium text-white">Breached Accounts</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <p className="text-sm font-medium text-white/90">
                  {allBreachedItems.length} found
                </p>
              </div>
            {hasMoreItems && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsViewMoreOpen(true)}
                className="px-6 py-2.5 rounded-xl text-white/90 text-sm font-medium
                          backdrop-blur-lg backdrop-saturate-150
                         border border-white/20  
                         transition-all duration-300 hover:bg-white/20 cursor-pointer"
              >
                View All
              </motion.button>
            )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {initialItems.map((item, index) => (
              <PlatformCard key={`platform-${index}`} spec={item.spec} module={item.module} />
            ))}
          </div>
        </div>
      </div>

      <ViewMoreModal
        isOpen={isViewMoreOpen}
        onClose={() => setIsViewMoreOpen(false)}
        items={allBreachedItems}
      />
    </div>
  );
};

export default BreachedAccount;
