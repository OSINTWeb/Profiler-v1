import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { ChevronDown, ZoomIn, ZoomOut, Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Expand, type SpecFormat as ExpandSpecFormat } from "@/components/ActivityComponent/expand";

// Constants
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2;
const ZOOM_STEP = 0.2;
const MIN_YEAR_WIDTH = 400;
const ITEM_WIDTH = 180;
const TIMELINE_HEIGHT = 500;
const NODE_SIZE = 120;

// Types
interface PlatformItem {
  spec_format?: ExpandSpecFormat[];
  module?: string;
  query?: string;
  pretty_name?: string;
  category?: {
    name: string;
    description: string;
  };
  status?: string;
  front_schemas?: Record<string, unknown>[];
}

interface ProcessedItem extends PlatformItem {
  creation_date: Date;
  last_seen: Date | null;
}

interface YearGroup {
  year: number;
  items: ProcessedItem[];
  width: number;
}

interface TimelineData {
  years: number[];
  yearGroups: YearGroup[];
  totalWidth: number;
}

interface NewTimelineProps {
  data: PlatformItem[];
  isStreaming?: boolean;
  currentIndex?: number;
  totalModules?: number;
  connectionStatus?: string;
}

// Utility functions
const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const calculateYearWidth = (itemCount: number): number => {
  return Math.max(MIN_YEAR_WIDTH, itemCount * ITEM_WIDTH);
};

// Type guard functions
const getStringValue = (value: string | number | boolean | undefined): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number") return value.toString();
  if (typeof value === "boolean") return value.toString();
  return "";
};

const isStringType = (value: string | number | boolean | undefined): value is string => {
  return typeof value === "string";
};

