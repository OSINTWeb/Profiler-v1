import React, { useState, useEffect } from "react";
import InfoCard from "./ProfileSection";
import SelectInfo from "./SelectInfo";
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
  const [allUsers, setAllUsers] = useState<PlatformData[]>([]);

  // Show all users without any filtering
  useEffect(() => {
    setAllUsers(users);
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
    const updatedUsers = allUsers.filter((_, index) => !selectedIndices.includes(index));
    setAllUsers(updatedUsers);
    setSelectedIndices([]);
    setenableselect(false);
    setdeletebutton(false);
  };

  const handleDelete = (index: number) => {
    setAllUsers(allUsers.filter((_, i) => i !== index));
  };

  // Get data for export based on mode
  const getExportData = () => {
    if (enableselect && selectedIndices.length > 0) {
      // Select mode: export ONLY selected items
      return selectedIndices.map((index) => allUsers[index]).filter(Boolean);
    } else if (deletebutton && selectedIndices.length > 0) {
      // Delete mode: export ALL items EXCEPT selected ones
      return allUsers.filter((_, index) => !selectedIndices.includes(index));
    } else {
      // Default: export all items
      return allUsers;
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
    <div>
      {/* ActionBar with export functionality */}
      <SelectInfo
        data={fulldata}
        selectedData={convertedExportData}
        hidebutton={hidebutton}
        sethidebutton={sethidebutton}
        setenableselect={setenableselect}
        enableselect={enableselect}
        filteredUsers={allUsers}
        selectedCount={selectedCount}
        exportMode={enableselect ? "selected" : deletebutton ? "excluding_deleted" : "all"}
        exportCount={exportCount}
      />

      {/* Control buttons */}
      <div className="flex flex-col gap-4 my-4">
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
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl hover:shadow-[#548f9b]/50 ${
                      enableselect
                        ? "bg-[#548f9b] text-white hover:bg-[#4a7d87]"
                        : "bg-[rgba(19,19,21,1)] text-[rgba(207,207,207,1)] border border-[#163941] hover:bg-[rgba(25,25,27,1)]"
                    }`}
                  >
                    <span>{enableselect ? "Cancel Selection" : "Select for Export"}</span>
                    {enableselect && selectedCount > 0 && (
                      <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">
                        {selectedCount}
                      </span>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-900 text-gray-100 border border-gray-700">
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
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl hover:shadow-red-500/50 ${
                      deletebutton
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-[rgba(19,19,21,1)] text-[rgba(207,207,207,1)] border border-[#163941] hover:bg-[rgba(25,25,27,1)]"
                    }`}
                  >
                    <span>
                      {deletebutton ? "Cancel Exclude" : "Exclude from Export"}
                      {deletebutton && selectedCount > 0 && (
                        <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm ml-2">
                          {selectedCount} excluded
                        </span>
                      )}
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-900 text-gray-100 border border-gray-700">
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
              className={`p-4 rounded-lg border text-sm font-medium shadow-lg hover:shadow-xl hover:shadow-[#548f9b]/30 ${
                enableselect
                  ? "bg-blue-500/10 border-blue-500/30 text-blue-300"
                  : "bg-orange-500/10 border-orange-500/30 text-orange-300"
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
                  Export will include {allUsers.length - selectedCount} record(s) (excluding{" "}
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
              <AlertDialogTrigger className="text-white font-medium bg-red-500 hover:bg-red-600 px-6 py-2.5 rounded-lg text-center transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-red-500/50">
                Permanently Delete Selected ({selectedIndices.length})
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gray-900 border border-gray-700">
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
                  <AlertDialogCancel className="bg-gray-800 text-gray-200 hover:bg-gray-700">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={permanentlyDeleteSelectedCards}
                    className="bg-red-500 hover:bg-red-600 text-white font-medium"
                  >
                    Delete {selectedIndices.length} Record(s)
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      {/* Cards Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-4">
        {allUsers.length > 0 ? (
          allUsers.map((user, index) => (
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
                          ? "bg-[#548f9b] border-[#548f9b] text-white shadow-[#548f9b]/50"
                          : "bg-red-500 border-red-500 text-white shadow-red-500/50"
                        : "bg-gray-900/90 border-gray-400 hover:border-[#548f9b] hover:bg-gray-800/90 backdrop-blur-sm"
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
                      <div className="w-3 h-3 rounded-full border border-gray-400"></div>
                    )}
                  </div>
                </div>
              )}

              {/* Info Card - convert to compatible format */}
              <div
                className={`transition-all duration-300 ${
                  selectedIndices.includes(index)
                    ? enableselect
                      ? "ring-2 ring-[#548f9b] rounded-xl shadow-lg shadow-[#548f9b]/25"
                      : "ring-2 ring-red-500 rounded-xl shadow-lg shadow-red-500/25"
                    : ""
                }`}
              >
                <InfoCard
                  userData={{
                    module: user.module,
                    pretty_name: user.pretty_name,
                    query: user.query,
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
          <p className="text-gray-400 text-center w-full">No user data available</p>
        )}
      </div>

      {/* All cards are now shown in the main grid above */}
    </div>
  );
};

export default InfoCardList;
