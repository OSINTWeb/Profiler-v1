import React, { useState, useEffect } from "react";

interface SearchOptionsProps {
  setInput: React.Dispatch<React.SetStateAction<{ datatype: string; value: string }>>;
  input: { datatype: string; value: string };
  setPaidSearch: (val: string) => void;
  PaidSearch: string;
  typeofsearch: string;
}

export const SearchOptions: React.FC<SearchOptionsProps> = ({
  setInput,
  setPaidSearch,
  PaidSearch,
  typeofsearch,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>(PaidSearch);

  useEffect(() => {
    if (typeofsearch === "Basic" && (PaidSearch === "Phone" || PaidSearch === "Username")) {
      setPaidSearch("Email");
      setInput((prev) => ({ ...prev, datatype: "Email", value: "" }));
      setSelectedOption("Email");
    }
  }, [typeofsearch, PaidSearch, setPaidSearch, setInput]);

  useEffect(() => {
    setSelectedOption(PaidSearch);
  }, [PaidSearch]);

  const handleUpdate = (newDatatype: string) => {
    if (!(newDatatype === "Phone" && typeofsearch === "Basic")) {
      setPaidSearch(newDatatype);
      setInput((prev) => ({ ...prev, datatype: newDatatype, value: "" }));
      setSelectedOption(newDatatype);
    }
  };

  const options = [
    {
      type: "Phone",
      message:
        typeofsearch === "Basic"
          ? "Coming Soon"
          : "Phone Number: Please enter the phone number in international format",
    },
    {
      type: "Username",
      message: "Username: Please enter the username",
    },
    { type: "Email", message: "Email: Provide a valid email address" },
  ];

  return (
    <div className="w-full flex flex-col sm:flex-row items-center sm:justify-center gap-6 py-6 px-8">
      {options.map(({ type, message }) => {
        const isDisabled = type === "Phone" && typeofsearch === "Basic";
        const isSelected = selectedOption === type;

        if (type === "Username" && typeofsearch !== "Advance") return null;

        return (
          <div key={type} className="relative flex flex-col items-center w-full sm:w-auto">
            <button
              onClick={() => handleUpdate(type)}
              disabled={isDisabled}
              title={message}
              className={`
                w-full sm:w-48 h-12 flex items-center justify-center 
                text-lg font-semibold rounded-xl border transition-all duration-300 ease-out
                shadow-lg hover:shadow-xl relative overflow-hidden group
                ${
                  isDisabled
                    ? "opacity-50 cursor-not-allowed bg-gradient-to-b from-gray-800 to-gray-900 border-gray-700 text-gray-500"
                    : isSelected
                    ? "bg-gradient-to-b from-gray-700 to-gray-800 border-gray-500 text-white shadow-gray-500/30"
                    : "bg-gradient-to-b from-gray-800 to-gray-900 border-gray-700 text-gray-200 hover:from-gray-700 hover:to-gray-800 hover:border-gray-600 hover:text-white hover:scale-105 active:scale-95"
                }
              `}
            >
              {/* Background glow effect */}
              {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-gray-500/20 rounded-xl" />
              )}

              {/* Hover overlay */}
              {!isDisabled && !isSelected && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-500/0 to-gray-600/0 group-hover:from-gray-500/5 group-hover:to-gray-600/5 rounded-xl transition-all duration-300" />
              )}

              <span className="relative z-10">{type}</span>

              {/* Status indicator */}
              {isDisabled && (
                <span className="absolute top-1 right-2 text-xs text-gray-600 font-medium">
                  Soon
                </span>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
};
