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
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-6">
        {options.map(({ type, message }) => {
          const isDisabled = type === "Phone" && typeofsearch === "Basic";
          const isSelected = selectedOption === type;

          if (type === "Username" && typeofsearch !== "Advance") return null;

          return (
            <button
              key={type}
              onClick={() => handleUpdate(type)}
              disabled={isDisabled}
              title={message}
              className={`
                relative flex-1 sm:flex-none sm:w-40 h-12 flex items-center justify-center 
                text-base font-semibold rounded-xl border transition-all duration-300 ease-out
                shadow-lg hover:shadow-xl overflow-hidden group
                ${
                  isDisabled
                    ? "opacity-50 cursor-not-allowed bg-zinc-800 border-zinc-600 text-zinc-500"
                    : isSelected
                    ? "bg-white text-black border-white hover:bg-zinc-100"
                    : "bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800 hover:border-zinc-600 hover:scale-105 active:scale-95"
                }
              `}
            >
              <span className="relative z-10">{type}</span>

              {/* Status indicator for disabled buttons */}
              {isDisabled && (
                <span className="absolute top-1 right-2 text-xs text-zinc-600 font-medium">
                  Soon
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
