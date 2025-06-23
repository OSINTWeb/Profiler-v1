import React from "react";

interface SearchTypeSelectorProps {
  selected: string;
  setSelected: (type: string) => void;
}

export function SearchTypeSelector({ selected, setSelected }: SearchTypeSelectorProps) {
  const types = ["Free", "Paid", "Freemium"];

  return (
    <section className="w-full max-w-md mx-auto">
      {/* Main container with improved black and white theme */}
      <div className="relative rounded-2xl p-1 bg-zinc-900 border border-zinc-700 shadow-2xl">
        {/* Animated background indicator */}
        <div 
          className="absolute top-1 bottom-1 transition-all duration-300 ease-out bg-white rounded-xl shadow-lg"
          style={{
            width: `calc(33.333% - 4px)`,
            left: `calc(${types.indexOf(selected) * 33.333}% + 2px)`,
          }}
        />
        
        {/* Button container */}
        <div className="flex relative z-10">
          {types.map((type) => (
            <button
              key={type}
              className={`
                flex-1 py-4 px-3 mx-1 rounded-xl text-base font-semibold
                transition-all duration-300 ease-out relative
                hover:scale-105 active:scale-95
                ${
                  selected === type
                    ? "text-black font-bold"
                    : "text-zinc-300 hover:text-white"
                }
              `}
              onClick={() => setSelected(type)}
            >
              {/* Button content with proper labels */}
              <span className="relative z-10 block">
                {type === "Freemium" ? "Premium" : type}
              </span>
              
              {/* Hover effect overlay for non-selected buttons */}
              {selected !== type && (
                <div className="absolute inset-0 bg-zinc-700 opacity-0 hover:opacity-30 rounded-xl transition-opacity duration-200" />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
