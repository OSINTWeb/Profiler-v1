import React, { useState, useEffect } from "react";
import CategoryCard from "./categoryCard";
import GridView from "./GridView";
import ListView from "./ListView";
import GraphView from "./GraphView";
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
import { BarChart, Grid, List, XCircle, FileDown, Ban, Check, X, CheckCircle2 } from "lucide-react";
import { ActionBar } from "../Card/ActionBar";

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

export interface PlatformData {
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



interface PlatformData {
  module: string;
  pretty_name?: string;
  pretty_data?: Record<string, unknown>;
  query: string;
  status: string;
  from: string;
  reliable_source: boolean;
  data?: {
    phone_number?: string;
    qq_id?: string;
    email?: string;
    region?: string;
    league_of_legends_id?: string;
    weibo_link?: string;
    weibo_id?: string;
    profile_pic?: string;
    first_name?: string;
    last_name?: string;
    user?: string;
    avatar?: string;
    active?: boolean;
    private?: boolean;
    objectID?: string;
    friends_with?: unknown[];
    [key: string]: unknown;
  };
  category: {
    name: string;
    description: string;
  };
  spec_format: {
    registered?: { value: boolean };
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
    platform_variables?: Array<{
      key: string;
      proper_key?: string;
      value: string;
      type?: string;
    }>;
  }[];
  front_schemas?: {
    module?: string;
    image?: string;
    body?: Record<string, unknown>;
    tags?: Array<{
      tag: string;
      url?: string;
    }>;
  }[];
}

interface SelectInfoProps {
  data?: PlatformData[];
  selectedData?: PlatformData[];
  hidebutton: boolean;
  sethidebutton: (hidebutton: boolean) => void;
  setenableselect: (enableselect: boolean) => void;
  enableselect: boolean;
  filteredUsers: PlatformData[];
  selectedCount?: number;
  exportMode?: "selected" | "excluding_deleted" | "all";
  exportCount?: number;
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
  const [viewMode, setViewMode] = useState<"grid" | "list" | "graph">("list");
  const [deletedItemKeys, setDeletedItemKeys] = useState<Set<string>>(new Set());

  // Function to check if spec_format has only registered and platform_variables
  const hasSimpleSpecFormat = (specFormat: SpecFormatItem[]) => {
    return specFormat.every(
      (item) =>
        Object.keys(item).length === 2 && "registered" in item && "platform_variables" in item
    );
  };

  // Function to generate unique key for an item
  const getItemKey = (item: PlatformData) => {
    return `${item.module}-${item.query}-${item.from}`;
  };

