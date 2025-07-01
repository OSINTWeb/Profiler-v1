import React, { useState, useEffect } from "react";
import SelectInfo from "./SelectInfo";
import CategoryCard from "./categoryCard";
import GridView from "./GridView";
import ListView from "./ListView";

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
import { Grid, List } from "lucide-react";

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
  const [isDataStable, setIsDataStable] = useState(false);

  // Function to check if spec_format has only registered and platform_variables
  const hasSimpleSpecFormat = (specFormat: SpecFormatItem[]) => {
    return specFormat.every(
      (item) =>
        Object.keys(item).length === 2 && "registered" in item && "platform_variables" in item
    );
  };

  // Handle data streaming stability
  useEffect(() => {
    setIsDataStable(false);
    const stabilityTimer = setTimeout(() => {
      setIsDataStable(true);
    }, 500); // Wait 500ms for data to stabilize

    return () => clearTimeout(stabilityTimer);
  }, [users]);

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
      ) : (
        <ListView
          filteredUsers={filteredUsers}
          selectedIndices={selectedIndices}
          handleCardSelect={handleCardSelect}
          enableselect={enableselect}
          deletebutton={deletebutton}
          isDataStable={isDataStable}
        />
      )}

      {/* Category Cards */}
      {Cards.length > 0 && <CategoryCard CardData={Cards} />}
    </div>
  );
};

export default InfoCardList;
