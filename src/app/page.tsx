"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { SearchTypeSelector } from "@/components/paidcomponents/SearchTypeselect";
import { SearchOptions } from "@/components/paidcomponents/Options";
import { X, Search, SearchIcon } from "lucide-react";
import "@/app/globals.css";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useUser } from "@auth0/nextjs-auth0";
import { useUserData } from "@/hooks/user-data";

import CountrySelect from "@/components/paidcomponents/contryselect";
import { Button } from "@/components/ui/button";
import { SearchTypes } from "@/components/paidcomponents/SearchTypes";

declare global {
  interface Window {
    Refgrow: (id: number, event: string, email: string) => void;
  }
}

export default function Profile() {
  const { user, isLoading: isAuthLoading } = useUser();
  const { userData, loading: isUserDataLoading, error: userDataError } = useUserData(user ?? null);
  
  const [input, setInput] = useState({ datatype: "Email", value: "" });
  const [selected, setSelected] = useState<string>("Paid");
  const [PaidSearch, setPaidSearch] = useState("Email");
  const [countryCode, setCountryCode] = useState("+91"); // Default country code
  const [countryCodeDigits, setCountryCodeDigits] = useState(10); // Default digits for phone validation
  const [emailError, setEmailError] = useState<string>(""); // State for email validation error
  const [query, setQuery] = useState("");
  const [phoneError, setPhoneError] = useState<string>(""); // State for phone validation
  const [typeofsearch, settypeofsearch] = useState<string>("Advance");
  const [miniCredits, setMiniCredits] = useState(0);
  const [creditsError, setCreditsError] = useState("");

  // Log any user data error
  useEffect(() => {
    if (userDataError) {
      console.error("User data fetch error:", userDataError);
    }
  }, [userDataError]);

  // Credits and search type effect
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

  // Restore input from localStorage
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
    <main 
      className="min-h-screen bg-background flex flex-col items-center justify-start overflow-y-auto"
      aria-label="Profile and Search Page"
    >
      <header 
        className="w-full flex justify-between py-4 px-6"
        aria-label="Page Navigation"
      >
        <nav className="flex justify-between w-full space-x-4">
          <button
            onClick={() => window.open("/TransactionHistory", "_blank")}
            className="group flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border text-foreground font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:bg-accent shadow-lg"
            aria-label="Open Transaction History"
          >
            <svg
              className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Transaction History</span>
          </button>

          <button
            onClick={() => window.open("/history", "_blank")}
            className="group flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border text-foreground font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:bg-accent shadow-lg"
            aria-label="Open Search History"
          >
            <svg
              className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Search History</span>
          </button>
        </nav>
      </header>

      <section 
        className="w-full max-w-6xl mx-auto px-4 py-8"
        aria-label="Search Configuration"
      >
        <div className="flex flex-col items-center space-y-8">
          {/* Search Type Selector */}
          <div className="w-full flex justify-center">
            <SearchTypeSelector 
              selected={selected} 
              setSelected={setSelected} 
              aria-label="Select Search Type"
            />
          </div>

          {/* Basic/Advance Selection */}
          {selected === "Paid" && (
            <div 
              className="w-full flex justify-center mb-6"
              role="radiogroup" 
              aria-label="Search Depth Selection"
            >
              <div className="relative bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-2 shadow-2xl">
                <div
                  className="absolute top-2 bottom-2 bg-gradient-to-r from-foreground to-muted-foreground rounded-xl shadow-lg transition-all duration-300 ease-out"
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
                      role="radio"
                      aria-checked={typeofsearch === type}
                      className={`
                        relative flex-1 py-4 px-8 mx-1 rounded-xl text-lg font-semibold
                        transition-all duration-300 ease-out
                        hover:scale-105 active:scale-95 min-w-[120px]
                        ${
                          typeofsearch === type
                            ? "text-background font-bold shadow-lg"
                            : "text-foreground hover:text-muted-foreground"
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
                            aria-hidden="true"
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
                            aria-hidden="true"
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

                      <div
                        className={`text-xs mt-1 ${
                          typeofsearch === type ? "text-muted-foreground" : "text-muted-foreground"
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
                selected={selected}
                Credits={userData.credits}
              />
            </div>
          )}

          {/* Paid Search Section */}
          {selected === "Paid" && (
            <div 
              className="w-full max-w-4xl mx-auto space-y-8"
              aria-label="Paid Search Configuration"
            >
              {/* Premium Search Bar Section */}
              <div className="flex flex-col items-center space-y-8">
                {/* Main Search Container */}
                <div className="w-full max-w-4xl relative z-10">
                  <div>
                    {/* Search bar container */}
                    <div 
                      className="flex flex-col bg-background border-2 border-border rounded-2xl shadow-2xl backdrop-blur-sm"
                      role="search"
                      aria-label="Search Input"
                    >
                      {/* Inner border glow */}
                      <div className="flex bg-gradient-to-r from-accent/5 via-accent/10 to-accent/5 rounded-2xl w-full h-full absolute pointer-events-none" style={{zIndex: 0}}></div>
                      <div className="flex items-center w-full relative z-50">
                        <div className="flex-shrink-0 px-6 py-2 text-muted-foreground flex items-center">
                          <SearchIcon size={28} strokeWidth={2} aria-hidden="true" />
                        </div>

                        {/* Country selector for phone */}
                        {PaidSearch === "Phone" && (
                          <div 
                            className="flex-shrink-0 relative z-100 border-r border-border pr-4 flex items-center"
                            role="region"
                            aria-label="Country Code Selection"
                          >
                            <CountrySelect
                              value={countryCode}
                              onChange={setCountryCode}
                              onDigitsChange={setCountryCodeDigits}
                              aria-label="Select Country Code"
                            />
                          </div>
                        )}

                        {/* Input field */}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex-1 flex items-center text-muted-foreground">
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
                                  className="bg-transparent border-none text-foreground text-2xl font-light placeholder:text-muted-foreground focus-visible:ring-0 px-6 py-8 w-full"
                                  disabled={userData.credits < miniCredits}
                                  aria-label={`Enter ${input.datatype} for search`}
                                  aria-invalid={!!(emailError || phoneError)}
                                  aria-describedby={emailError ? "email-error" : phoneError ? "phone-error" : undefined}
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-background text-foreground border border-border shadow-lg">
                              <p className="font-medium">Enter your search query</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {/* Clear button */}
                        {input.value && (
                          <button
                            onClick={() => setInput((prev) => ({ ...prev, value: "" }))}
                            className="flex-shrink-0 p-6 text-muted-foreground hover:text-foreground transition-all duration-200 hover:bg-accent rounded-lg mr-2 flex items-center"
                            aria-label="Clear search input"
                          >
                            <X size={24} strokeWidth={2} aria-hidden="true" />
                          </button>
                        )}

                        {/* Search button integrated */}
                        <div className="flex-shrink-0 p-2 flex items-center">
                          <Button
                            className="flex items-center relative overflow-hidden bg-foreground hover:bg-muted-foreground text-background font-bold px-8 py-6 text-lg rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg group border-0"
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
                              isAuthLoading ||
                              isUserDataLoading ||
                              !!emailError ||
                              !!phoneError ||
                              typeofsearch === "" ||
                              (PaidSearch === "Phone" && typeofsearch === "Basic") ||
                              userData.credits < miniCredits
                            }
                            aria-label="Perform Search"
                          >
                            {/* Button shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"></div>
                            <span className="relative flex items-center gap-2">
                              <Search size={20} strokeWidth={2.5} aria-hidden="true" />
                              Search
                            </span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Search type indicator */}
                  <div className="flex justify-center mt-4">
                    <span 
                      className="text-muted-foreground text-sm font-medium"
                      aria-live="polite"
                    >
                      {typeofsearch} Search • {PaidSearch} Lookup
                    </span>
                  </div>
                </div>

                {/* Error Messages */}
                {PaidSearch === "Email" && input.value && emailError && (
                  <div 
                    className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 backdrop-blur-sm flex justify-center"
                    role="alert"
                    id="email-error"
                  >
                    <p className="text-red-400 text-sm text-center">{emailError}</p>
                  </div>
                )}
                {PaidSearch === "Phone" && input.value && phoneError && (
                  <div 
                    className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 backdrop-blur-sm flex justify-center"
                    role="alert"
                    id="phone-error"
                  >
                    <p className="text-red-400 text-sm text-center">{phoneError}</p>
                  </div>
                )}
                {userData.credits < miniCredits && (
                  <div 
                    className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 backdrop-blur-sm flex justify-center"
                    role="alert"
                  >
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
                  aria-label="Search Type Options"
                />
              </div>

              {/* Demo Buttons */}
              <div 
                className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
                role="group"
                aria-label="Demo Search Options"
              >
                <button
                  className="group flex items-center relative bg-card/80 backdrop-blur-sm hover:bg-accent text-foreground font-medium px-8 py-4 rounded-xl transition-all duration-300 border border-border hover:border-border hover:scale-105 w-full sm:w-auto shadow-lg"
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
                  aria-label="Demo Advanced Search"
                >
                  <span className="flex items-center gap-2">
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
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
                  className="group flex items-center relative bg-card/80 backdrop-blur-sm hover:bg-accent text-foreground font-medium px-8 py-4 rounded-xl transition-all duration-300 border border-border hover:border-border hover:scale-105 w-full sm:w-auto shadow-lg"
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
                  aria-label="Demo Basic Search"
                >
                  <span className="flex items-center gap-2">
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
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
      </section>
    </main>
  );
}
