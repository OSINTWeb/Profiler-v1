"use client";
import React, { useState, useEffect } from "react";
import "@/app/globals.css";
import { Menu, X } from "lucide-react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useUser } from "@auth0/nextjs-auth0";

export const Header = () => {
  const [UserCredits, setUserCredits] = useState(0);
  const { user, isLoading, error } = useUser();
  const Api_url = process.env.NEXT_PUBLIC_AUTH_BACKEND;
  // console.log(Api_url,user?.email);
  // Fetch user credits when user is available
  useEffect(() => {
    if (user?.email) {
      (async () => {
        try {
          const response = await fetch(`${Api_url}/api/auth/signup`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: user.name || user.nickname || "User",
              email: user.email,
              authMethod: "Google",
              pfpURL: user.picture || "",
              country: "India",
            }),
          });
          if (!response.ok) {
            throw new Error("Failed to create user");
          }

          const data = await response.json();
          setUserCredits(data.data?.user?.credits || 0);
          console.log("User credits:", data.data?.user?.credits);
        } catch (error) {
          console.error("Error creating user:", error);
        }
      })();
    }
  }, [user, Api_url]);

  // Fetch from offer backend
  useEffect(() => {
    const offerURL = process.env.NEXT_PUBLIC_OFFER_BACKEND;
    if (user?.email) {
      (async () => {
        try {
          const response = await fetch(`${offerURL}/api/auth/signup`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: user.name || user.nickname || "User",
              email: user.email,
              authMethod: "Google",
              pfpURL: user.picture || "",
              country: "India",
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to create user");
          }

          const data = await response.json();
          console.log("Offer backend user created:", data);
        } catch (error) {
          console.error("Error with offer backend:", error);
        }
      })();
    }
  }, [user]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toProfile = () => {
    window.location.href = `/profile`;
  };

  const PricingPage = () => {
    window.open("/Pricing", "_blank");
  };

  const handleLogin = () => {
    window.location.href = "/auth/login";
  };
  // Show loading state
  if (isLoading) {
    return (
      <div className="main flex justify-center p-2 sm:p-4 md:p-5 w-full">
        <header className="bg-black border border-white/10 rounded-xl w-full max-w-7xl px-3 sm:px-4 md:px-6 lg:px-10 py-2 sm:py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/8b7be49b2687943ef40ce83de105e4f9918e4f114fe8607fd737b4484c1182e4?placeholderIfAbsent=true"
                className="object-contain w-[130px] sm:w-[120px] md:w-[140px] lg:w-[155px]"
                alt="Logo"
              />
            </div>
            <div className="text-white">Loading...</div>
          </div>
        </header>
      </div>
    );
  }

  // Show error state
  if (error) {
    console.error("Header auth error:", error);
  }

  const isAuthenticated = !!user;

  return (
    <div className="main flex justify-center p-2 sm:p-4 md:p-5 w-full ">
      <header className="bg-black border border-white/10 rounded-xl w-full max-w-7xl px-3 sm:px-4 md:px-6 lg:px-10 py-2 sm:py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a
            href="https://profiler.me"
            className="flex items-center group"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/8b7be49b2687943ef40ce83de105e4f9918e4f114fe8607fd737b4484c1182e4?placeholderIfAbsent=true"
              className="object-contain w-[130px] sm:w-[120px] md:w-[140px] lg:w-[155px] transition-transform duration-500 group-hover:scale-105"
              alt="Logo"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex justify-center items-center gap-1 lg:gap-3">
            <a
              href="https://search.profiler.me/"
              className="px-2 sm:px-3 md:px-4 lg:px-5 py-2 md:py-3 rounded-xl  text-white text-xs sm:text-sm md:text-base font-medium btn-hover-effect"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="text-roll-container text-center">
                <div className="text-roll">
                  <span className="text-roll-item">Home</span>
                  <span className="text-roll-item">Home</span>
                </div>
              </div>
            </a>
            <a
              onClick={PricingPage}
              className="px-2 cursor-pointer sm:px-3 md:px-4 lg:px-5 py-2 md:py-3 text-[#92969F] text-xs sm:text-sm md:text-base font-medium btn-hover-effect"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="text-roll-container">
                <div className="text-roll">
                  <span className="text-roll-item">Pricing</span>
                  <span className="text-roll-item">Pricing</span>
                </div>
              </div>
            </a>
            <a
              href="https://profiler.me/blog"
              className="px-2 sm:px-3 md:px-4 lg:px-5 py-2 md:py-3 text-[#92969F] text-xs sm:text-sm md:text-base font-medium btn-hover-effect"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="text-roll-container">
                <div className="text-roll">
                  <span className="text-roll-item">Blog</span>
                  <span className="text-roll-item">Blog</span>
                </div>
              </div>
            </a>

            {/* More Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-3 sm:px-4 py-2 md:py-2.5 rounded-xl text-[#92969F] hover:text-white text-sm sm:text-base font-medium transition-all duration-200 group-hover:bg-white/5">
                More
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <div className="absolute pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 w-48 z-50">
                <div className="bg-gradient-to-br from-slate-950 to-black border border-white/10 rounded-xl shadow-lg overflow-hidden">
                  <a
                    href="https://profiler.me/about"
                    className="flex items-center px-4 py-3 text-sm font-medium text-white/90 hover:text-white hover:bg-white/5 transition-all border-b border-white/5"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      className="w-4 h-4 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    About Us
                  </a>
                  <a
                    href="https://profiler.me/contact"
                    className="flex items-center px-4 py-3 text-sm font-medium text-white/90 hover:text-white hover:bg-white/5 transition-all border-b border-white/5"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      className="w-4 h-4 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                      />
                    </svg>
                    Contact
                  </a>
                  <a
                    href="https://www.osintupdates.com/"
                    className="flex items-center px-4 py-3 text-sm font-medium text-white/90 hover:text-white hover:bg-white/5 transition-all border-b border-white/5"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      className="w-4 h-4 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Newsletter
                  </a>
                  <a
                    href="https://profiler.me/waitlist"
                    className="flex items-center px-4 py-3 text-sm font-medium text-white/90 hover:text-white hover:bg-white/5 transition-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      className="w-4 h-4 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Waitlist
                  </a>
                </div>
              </div>
            </div>
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            {/* Show user info and actions when authenticated */}
            {isAuthenticated && user && (
              <>
                <button
                  onClick={PricingPage}
                  className="px-3 sm:px-4 md:px-5 lg:px-6 py-2 md:py-3 text-xs sm:text-sm md:text-base font-medium rounded-xl bg-stone-300 text-black btn-hover-effect cursor-pointer"
                >
                  <div className="text-roll-container">
                    <div className="text-roll">
                      <span className="text-roll-item">{UserCredits.toFixed(2)}$</span>
                      <span className="text-roll-item">{UserCredits.toFixed(2)}$</span>
                      <span className="text-roll-item">{UserCredits.toFixed(2)}$</span>
                    </div>
                  </div>
                </button>
                <button
                  onClick={toProfile}
                  className="px-3 sm:px-4 md:px-5 lg:px-6 py-2 md:py-3 text-xs sm:text-sm md:text-base font-medium rounded-xl bg-stone-300 text-black btn-hover-effect cursor-pointer"
                >
                  <div className="text-roll-container">
                    <div className="text-roll">
                      <span className="text-roll-item">Account</span>
                      <span className="text-roll-item">Account</span>
                      <span className="text-roll-item">Account</span>
                    </div>
                  </div>
                </button>
              </>
            )}
            {/* Show login button when not authenticated */}
            {!isAuthenticated && (
              <button
                onClick={handleLogin}
                className="px-3 sm:px-4 md:px-5 lg:px-6 py-2 md:py-3 text-xs sm:text-sm md:text-base font-medium rounded-xl bg-stone-300 text-black btn-hover-effect cursor-pointer "
              >
                <div className="text-roll-container">
                  <div className="text-roll">
                    <span className="text-roll-item">Login</span>
                    <span className="text-roll-item">Login</span>
                    <span className="text-roll-item">Login</span>
                  </div>
                </div>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white btn-hover-effect rounded-full p-1  text-xl"
            onClick={toggleMenu}
          >
            {menuOpen ? (
              <X size={24} className="size-10" />
            ) : (
              <Menu size={24} className="size-10" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            <div className="flex flex-col gap-2">
              <a
                href="https://search.profiler.me/"
                className="px-4 py-3 rounded-lg text-white text-base font-medium  transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </a>
              <button
                onClick={() => {
                  PricingPage();
                  setMenuOpen(false);
                }}
                className="px-4 py-3 rounded-lg text-[#92969F] text-base font-medium  transition-colors text-left"
              >
                Pricing
              </button>
              <a
                href="https://profiler.me/blog"
                className="px-4 py-3 rounded-lg text-[#92969F] text-base font-medium  transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
              >
                Blog
              </a>

              {/* More Dropdown */}
              <div className="px-4 py-3 rounded-lg text-[#92969F] text-base font-medium transition-colors">
                <button
                  className="flex justify-between items-center w-full"
                  onClick={() => setShowMobileDropdown(!showMobileDropdown)}
                >
                  <span>More</span>
                  {showMobileDropdown ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {showMobileDropdown && (
                  <div className="mt-2 ml-2 space-y-2">
                    <a
                      href="https://profiler.me/about"
                      className="block px-2 py-2 rounded-lg hover:bg-white/10 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        setMenuOpen(false);
                        setShowMobileDropdown(false);
                      }}
                    >
                      About Us
                    </a>
                    <a
                      href="https://profiler.me/contact"
                      className="block px-2 py-2 rounded-lg hover:bg-white/10 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        setMenuOpen(false);
                        setShowMobileDropdown(false);
                      }}
                    >
                      Contact
                    </a>
                    <a
                      href="https://www.osintupdates.com/"
                      className="block px-2 py-2 rounded-lg hover:bg-white/10 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        setMenuOpen(false);
                        setShowMobileDropdown(false);
                      }}
                    >
                      Newsletter
                    </a>
                    <a
                      href="https://profiler.me/Waitlist"
                      className="block px-2 py-2 rounded-lg hover:bg-white/10 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        setMenuOpen(false);
                        setShowMobileDropdown(false);
                      }}
                    >
                      Waitlist
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Authentication Section */}
            <div className="flex flex-col gap-2 mt-4 text-lg border-t border-white/10 pt-4">
              {isAuthenticated && user && (
                <>
                  <div className="px-4 py-2 text-white text-sm">
                    Welcome, {user.name || user.nickname || user.given_name || "User"}!
                  </div>
                  <button
                    onClick={() => {
                      PricingPage();
                      setMenuOpen(false);
                    }}
                    className="px-4 py-3 rounded-lg bg-stone-300 text-black font-medium text-center"
                  >
                    Credits: {UserCredits.toFixed(2)}$
                  </button>
                  <button
                    onClick={() => {
                      toProfile();
                      setMenuOpen(false);
                    }}
                    className="px-4 py-3 rounded-lg bg-stone-300 text-black font-medium text-center "
                  >
                    Account
                  </button>
                 
                </>
              )}
              {!isAuthenticated && (
                <button
                  onClick={() => {
                    handleLogin();
                    setMenuOpen(false);
                  }}
                  className="px-4 py-3 rounded-lg bg-stone-300 text-black font-medium text-center"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </div>
  );
};
