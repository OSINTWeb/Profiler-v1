import React, { useState } from "react";
import { SearchTypesProps, Tool, SearchOption } from "src/types/types";
import SearchBarFreeTools from "./SearchBarFreeTools";
  
export function SearchTypes({ settypeofsearch, selected, typeofsearch }: SearchTypesProps) {
  const [openDrawer, setOpenDrawer] = useState<SearchOption | null>(null);

  const toggleDrawer = (type: SearchOption) => {
    settypeofsearch(type);
    if (selected === "Free") {
      setOpenDrawer(openDrawer === type ? null : type);
    }
  };

  const options = ["Basic", "Advance"];

  const FreeTools: Tool[] = [
    {
      title: "Gravaton",
      description: "Find public Gravatar profile associated with any email address",
      link: "https://gravaton.profiler.me/",
    },
    {
      title: "Linkook",
      description: "Discover connected social accounts just by a username.",
      link: "https://linkook.profiler.me/",
    },
    {
      title: "Proton Intelligence",
      description: "Identify ProtonMail Mail Addresses Along with its Creation date and Time.",
      link: "https://protonintel.profiler.me/",
    },
    {
      title: "Breach Guard",
      description: "Enter your email to see if it has appeared in any data breaches",
      link: "https://breachguard.profiler.me/",
    },
    {
      title: "Info-Stealer Lookup",
      description: "Check if your email or username has been compromised by info-stealing malware",
      link: "https://infostealer.profiler.me/",
    },
    {
      title: "TiktokerFinder",
      description: "Quickly identify whether a TikTok account exists for a given username.",
      link: "https://tiktokerfinder.profiler.me/",
    },
  ];

  const FreemiumTools: Tool[] = [
    {
      title: "SimSpy",
      description: "Check phone number details such as line type, carrier, and country information",
      link: "https://simspy.profiler.me/",
    },
    {
      title: "Mail2Linked",
      description: "Find LinkedIn with Just an Email",
      link: "https://mail2linkedin.profiler.me/",
    },
    {
      title: "XScan",
      description:
        "Enter any Twitter username and instantly access a detailed, structured profile view with insights even Twitter doesn't reveal",
      link: "https://xscan.profiler.me/",
    },
    {
      title: "EmailIntel",
      description:
        "Reveal where an email is registered. We check for presence of an account linked to that email on 30+ popular platforms.",
      link: "https://emailintel.profiler.me/",
    },
  ];

  // const drawerOptions = {
  //   "Phone Number Search": [
  //     "Ignorent",
  //     "Phomber",
  //     "Hudson rock intelligence",
  //     "Phoneinfoga",
  //     "Phone number to line type (twilio API)",
  //     "Phone number to UPI IDs (UPI INT Github Repo)",
  //     "Phone number to names",
  //   ],
  //   "Email Search": [
  //     "Holehe",
  //     "Mailcat",
  //     "Postle",
  //     "Mosint",
  //     "H8mail",
  //     "Hudson rock intelligence",
  //     "Check if email exists (by reacher)",
  //     "Email reputation check by emailrep.io (initially free plain)",
  //     "Gitshield",
  //     "Email to username, username to email",
  //   ],
  //   "Reverse Image Search": ["Google Lens", "Yandex Image", "Bing Visual Search", "TinEye"],
  // };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* Search Type Buttons for Paid */}
      {selected === "Paid" && (
        <div className="flex gap-4 justify-center mb-8">
          {options.map((type, index) => (
            <button
              key={index}
              onClick={() => toggleDrawer(type as SearchOption)}
              className={`
                flex justify-center items-center gap-3 text-lg font-semibold
                bg-zinc-900 hover:bg-zinc-800 rounded-xl
                border border-zinc-700 hover:border-zinc-600 text-white 
                h-14 px-8 sm:px-12 transition-all duration-300 ease-out
                hover:scale-105 active:scale-95 shadow-lg
                ${
                  typeofsearch === type
                    ? "bg-white text-black border-white hover:bg-zinc-100"
                    : ""
                }
              `}
            >
              <span className="whitespace-nowrap">{type}</span>
            </button>
          ))}
        </div>
      )}

      {/* Free Tools Grid */}
      {selected === "Free" && (
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FreeTools.map((tool, index) => {
              const isUserFindr = tool.title.toLowerCase() === "userfindr";
              const isCallSpy = tool.title.toLowerCase() === "callspy";
              return (
                <div
                  key={index}
                  className={`
                    relative bg-zinc-900 rounded-xl p-6 border border-zinc-700 
                    hover:border-zinc-500 transition-all duration-300 ease-out
                    hover:scale-105 hover:shadow-xl hover:shadow-black/50
                    ${isUserFindr ? "border-zinc-500 shadow-lg shadow-zinc-500/20" : ""}
                    ${isCallSpy ? "border-zinc-400 shadow-lg shadow-zinc-400/20" : ""}
                  `}
                >
                  {isUserFindr && (
                    <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                      NEW
                    </span>
                  )}
                  {isCallSpy && (
                    <span className="absolute -top-2 -right-2 bg-zinc-300 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                      OFFER
                    </span>
                  )}
                  
                  <h3 className="font-bold text-xl text-white mb-4">
                    {tool.title}
                  </h3>
                  
                  <p className="text-zinc-400 text-sm leading-relaxed mb-6 min-h-[3.5rem]">
                    {tool.description}
                  </p>
                  
                  <button
                    onClick={() => {
                      window.open(tool.link, "_blank");
                    }}
                    className="
                      w-full bg-white hover:bg-zinc-200 
                      text-black font-semibold py-3 rounded-lg 
                      transition-all duration-300 ease-out
                      hover:scale-105 hover:shadow-lg
                      active:scale-95
                    "
                  >
                    Search Now
                  </button>
                </div>
              );
            })}
          </div>
          <SearchBarFreeTools />
        </div>
      )}

      {/* Premium Tools Grid */}
      {selected === "Freemium" && (
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {FreemiumTools.map((tool, index) => (
              <div
                key={index}
                className="
                  relative bg-zinc-900 rounded-xl p-6 border border-zinc-700 
                  hover:border-zinc-500 transition-all duration-300 ease-out
                  hover:scale-105 hover:shadow-xl hover:shadow-black/50
                "
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-xl text-white">{tool.title}</h3>
                  <span className="bg-white text-black text-xs font-bold px-3 py-1 rounded-full">
                    PREMIUM
                  </span>
                </div>
                
                <p className="text-zinc-400 text-sm leading-relaxed mb-6 min-h-[3.5rem]">
                  {tool.description}
                </p>
                
                <button
                  onClick={() => {
                    window.open(tool.link, "_blank");
                  }}
                  className="
                    w-full bg-white hover:bg-zinc-200 
                    text-black font-semibold py-3 rounded-lg 
                    transition-all duration-300 ease-out
                    hover:scale-105 hover:shadow-lg
                    active:scale-95
                  "
                >
                  Search Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