  // Update data with 2-second interval
  useEffect(() => {
    const updateData = () => {
      // Filter out simple spec format AND permanently deleted items
      const filtered = users
        .filter((user) => !hasSimpleSpecFormat(user.spec_format))
        .filter((user) => !deletedItemKeys.has(getItemKey(user)));
      
      const cardData = users.filter((user) => hasSimpleSpecFormat(user.spec_format));
      
      setFilteredUsers(prevFiltered => {
        // Only clear selections if the actual data content has changed significantly
        const dataChanged = prevFiltered.length !== filtered.length || 
          JSON.stringify(prevFiltered.map(getItemKey)) !== JSON.stringify(filtered.map(getItemKey));
        
        if (dataChanged) {
          setSelectedIndices(prevSelected => 
            prevSelected.filter(index => index < filtered.length)
          );
        }
        
        return filtered;
      });
      
      setCards(cardData);
    };

    // Initial update
    updateData();

    // Set up interval
    const intervalId = setInterval(updateData, 2000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [users, deletedItemKeys]);

  // Function to handle card selection
  const handleCardSelect = (index: number) => {
    setSelectedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Function to permanently delete selected cards
  const permanentlyDeleteSelectedCards = () => {
    // Track the keys of items being deleted
    const itemsToDelete = selectedIndices.map(index => getItemKey(filteredUsers[index]));
    setDeletedItemKeys(prev => {
      const newSet = new Set(prev);
      itemsToDelete.forEach(key => newSet.add(key));
      return newSet;
    });
    
    // Clear selections and modes
    setSelectedIndices([]);
    setenableselect(false);
    setdeletebutton(false);
  };

  const handleDelete = (index: number) => {
    // Track the deleted item key
    const itemKey = getItemKey(filteredUsers[index]);
    setDeletedItemKeys(prev => {
      const newSet = new Set(prev);
      newSet.add(itemKey);
      return newSet;
    });
  };

  // Get data for export based on mode
  const getExportData = () => {
    if (enableselect && selectedIndices.length > 0) {
      return selectedIndices.map((index) => filteredUsers[index]).filter(Boolean);
    } else if (deletebutton && selectedIndices.length > 0) {
      return filteredUsers.filter((_, index) => !selectedIndices.includes(index));
    } else {
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
    <div >
      {/* ActionBar with export functionality */}
      <ActionBar 
        data={fulldata || []} 
        selectedData={convertedExportData}
        hidebutton={hidebutton}
        sethidebutton={sethidebutton}
        setenableselect={setenableselect}
        enableselect={enableselect}
        resultCount={fulldata?.length || 0}
        selectedCount={selectedCount}
        exportMode={enableselect ? "selected" : deletebutton ? "excluding_deleted" : "all"}
        exportCount={exportCount}
      />

      {/* Control buttons */}
      <div className="flex flex-col gap-4 my-4">
        {/* View Toggle */}
        <div className="flex justify-between items-center">
          <div className="flex rounded-lg border border-border bg-background p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                viewMode === "grid"
                  ? "bg-foreground text-background shadow-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <Grid size={16} />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                viewMode === "list"
                  ? "bg-foreground text-background shadow-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <List size={16} />
                <span className="hidden sm:inline">List</span>
              </button>
              <button
              onClick={() => setViewMode("graph")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                viewMode === "graph"
                  ? "bg-foreground text-background shadow-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <BarChart size={16} />
              <span className="hidden sm:inline">Graph</span>
            </button>
            </div>
        </div>

        {/* Action Buttons */}
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
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl relative group overflow-hidden ${
                      enableselect
                        ? "bg-emerald-500 text-white hover:bg-emerald-600"
                        : "bg-background text-foreground border border-border hover:bg-accent"
                    }`}
                  >
                    <div className="flex items-center gap-2 relative z-10">
                      {enableselect ? (
                        <>
                          <X size={18} />
                          <span>Cancel Selection</span>
                        </>
                      ) : (
                        <>
                          <FileDown size={18} />
                          <span>Select for Export</span>
                        </>
                      )}
                      {enableselect && selectedCount > 0 && (
                        <span className="bg-background/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-sm font-semibold flex items-center gap-1">
                          <Check size={14} />
                          {selectedCount}
                        </span>
                      )}
                    </div>
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                      enableselect ? "bg-emerald-600" : "bg-accent"
                    }`} />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-background text-foreground border border-border">
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
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl relative group overflow-hidden ${
                      deletebutton
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-background text-foreground border border-border hover:bg-accent"
                    }`}
                  >
                    <div className="flex items-center gap-2 relative z-10">
                      {deletebutton ? (
                        <>
                          <X size={18} />
                          <span>Cancel Exclude</span>
                        </>
                      ) : (
                        <>
                          <Ban size={18} />
                          <span>Exclude from Export</span>
                        </>
                      )}
                      {deletebutton && selectedCount > 0 && (
                        <span className="bg-background/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-sm font-semibold flex items-center gap-1 ml-1">
                          <XCircle size={14} />
                          {selectedCount}
                        </span>
                      )}
                    </div>
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                      deletebutton ? "bg-red-600" : "bg-accent"
                    }`} />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-background text-foreground border border-border">
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
              className={`p-4 rounded-lg border text-sm font-medium shadow-lg backdrop-blur-sm ${
                enableselect
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                  : deletebutton
                    ? "bg-red-500/10 border-red-500/20 text-red-500"
                    : "bg-muted border-border text-muted-foreground"
              }`}
            >
              {enableselect ? (
                selectedCount > 0 ? (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-emerald-500/20">
                      <CheckCircle2 size={20} className="text-emerald-500" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold">Ready to Export</span>
                      <span className="text-emerald-500/80 text-xs">
                        Will export ONLY {selectedCount} selected record(s)
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-emerald-500/20">
                      <FileDown size={20} className="text-emerald-500" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold">Select Records to Export</span>
                      <span className="text-emerald-500/80 text-xs">
                        Click on records you want to include in the export
                      </span>
                    </div>
                  </div>
                )
              ) : deletebutton ? (
                selectedCount > 0 ? (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-red-500/20">
                      <XCircle size={20} className="text-red-500" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold">Records Excluded</span>
                      <span className="text-red-500/80 text-xs">
                        Will export {filteredUsers.length - selectedCount} record(s), excluding {selectedCount} selected
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-red-500/20">
                      <Ban size={20} className="text-red-500" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold">Select Records to Exclude</span>
                      <span className="text-red-500/80 text-xs">
                        Click on records you want to exclude from the export
                      </span>
                    </div>
                  </div>
                )
              ) : null}
            </div>
          </div>
        )}

        {/* Permanent delete confirmation dialog */}
        {selectedIndices.length > 0 && deletebutton && (
          <div >
            <AlertDialog>
              <AlertDialogTrigger className="text-foreground font-medium bg-muted hover:bg-accent px-6 py-2.5 rounded-lg text-center transition-all duration-200 shadow-lg">
                Permanently Delete Selected ({selectedIndices.length})
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-background border border-border">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl font-bold text-foreground">
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground">
                    This action cannot be undone. This will permanently delete{" "}
                    {selectedIndices.length} selected record(s) from your data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-muted text-muted-foreground hover:bg-accent border border-border">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={permanentlyDeleteSelectedCards}
                    className="bg-muted hover:bg-accent text-foreground font-medium"
                  >
                    Delete {selectedIndices.length} Record(s)
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      {/* Render appropriate view */}
      {viewMode === "grid" ? (
        <GridView
          filteredUsers={filteredUsers}
          selectedIndices={selectedIndices}
          handleCardSelect={handleCardSelect}
          enableselect={enableselect}
          deletebutton={deletebutton}
          hidebutton={hidebutton}
          PaidSearch={PaidSearch}
          handleDelete={handleDelete}
        />
      ) : viewMode === "graph" ? (
        <GraphView 
          data={filteredUsers}
          selectedIndices={selectedIndices}
          handleCardSelect={handleCardSelect}
          enableselect={enableselect}
          deletebutton={deletebutton}
        />
      ) : (
        <ListView
          filteredUsers={filteredUsers}
          selectedIndices={selectedIndices}
          handleCardSelect={handleCardSelect}
          enableselect={enableselect}
          deletebutton={deletebutton}
        />
      )}

      {/* Category Cards */}
      {Cards.length > 0 && <CategoryCard CardData={Cards} />}
    </div>
  );
};

export default InfoCardList;
