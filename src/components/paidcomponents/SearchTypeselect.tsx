import React from "react";

interface SearchTypeSelectorProps {
  selected: string;
  setSelected: (type: string) => void;
}

export function SearchTypeSelector({ selected, setSelected }: SearchTypeSelectorProps) {
  const types = ["Free", "Paid", "Freemium"];

  return (
    <section className="relative w-full max-w-md mx-auto my-6">
      {/* Main container with black theme */}
      <div className="relative rounded-2xl p-1 bg-gradient-to-b from-gray-900 to-black border border-gray-800 shadow-xl">
        {/* Animated background indicator */}
        <div 
          className="absolute top-1 bottom-1 transition-all duration-300 ease-out bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl shadow-lg border border-gray-600"
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
                flex-1 py-3 px-2 mx-1 rounded-xl text-sm sm:text-base font-medium
                transition-all duration-300 ease-out relative
                hover:scale-105 active:scale-95
                ${
                  selected === type
                    ? "text-white font-bold shadow-lg"
                    : "text-gray-400 hover:text-gray-200"
                }
              `}
              onClick={() => setSelected(type)}
            >
              {/* Button content with proper labels */}
              <span className="relative z-10 block">
                {type === "Freemium" ? "Premium" : type}
              </span>
              
              {/* Hover effect overlay */}
              {selected !== type && (
                <div className="absolute inset-0 bg-white opacity-0 hover:opacity-5 rounded-xl transition-opacity duration-200" />
              )}
              
              {/* Active state glow */}
              {selected === type && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-gray-500/20 rounded-xl" />
              )}
            </button>
          ))}
        </div>
        
        {/* Subtle bottom border accent */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-gray-600 to-transparent rounded-full" />
      </div>
      
     
    </section>
  );
}
