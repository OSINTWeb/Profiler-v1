import React, { useState } from "react";
import { SearchTypesProps, Tool, SearchOption } from "src/types/types";
  
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
    <div
      className={`flex flex-col items-center justify-center gap-6 px-4 ${
        selected !== "Paid" ? "pb-56" : ""
      }`}
    >
      <div className="flex gap-4 max-w-full w-full px-4 relative justify-center">
        {selected === "Paid" &&
          options.map((type, index) => (
            <div className="relative" key={index}>
              <button
                onClick={() => toggleDrawer(type as SearchOption)}
                className={`
                  flex justify-center items-center gap-3 text-lg font-semibold
                  bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl
                  border border-gray-700 text-gray-200 h-12
                  shadow-lg hover:shadow-xl transition-all duration-300 ease-out
                  w-32 sm:w-56 px-6 group
                  hover:scale-105 active:scale-95
                  hover:from-gray-700 hover:to-gray-800
                  hover:border-gray-600 hover:text-white
                  ${
                    typeofsearch === type
                      ? "bg-gradient-to-b from-gray-700 to-gray-800 border-gray-500 text-white shadow-gray-500/20"
                      : ""
                  }
                `}
              >
                <div className="flex items-center gap-2 w-full justify-center">
                  {/* Remove icon for 'Basic' and 'Advance' since iconMap does not have these keys */}
                  {/* <span className="text-gray-400 group-hover:text-gray-300 transition-colors">
                    {iconMap[type as SearchOption]}
                  </span> */}
                  <span className="whitespace-nowrap">{type}</span>
                </div>
              </button>
            </div>
          ))}

        {selected === "Free" && (
          <div className="flex flex-wrap gap-6 justify-center items-center w-full max-w-6xl">
            {FreeTools.map((tool, index) => {
              const isUserFindr = tool.title.toLowerCase() === "userfindr";
              const isCallSpy = tool.title.toLowerCase() === "callspy";
              return (
                <div
                  key={index}
                  className={`
                    bg-gradient-to-b from-gray-900 to-black rounded-xl w-72 p-6 
                    border border-gray-800 hover:border-gray-600 
                    transition-all duration-300 ease-out relative
                    hover:scale-105 hover:shadow-xl hover:shadow-gray-900/50
                    ${isUserFindr ? "border-2 border-gray-600 shadow-lg shadow-gray-600/30" : ""}
                    ${isCallSpy ? "border-2 border-gray-500 shadow-lg shadow-gray-500/30" : ""}
                  `}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  {isUserFindr && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                      NEW
                    </span>
                  )}
                  {isCallSpy && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                      OFFER
                    </span>
                  )}
                  
                  <h3 className="font-bold text-xl text-white mb-3 flex items-center justify-start">
                    {tool.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 min-h-[3rem]">
                    {tool.description}
                  </p>
                  
                  <button
                    onClick={() => {
                      window.location.href = tool.link;
                    }}
                    className="
                      w-full bg-gradient-to-r from-gray-700 to-gray-800 
                      hover:from-gray-600 hover:to-gray-700 
                      text-white font-semibold py-3 rounded-lg 
                      transition-all duration-300 ease-out
                      hover:scale-105 hover:shadow-lg hover:shadow-gray-700/30
                      active:scale-95 border border-gray-600
                    "
                  >
                    Search Now
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {selected === "Freemium" && (
          <div className="flex flex-wrap gap-6 justify-center items-center w-full max-w-6xl">
            {FreemiumTools.map((tool, index) => (
              <div
                key={index}
                className="
                  bg-gradient-to-b from-gray-900 to-black rounded-xl w-72 p-6 
                  border border-gray-800 hover:border-gray-600 
                  transition-all duration-300 ease-out
                  hover:scale-105 hover:shadow-xl hover:shadow-gray-900/50
                "
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-xl text-white">{tool.title}</h3>
                  <span className="bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xs font-bold px-2 py-1 rounded-full">
                    PREMIUM
                  </span>
                </div>
                
                <p className="text-gray-400 text-sm leading-relaxed mb-6 min-h-[3rem]">
                  {tool.description}
                </p>
                
                <button
                  onClick={() => {
                    window.location.href = tool.link;
                  }}
                  className="
                    w-full bg-gradient-to-r from-gray-700 to-gray-800 
                    hover:from-gray-600 hover:to-gray-700 
                    text-white font-semibold py-3 rounded-lg 
                    transition-all duration-300 ease-out
                    hover:scale-105 hover:shadow-lg hover:shadow-gray-700/30
                    active:scale-95 border border-gray-600
                  "
                >
                  Search Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
