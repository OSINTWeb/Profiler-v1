"use client";
import React, { useState, useEffect } from "react";
import { Linkedin, MessageCircle, X, Youtube, Mail, MapPin } from "lucide-react";
import { useUser } from "@auth0/nextjs-auth0";

export const Footer = () => {
  const [UserCredits, setUserCredits] = useState(0);
  const { user, isLoading } = useUser();
  const currentYear = new Date().getFullYear();
  const Api_url = process.env.NEXT_PUBLIC_AUTH_BACKEND;

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
        } catch (error) {
          console.error("Error creating user:", error);
        }
      })();
    }
  }, [user, Api_url]);

  const isAuthenticated = !!user;

  const handleLogin = () => {
    window.location.href = "/auth/login";
  };

  const handleLogout = () => {
    window.location.href = "/auth/logout";
  };

  const toProfile = () => {
    window.location.href = "/profile";
  };

  const toDashboard = () => {
    window.location.href = "/dashboard";
  };

      return (
      <footer className="w-full flex justify-center items-center min-h-screen py-8">
        {/* Centered Footer Container */}
        <div className="max-w-6xl mx-auto p-8 lg:p-16 bg-gradient-to-b from-black to-zinc-900 border border-white/20 rounded-2xl shadow-2xl text-white">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo and Contact Section */}
          <div className="flex flex-col space-y-6">
            <div className="flex items-center mb-6">
              <a
                href="https://profiler.me"
                className="flex items-center group"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/8b7be49b2687943ef40ce83de105e4f9918e4f114fe8607fd737b4484c1182e4?placeholderIfAbsent=true"
                  className="object-contain w-[140px] lg:w-[175px] transition-transform duration-500 group-hover:scale-105"
                  alt="Logo"
                />
              </a>
            </div>

            <p className="text-gray-300 mb-6">
              We provide advanced digital intelligence tools for investigators, researchers, and
              security professionals.
            </p>

            <div className="space-y-4">
              <a
                href="mailto:hi@profiler.me"
                className="flex items-center text-gray-300 hover:text-white transition-all group"
                target="_blank"
              >
                <Mail className="mr-3 h-5 w-5 group-hover:text-blue-400" />
                <span className="group-hover:translate-x-1 transition-transform">
                  hi@profiler.me
                </span>
              </a>

              <a
                href="https://api.whatsapp.com/send/?phone=919991256829&text&type=phone_number&app_absent=0"
                className="flex items-center text-gray-300 hover:text-white transition-all group"
                target="_blank"
              >
                <MessageCircle className="mr-3 h-5 w-5 group-hover:text-blue-400" />
                <span className="group-hover:translate-x-1 transition-transform">
                  +919991256829
                </span>
              </a>

              <div className="flex items-center text-gray-300">
                <MapPin className="mr-3 h-5 w-5 text-gray-400" />
                <span>New Delhi, India</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="flex flex-col">
            <h3 className="text-xl font-bold mb-6 text-white relative">
              <span className="h-1 w-10 absolute -bottom-2 left-0"></span>
              Explore
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://profiler.me/demo"
                  className="text-gray-300 hover:text-white transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Demo
                </a>
              </li>
              <li>
                <a
                  href="https://profiler.me/blog"
                  className="text-gray-300 hover:text-white transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Blogs
                </a>
              </li>
              <li>
                <a
                  href="https://profiler.me/features"
                  className="text-gray-300 hover:text-white transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="https://profiler.me/pricing"
                  className="text-gray-300 hover:text-white transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col">
            <h3 className="text-xl font-bold mb-6 text-white relative">
              <span className="h-1 w-10 absolute -bottom-2 left-0"></span>
              Try Now
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://profiler.me/free"
                  className="text-gray-300 hover:text-white transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Free Tools
                </a>
              </li>
              <li>
                <a
                  href="https://profiler.me/freemium"
                  className="text-gray-300 hover:text-white transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Freemium Tools
                </a>
              </li>
              <li>
                <a
                  href="https://profiler.me/paid"
                  className="text-gray-300 hover:text-white transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Paid Tools
                </a>
              </li>
              <li>
                <a
                  href="https://profiler.me/emailtool"
                  className="text-gray-300 hover:text-white transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Email Tools
                </a>
              </li>
              <li>
                <a
                  href="https://profiler.me/phonetool"
                  className="text-gray-300 hover:text-white transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Phone Tools
                </a>
              </li>
              <li>
                <a
                  href="https://profiler.me/usernametool"
                  className="text-gray-300 hover:text-white transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Username Tools
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@profiler.me"
                  className="text-gray-300 hover:text-white transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Report an Error
                </a>
              </li>
            </ul>
          </div>

          {/* Company & Social + Authentication */}
          <div className="flex flex-col">
            <h3 className="text-xl font-bold mb-6 text-white relative">
              <span className="h-1 w-10 absolute -bottom-2 left-0"></span>
              Company
            </h3>
            <ul className="space-y-3 mb-8">
              <li>
                <a
                  href="https://profiler.me/about"
                  className="text-gray-300 hover:text-white transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  About Us
                </a>
              </li>

              <li>
                <a
                  href="https://profiler.me/contact"
                  className="text-gray-300 hover:text-white transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="mailto:hi@profiler.me"
                  className="text-gray-300 hover:text-white transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join Us
                </a>
              </li>
            </ul>

            {/* Authentication Section */}
            {!isLoading && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 text-white">Account</h3>
                <div className="space-y-3">
                  {isAuthenticated && user ? (
                    <>
                      <div className="text-gray-300 text-sm mb-3">
                        Welcome, {user.name || user.nickname || user.given_name || "User"}!
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={toDashboard}
                          className="text-left text-gray-300 hover:text-white transition-all hover:translate-x-1 inline-block"
                        >
                          Dashboard
                        </button>
                        <button
                          onClick={toProfile}
                          className="text-left text-gray-300 hover:text-white transition-all hover:translate-x-1 inline-block"
                        >
                          Profile
                        </button>
                        <div className="text-gray-400 text-sm">
                          Credits: ${UserCredits.toFixed(2)}
                        </div>
                        <button
                          onClick={handleLogout}
                          className="text-left text-red-400 hover:text-red-300 transition-all hover:translate-x-1 inline-block"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={handleLogin}
                      className="text-left text-blue-400 hover:text-blue-300 transition-all hover:translate-x-1 inline-block"
                    >
                      Login / Sign Up
                    </button>
                  )}
                </div>
              </div>
            )}

            <h3 className="text-xl font-bold mb-4 text-white">Connect With Us</h3>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.linkedin.com/company/osintambition/?originalSubdomain=in"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-2.5 rounded-lg hover:scale-110 transition-all border border-zinc-700/30 hover:border-zinc-600/50 shadow-lg"
              >
                <Linkedin size={25} className="text-white font-bold " />
              </a>
              <a
                href="https://x.com/osintambition"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-2.5 rounded-lg hover:scale-110 transition-all border border-zinc-700/30 hover:border-zinc-600/50 shadow-lg"
              >
                <X size={25} className="text-white font-bold " />
              </a>
              <a
                href="https://www.youtube.com/channel/UCxi_L9SyoUdtbKd8OrG0V7w"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-2.5 rounded-lg hover:scale-110 transition-all border border-zinc-700/30 hover:border-zinc-600/50 shadow-lg"
              >
                <Youtube size={25} className="text-white font-bold " />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-zinc-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Made with 🤍 by OSINTAmbition.
            </div>
            {/* Quick Auth Actions in Bottom Footer */}
            {!isLoading && (
              <div className="flex items-center gap-4">
                {isAuthenticated && user ? (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-400">{user.name || user.nickname || "User"}</span>
                    <button
                      onClick={handleLogout}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                  >
                    Login
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
