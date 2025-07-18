"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { SearchTypeSelector } from "@/components/paidcomponents/SearchTypeselect";
import { SearchOptions } from "@/components/paidcomponents/Options";
import { X, Search } from "lucide-react";
import "@/app/globals.css";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useUser } from "@auth0/nextjs-auth0";

import CountrySelect from "@/components/paidcomponents/contryselect";
import { Button } from "@/components/ui/button";
import { SearchTypes } from "@/components/paidcomponents/SearchTypes";

declare global {
  interface Window {
    Refgrow: (id: number, event: string, email: string) => void;
  }
}

export default function Profile() {
  const { user, isLoading } = useUser();
  const [input, setInput] = useState({ datatype: "Email", value: "" });
  const [selected, setSelected] = useState<string>("Paid");
  const [PaidSearch, setPaidSearch] = useState("Email");
  const [countryCode, setCountryCode] = useState("+91"); // Default country code
  const [countryCodeDigits, setCountryCodeDigits] = useState(10); // Default digits for phone validation
  const [emailError, setEmailError] = useState<string>(""); // State for email validation error
  const [query, setQuery] = useState("");
  const [phoneError, setPhoneError] = useState<string>(""); // State for phone validation
  const [typeofsearch, settypeofsearch] = useState<string>("Advance");
  const [userData, setUserData] = useState({
    _id: "",
    email: "",
    name: "",
    phone: "",
    credits: 0,
  });
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Step 1: Get the ID token (JWT) from Auth0 session

        // Get ID token (JWT) from custom API endpoint
        const idTokenResponse = await fetch("/api/auth/id-token");
        const idTokenData = await idTokenResponse.json();
        const idToken = idTokenData.idToken;
        // Choose which token to use: ID token (JWT) preferred
        // console.log("ID token (JWT) retrieved:", idToken);
        const authToken = idToken;

        if (!authToken) {
          console.error("No authentication token available");
          return;
        }

        // Step 2: Make the signup POST request with the bearer token
        const response = await fetch("https://profiler-api-production.up.railway.app/api/login", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Signup request failed: ${response.status} ${response.statusText}`);
        }
        else{
          if (window.Refgrow) {
            window.Refgrow(0, 'signup', user?.email || "");
          }
        }
        const signupData = await response.json();
        // console.log("Signup successful:", signupData);
        // console.log("Signup successful:", signupData.user);

        // Update user data with the response
        if (signupData.user) {
          setUserData({
            _id: signupData.user._id || "",
            email: signupData.user.email || "",
            name: signupData.user.name || "Customer",
            phone: signupData.user.phone || "",
            credits: signupData.user.credits || 0,
          });
        }
      } catch (error) {
        console.error("Error in fetchUserData:", error);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  const [miniCredits, setMiniCredits] = useState(0);
  const [creditsError, setCreditsError] = useState("");

  useEffect(() => {
    const requiredCredits = typeofsearch === "Basic" ? 0.05 : 0.5;
    setMiniCredits(requiredCredits);

    if (userData.credits < requiredCredits) {
      setCreditsError(
        `You need at least ${requiredCredits} credits to perform this ${typeofsearch.toLowerCase()} search.`
      );
    } else {
      setCreditsError("");
    }
  }, [userData, typeofsearch]);
  useEffect(() => {
    const storedInputValue = localStorage.getItem("inputValue");
    if (storedInputValue) {
      setInput((prev) => ({ ...prev, value: storedInputValue }));
      localStorage.removeItem("inputValue");
    }
  }, []);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = new RegExp(`^[0-9]{${countryCodeDigits}}$`);
    return phoneRegex.test(phone);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-start overflow-y-auto">
      <div className="w-full flex justify-between  ">
        <div className=" flex  mx-auto ">
          <button
            onClick={() => {
              window.open("/TransactionHistory", "_blank");
            }}
            className="group flex items-center gap-2 bg-zinc-900/80 backdrop-blur-sm border border-white/10 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:bg-zinc-800/80 shadow-lg"
          >
            <svg
              className="w-5 h-5 text-white/80 group-hover:text-white transition"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Transaction History</span>
          </button>
        </div>
        <div className=" flex  mx-auto ">
          <button
            onClick={() => {
              window.open("/history", "_blank");
            }}
            className="group flex items-center gap-2 bg-zinc-900/80 backdrop-blur-sm border border-white/10 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:bg-zinc-800/80 shadow-lg"
          >
            <svg
              className="w-5 h-5 text-white/80 group-hover:text-white transition"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Search History</span>
          </button>
        </div>
      </div>
      <div className="w-full max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-8">
          {/* Search Type Selector */}
          <div className="w-full flex justify-center">
            <SearchTypeSelector selected={selected} setSelected={setSelected} />
          </div>

          {/* Basic/Advance Selection - Enhanced UI */}
          {selected === "Paid" && (
            <div className="w-full flex justify-center mb-6">
              <div className="relative bg-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-2 shadow-2xl">
                {/* Animated background indicator */}
                <div
                  className="absolute top-2 bottom-2 bg-gradient-to-r from-white to-zinc-100 rounded-xl shadow-lg transition-all duration-300 ease-out"
                  style={{
                    width: `calc(50% - 4px)`,
                    left: typeofsearch === "Basic" ? "4px" : "calc(50% + 0px)",
                  }}
                />

                <div className="flex relative z-10">
                  {["Basic", "Advance"].map((type) => (
                    <button
                      key={type}
                      onClick={() => settypeofsearch(type)}
                      className={`
                        relative flex-1 py-4 px-8 mx-1 rounded-xl text-lg font-semibold
                        transition-all duration-300 ease-out
                        hover:scale-105 active:scale-95 min-w-[120px]
                        ${
                          typeofsearch === type
                            ? "text-black font-bold shadow-lg"
                            : "text-white hover:text-zinc-200"
                        }
                      `}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {type === "Basic" && (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                        )}
                        {type === "Advance" && (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                          </svg>
                        )}
                        {type}
                      </span>

                      {/* Description text */}
                      <div
                        className={`text-xs mt-1 ${
                          typeofsearch === type ? "text-zinc-600" : "text-zinc-400"
                        }`}
                      >
                        {type === "Basic" ? "Quick Search" : "Deep Analysis"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Search Types */}
          {selected !== "Paid" && (
            <div className="w-full flex justify-center">
              <SearchTypes
                settypeofsearch={settypeofsearch}
                selected={selected}
                typeofsearch={typeofsearch}
              />
            </div>
          )}

          {/* Paid Search Section */}
          {selected === "Paid" && (
            <div className="w-full max-w-4xl mx-auto space-y-8">
              {/* Premium Search Bar Section */}
              <div className="flex flex-col items-center space-y-8">
                {/* Main Search Container */}
                <div className="w-full max-w-4xl">
                  <div className="">
                    {/* Search bar container */}
                    <div className="relative bg-black border-2 border-white/20 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
                      {/* Inner border glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-2xl"></div>

                      <div className="relative flex items-center">
                        {/* Search icon */}
                        <div className="flex-shrink-0 px-6 py-2 text-white/70">
                          <Search size={28} strokeWidth={2} />
                        </div>

                        {/* Country selector for phone */}
                        {PaidSearch === "Phone" && (
                          <div className="flex-shrink-0 border-r border-white/10 pr-4">
                            <CountrySelect
                              value={countryCode}
                              onChange={setCountryCode}
                              onDigitsChange={setCountryCodeDigits}
                            />
                          </div>
                        )}

                        {/* Input field */}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex-1 relative">
                                <Input
                                  type="text"
                                  placeholder={`Enter your ${input.datatype} to start searching...`}
                                  onChange={(e) => {
                                    if (userData.credits >= miniCredits) {
                                      setInput((prev) => ({ ...prev, value: e.target.value }));
                                      if (PaidSearch === "Username") {
                                        setQuery(e.target.value);
                                        setEmailError("");
                                        setPhoneError("");
                                      } else if (PaidSearch === "Email") {
                                        if (!validateEmail(e.target.value)) {
                                          setEmailError("The email you typed is invalid.");
                                        } else {
                                          setQuery(e.target.value);
                                          setEmailError("");
                                        }
                                      } else if (PaidSearch === "Phone") {
                                        if (!validatePhone(e.target.value)) {
                                          setPhoneError("The phone number you entered is invalid.");
                                        } else {
                                          setQuery(countryCode + e.target.value);
                                          setPhoneError("");
                                        }
                                      }
                                    }
                                  }}
                                  value={input.value}
                                  className="bg-transparent border-none text-white text-2xl font-light placeholder:text-white/40 focus-visible:ring-0 px-6 py-8 w-full"
                                  disabled={userData.credits < miniCredits}
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-white text-black border-0 shadow-lg">
                              <p className="font-medium">Enter your search query</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {/* Clear button */}
                        {input.value && (
                          <button
                            onClick={() => setInput((prev) => ({ ...prev, value: "" }))}
                            className="flex-shrink-0 p-6 text-white/50 hover:text-white transition-all duration-200 hover:bg-white/5 rounded-lg mr-2"
                          >
                            <X size={24} strokeWidth={2} />
                          </button>
                        )}

                        {/* Search button integrated */}
                        <div className="flex-shrink-0 p-2">
                          <Button
                            className="relative overflow-hidden bg-white hover:bg-zinc-100 text-black font-bold px-8 py-6 text-lg rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg group border-0"
                            onClick={() => {
                              const params = new URLSearchParams({
                                PaidSearch: PaidSearch,
                                query: query,
                                typeofsearch: typeofsearch,
                                userId: userData._id,
                              });
                              if (query != "") {
                                if (typeofsearch === "Basic") {
                                  window.open(
                                    `/result/${typeofsearch}?${params.toString()}`,
                                    "_blank"
                                  );
                                } else {
                                  window.open(
                                    `/result/${typeofsearch}?${params.toString()}`,
                                    "_blank"
                                  );
                                }
                              }
                            }}
                            disabled={
                              !input.value ||
                              isLoading ||
                              !!emailError ||
                              !!phoneError ||
                              typeofsearch === "" ||
                              (PaidSearch === "Phone" && typeofsearch === "Basic") ||
                              userData.credits < miniCredits
                            }
                          >
                            {/* Button shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

                            <span className="relative flex items-center gap-2">
                              <Search size={20} strokeWidth={2.5} />
                              Search
                            </span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Search type indicator */}
                  <div className="text-center mt-4">
                    <span className="text-white/60 text-sm font-medium">
                      {typeofsearch} Search • {PaidSearch} Lookup
                    </span>
                  </div>
                </div>

                {/* Error Messages */}
                {PaidSearch === "Email" && input.value && emailError && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 backdrop-blur-sm">
                    <p className="text-red-400 text-sm text-center">{emailError}</p>
                  </div>
                )}
                {PaidSearch === "Phone" && input.value && phoneError && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 backdrop-blur-sm">
                    <p className="text-red-400 text-sm text-center">{phoneError}</p>
                  </div>
                )}
                {userData.credits < miniCredits && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 backdrop-blur-sm">
                    <p className="text-red-400 text-sm text-center">{creditsError}</p>
                  </div>
                )}
              </div>

              {/* Search Options */}
              <div className="w-full flex justify-center">
                <SearchOptions
                  setPaidSearch={setPaidSearch}
                  setInput={setInput}
                  input={input}
                  PaidSearch={PaidSearch}
                  typeofsearch={typeofsearch}
                />
              </div>

              {/* Demo Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                <button
                  className="group relative bg-zinc-900/80 backdrop-blur-sm hover:bg-zinc-800/80 text-white font-medium px-8 py-4 rounded-xl transition-all duration-300 border border-zinc-700/50 hover:border-zinc-600/50 hover:scale-105 w-full sm:w-auto shadow-lg"
                  onClick={() => {
                    if (!PaidSearch) {
                      alert("Please select a search type first");
                      return;
                    }

                    const data = {
                      query: "45206164641316463216463164",
                      type: "Advance",
                      PaidSearch: PaidSearch,
                    };

                    localStorage.setItem("searchData", JSON.stringify(data));
                    window.open("/result/Advance", "_blank");
                  }}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    Demo: Advanced Search
                  </span>
                </button>

                <button
                  className="group relative bg-zinc-900/80 backdrop-blur-sm hover:bg-zinc-800/80 text-white font-medium px-8 py-4 rounded-xl transition-all duration-300 border border-zinc-700/50 hover:border-zinc-600/50 hover:scale-105 w-full sm:w-auto shadow-lg"
                  onClick={() => {
                    if (!PaidSearch) {
                      alert("Please select a search type first");
                      return;
                    }

                    const data = {
                      query: "dheerajydv19@proton.me",
                      type: "Basic",
                      PaidSearch: PaidSearch,
                    };

                    localStorage.setItem("searchData", JSON.stringify(data));
                    window.open("/result/Basic", "_blank");
                  }}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    Demo: Basic Search
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
