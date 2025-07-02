import React from "react";
import InfoCard from "./ProfileSection";
import { User } from "lucide-react";
import { PlatformData } from "./InfocardList";

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
    <div className="grid grid-cols-1 lg:grid-cols-2 border border-gray-600 rounded-lg p-6 gap-10 sm:gap-4 max-h-[5000px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-500">
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
                        ? "bg-white border-white text-black"
                        : "bg-gray-400 border-gray-400 text-black"
                      : "bg-black border-gray-500 hover:border-white hover:bg-gray-900 backdrop-blur-sm"
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
                    <div className="w-3 h-3 rounded-full border border-gray-500"></div>
                  )}
                </div>
              </div>
            )}

            {/* Info Card - convert to compatible format */}
            <div
              className={`transition-all duration-300 ${
                selectedIndices.includes(index)
                  ? enableselect
                    ? "ring-2 ring-white rounded-xl shadow-lg"
                    : "ring-2 ring-gray-400 rounded-xl shadow-lg"
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
          <div className="w-16 h-16 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center mb-4">
            <User size={24} className="text-gray-500" />
          </div>
          <p className="text-gray-400 text-lg font-medium">No user data available</p>
          <p className="text-gray-500 text-sm mt-1">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default GridView; 