export const NewTimeline: React.FC<NewTimelineProps> = ({
  data,
  connectionStatus = "Completed",
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<PlatformItem | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);

  // Process and organize the data by year
  const timelineData = useMemo<TimelineData>(() => {
    const itemsByYear: { [key: number]: ProcessedItem[] } = {};

    // Filter and process valid items
    data.forEach((item) => {
      // Skip items without required data
      if (!item.module && !item.pretty_name) {
        return;
      }

      const creationDateValue = item.spec_format?.[0]?.creation_date?.value;
      const creationDateString = getStringValue(creationDateValue);

      if (!creationDateString || !isValidDate(creationDateString)) {
        return;
      }

      const creationDate = new Date(creationDateString);
      const year = creationDate.getFullYear();

      if (!itemsByYear[year]) {
        itemsByYear[year] = [];
      }

      const lastSeenValue = item.spec_format?.[0]?.last_seen?.value;
      const lastSeenString = getStringValue(lastSeenValue);
      const lastSeen =
        lastSeenString && isValidDate(lastSeenString) ? new Date(lastSeenString) : null;

      itemsByYear[year].push({
        ...item,
        creation_date: creationDate,
        last_seen: lastSeen,
      });
    });

    // Sort items within each year chronologically
    Object.values(itemsByYear).forEach((yearItems) => {
      yearItems.sort((a, b) => a.creation_date.getTime() - b.creation_date.getTime());
    });

    // Create sorted years and calculate widths
    const years = Object.keys(itemsByYear)
      .map(Number)
      .sort((a, b) => b - a); // Most recent first

    const yearGroups: YearGroup[] = years.map((year) => ({
      year,
      items: itemsByYear[year],
      width: calculateYearWidth(itemsByYear[year].length),
    }));

    const totalWidth = yearGroups.reduce((sum, group) => sum + group.width, 0);

    return { years, yearGroups, totalWidth };
  }, [data]);

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + ZOOM_STEP, ZOOM_MAX));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - ZOOM_STEP, ZOOM_MIN));
  }, []);

  // Item selection handler
  const handleItemClick = useCallback((item: PlatformItem) => {
    setSelectedItem(item);
    setIsDetailsOpen(true);
  }, []);

  // Collapse toggle handler
  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  useEffect(() => {
    const container = timelineContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Prevent the default page scroll
      e.preventDefault();

      // Simple and direct: convert any wheel movement to horizontal scroll
      // Use deltaY (vertical wheel) or deltaX (horizontal trackpad)
      const scrollDelta = e.deltaY || e.deltaX;

      if (scrollDelta !== 0) {
        // Direct horizontal scroll with good sensitivity
        container.scrollLeft += scrollDelta * 2;
      }
    };

    // Simple event listener - no complexity
    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // Style constants
  const timelineStyles = {
    transform: `scale(${zoom})`,
    transformOrigin: "top left",
  };

  if (timelineData.years.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card border border-border rounded-xl w-full shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border bg-background/80 backdrop-blur-sm">
        <button
          className="flex items-center gap-3 cursor-pointer hover:text-foreground transition-colors group"
          onClick={toggleCollapse}
          aria-expanded={!isCollapsed}
          aria-label={isCollapsed ? "Expand timeline" : "Collapse timeline"}
        >
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground group-hover:text-muted-foreground transition-colors">
              Activity Map{" "}
            </h2>
          </div>
          <motion.div animate={{ rotate: isCollapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </motion.div>
        </button>

        <div className="flex gap-2 items-center">
          {/* SSE Connection Status */}
          <div className="flex items-center gap-2 mr-4">
            <div
              className={`w-2 h-2 rounded-full ${
                connectionStatus === "connected"
                  ? "bg-green-400 animate-pulse"
                  : connectionStatus === "connecting"
                  ? "bg-yellow-400 animate-pulse"
                  : connectionStatus === "error"
                  ? "bg-red-400"
                  : "bg-muted-foreground"
              }`}
            />
            <span className="text-xs text-muted-foreground capitalize">{connectionStatus}</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoom <= ZOOM_MIN}
            className="text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-50 transition-all duration-200 rounded-lg"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoom >= ZOOM_MAX}
            className="text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-50 transition-all duration-200 rounded-lg"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden bg-background"
          >
            <div ref={timelineContainerRef} className="timeline-container">
              <div className="absolute left-0 right-0 bottom-0 top-0 p-8" style={timelineStyles}>
                <div
                  className="relative"
                  style={{ minWidth: `${timelineData.totalWidth + 200}px` }}
                >
                  {/* Years Header - Card Style */}
                  <div className="flex mb-16 gap-16 relative">
                    {timelineData.yearGroups.map((group, index) => (
                      <motion.div
                        key={group.year}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex-none px-8"
                        style={{ width: `${group.width}px` }}
                      >
                        <div className="bg-card rounded-xl shadow-2xl border border-border p-4 text-center backdrop-blur-sm hover:shadow-blue-500/20 hover:border-border transition-all duration-300">
                          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            {group.year}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {group.items.length} {group.items.length === 1 ? "account" : "accounts"}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Map Content */}
                  <div className="relative px-2">
                    {/* Main Connection Flow */}
                    <svg
                      className="absolute top-0 left-0 w-full h-full pointer-events-none"
                      style={{
                        width: "100%",
                        height: "100%",
                        zIndex: 1,
                      }}
                    >
                      {/* Draw connections between nodes */}
                      {timelineData.yearGroups.map((group, yearIndex) => (
                        <g key={group.year}>
                          {group.items.map((item, itemIndex) => {
                            // Calculate current node position
                            const currentX =
                              yearIndex * (group.width + 64) +
                              (itemIndex + 1) * (group.width / (group.items.length + 1));
                            const currentY = 150;

                            // Calculate next node position if it exists
                            let nextX, nextY;
                            if (itemIndex < group.items.length - 1) {
                              // Next item in same year
                              nextX =
                                yearIndex * (group.width + 64) +
                                (itemIndex + 2) * (group.width / (group.items.length + 1));
                              nextY = 150;
                            } else if (yearIndex < timelineData.yearGroups.length - 1) {
                              // First item in next year
                              const nextGroup = timelineData.yearGroups[yearIndex + 1];
                              nextX =
                                (yearIndex + 1) * (nextGroup.width + 64) +
                                nextGroup.width / (nextGroup.items.length + 1);
                              nextY = 150;
                            }

                            if (nextX && nextY) {
                              const controlX1 = currentX + (nextX - currentX) * 0.5;
                              const controlY1 = currentY - 30;
                              const controlX2 = currentX + (nextX - currentX) * 0.5;
                              const controlY2 = nextY - 30;

                              return (
                                <path
                                  key={`connection-${yearIndex}-${itemIndex}`}
                                  d={`M ${currentX} ${currentY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${nextX} ${nextY}`}
                                  stroke="url(#mapGradient)"
                                  strokeWidth={3}
                                  fill="none"
                                  filter="url(#glow)"
                                  className="drop-shadow-lg"
                                />
                              );
                            }
                            return null;
                          })}
                        </g>
                      ))}
                    </svg>

                    {/* Node Items */}
                    <div className="relative flex gap-16" style={{ zIndex: 10 }}>
                      {timelineData.yearGroups.map((group, yearIndex) => (
                        <div
                          key={group.year}
                          className="flex-none px-8"
                          style={{ width: `${group.width}px` }}
                        >
                          <div className="flex items-center justify-center gap-12 relative">
                            {group.items.map((item, itemIndex) => {
                              const nameValue = getStringValue(item.spec_format?.[0]?.name?.value);
                              const pictureValue = getStringValue(
                                item.spec_format?.[0]?.picture_url?.value
                              );
                              const itemId = `${group.year}-${itemIndex}`;
                              const isHovered = hoveredItem === itemId;
                              const displayName =
                                nameValue || item.pretty_name || item.module || "Unknown";
                              const moduleName = item.module || "Unknown";

                              return (
                                <div key={itemId} className="relative">
                                  <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{
                                      delay: yearIndex * 0.2 + itemIndex * 0.15,
                                      type: "spring",
                                      stiffness: 200,
                                    }}
                                    className="relative z-25"
                                  >
                                    {/* Node Card */}
                                    <motion.div
                                      className={`bg-card rounded-2xl shadow-2xl border-2 p-6 cursor-pointer transition-all duration-300 ${
                                        isHovered
                                          ? "border-blue-400 shadow-2xl shadow-blue-500/30 scale-105"
                                          : "border-border hover:border-border hover:shadow-xl hover:shadow-purple-500/10"
                                      }`}
                                      style={{ width: NODE_SIZE, height: NODE_SIZE }}
                                      onClick={() => handleItemClick(item)}
                                      onMouseEnter={() => setHoveredItem(itemId)}
                                      onMouseLeave={() => setHoveredItem(null)}
                                      whileHover={{ y: -4 }}
                                      aria-label={`View details for ${displayName}`}
                                    >
                                      {/* Profile Image */}
                                      <div className="flex flex-col items-center gap-2">
                                        <div
                                          className={`w-12 h-12 rounded-xl overflow-hidden transition-all duration-300 ${
                                            isHovered
                                              ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-background"
                                              : ""
                                          }`}
                                        >
                                          {pictureValue &&
                                          isStringType(
                                            item.spec_format?.[0]?.picture_url?.value
                                          ) ? (
                                            <img
                                              src={pictureValue}
                                              alt={displayName}
                                              className="w-full h-full object-cover"
                                              loading="lazy"
                                            />
                                          ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                              {displayName.charAt(0).toUpperCase()}
                                            </div>
                                          )}
                                        </div>

                                        {/* Node Info */}
                                        <div className="text-center">
                                          <h3
                                            className="text-xs font-semibold text-foreground truncate max-w-[80px]"
                                            title={displayName}
                                          >
                                            {displayName.length > 8
                                              ? `${displayName.substring(0, 8)}...`
                                              : displayName}
                                          </h3>
                                          <p
                                            className="text-xs text-muted-foreground truncate max-w-[80px]"
                                            title={moduleName}
                                          >
                                            {moduleName.length > 8
                                              ? `${moduleName.substring(0, 8)}...`
                                              : moduleName}
                                          </p>
                                        </div>
                                      </div>
                                    </motion.div>

                                    {/* Floating Info Cards */}
                                    <AnimatePresence>
                                      {isHovered && (
                                        <motion.div
                                          initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                          animate={{ opacity: 1, y: 0, scale: 1 }}
                                          exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                          transition={{ duration: 0.2 }}
                                          className="absolute -top-20 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none"
                                        >
                                          {/* Creation Date */}
                                          <div className="bg-card rounded-lg shadow-2xl border border-border px-3 py-2 mb-2 backdrop-blur-sm">
                                            <div className="flex items-center gap-2 text-xs">
                                              <Calendar className="h-3 w-3 text-green-400" />
                                              <span className="text-muted-foreground">Created</span>
                                              <span className="font-medium text-foreground">
                                                {formatDate(item.creation_date)}
                                              </span>
                                            </div>
                                          </div>

                                          {/* Last Seen */}
                                          {item.last_seen && (
                                            <div className="bg-card rounded-lg shadow-2xl border border-border px-3 py-2 backdrop-blur-sm">
                                              <div className="flex items-center gap-2 text-xs">
                                                <Clock className="h-3 w-3 text-blue-400" />
                                                <span className="text-muted-foreground">
                                                  Last seen
                                                </span>
                                                <span className="font-medium text-foreground">
                                                  {formatDate(item.last_seen)}
                                                </span>
                                              </div>
                                            </div>
                                          )}
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </motion.div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Details Modal */}
      {selectedItem && (
        <Expand
          isDetailsOpen={isDetailsOpen}
          setIsDetailsOpen={setIsDetailsOpen}
          selectedItem={{
            module: selectedItem.module || "",
            pretty_name:
              getStringValue(selectedItem.spec_format?.[0]?.name?.value) ||
              selectedItem.module ||
              "",
            query: selectedItem.query || "",
            spec_format: selectedItem.spec_format || [],
            category: { name: selectedItem.module || "", description: "" },
            schemaModule: "",
            status: "",
            from: "",
            reliable_source: false,
          }}
        />
      )}

      <style>{`
        .timeline-container {
          position: relative;
          width: 100%;
          height: ${TIMELINE_HEIGHT}px;
          overflow-x: auto !important;
          overflow-y: hidden !important;
          background: hsl(var(--background));
          /* Ensure direct, immediate scrolling */
          scroll-behavior: auto !important;
          -webkit-overflow-scrolling: touch;
          /* Ensure content doesn't interfere with scrolling */
          touch-action: pan-x;
        }

        .timeline-container::-webkit-scrollbar {
          height: 8px;
          background: hsl(var(--background));
          border-radius: 4px;
        }

        .timeline-container::-webkit-scrollbar-thumb {
          background: linear-gradient(to right, #4F46E5, #7C3AED, #4F46E5);
          border-radius: 4px;
          border: 2px solid hsl(var(--background));
          box-shadow: 0 0 10px rgba(79, 70, 229, 0.3);
        }

        .timeline-container::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to right, #6366F1, #8B5CF6, #6366F1);
          box-shadow: 0 0 15px rgba(79, 70, 229, 0.5);
        }

        .timeline-container::-webkit-scrollbar-track {
          border-radius: 4px;
          background: hsl(var(--muted));
        }
      `}</style>
    </motion.div>
  );
};

export default NewTimeline;
