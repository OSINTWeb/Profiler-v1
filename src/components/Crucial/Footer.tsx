"use client";
import React from "react";
import { Linkedin, MessageCircle, X, Youtube, Mail, MapPin } from "lucide-react";
import { useUser } from "@auth0/nextjs-auth0";

export const Footer = () => {
  const { user, isLoading } = useUser();
  const currentYear = new Date().getFullYear();

  const isAuthenticated = !!user;

  const handleLogin = () => {
    window.location.href = "/auth/login";
  };

  const handleLogout = () => {
    window.location.href = "/auth/logo  ut";
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
        <div className="max-w-6xl mx-auto p-8 lg:p-16 bg-gradient-to-b from-background to-card border border-border rounded-2xl shadow-2xl text-foreground">
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

            <p className="text-muted-foreground mb-6">
              We provide advanced digital intelligence tools for investigators, researchers, and
              security professionals.
            </p>

            <div className="space-y-4">
              <a
                href="mailto:hi@profiler.me"
                className="flex items-center text-muted-foreground hover:text-foreground transition-all group"
                target="_blank"
              >
                <Mail className="mr-3 h-5 w-5 group-hover:text-blue-400" />
                <span className="group-hover:translate-x-1 transition-transform">
                  hi@profiler.me
                </span>
              </a>

              <a
                href="https://api.whatsapp.com/send/?phone=919991256829&text&type=phone_number&app_absent=0"
                className="flex items-center text-muted-foreground hover:text-foreground transition-all group"
                target="_blank"
              >
                <MessageCircle className="mr-3 h-5 w-5 group-hover:text-blue-400" />
                <span className="group-hover:translate-x-1 transition-transform">
                  +919991256829
                </span>
              </a>

              <div className="flex items-center text-muted-foreground">
                <MapPin className="mr-3 h-5 w-5 text-muted-foreground" />
                <span>New Delhi, India</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="flex flex-col">
            <h3 className="text-xl font-bold mb-6 text-foreground relative">
              <span className="h-1 w-10 absolute -bottom-2 left-0"></span>
              Explore
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://profiler.me/demo"
                  className="text-muted-foreground hover:text-foreground transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Demo
                </a>
              </li>
              <li>
                <a
                  href="https://profiler.me/blog"
                  className="text-muted-foreground hover:text-foreground transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Blogs
                </a>
              </li>
              <li>
                <a
                  href="https://profiler.me/features"
                  className="text-muted-foreground hover:text-foreground transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="https://profiler.me/pricing"
                  className="text-muted-foreground hover:text-foreground transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col">
            <h3 className="text-xl font-bold mb-6 text-foreground relative">
              <span className="h-1 w-10 absolute -bottom-2 left-0"></span>
              Try Now
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://profiler.me/free"
                  className="text-muted-foreground hover:text-foreground transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Free Tools
                </a>
              </li>
              <li>
                <a
                  href="https://profiler.me/freemium"
                  className="text-muted-foreground hover:text-foreground transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Freemium Tools
                </a>
              </li>
              <li>
                <a
                  href="https://profiler.me/paid"
                  className="text-muted-foreground hover:text-foreground transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Paid Tools
                </a>
              </li>
              <li>
                <a
                  href="https://profiler.me/emailtool"
                  className="text-muted-foreground hover:text-foreground transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Email Tools
                </a>
              </li>
              <li>
                <a
                  href="https://profiler.me/phonetool"
                  className="text-muted-foreground hover:text-foreground transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Phone Tools
                </a>
              </li>
              <li>
                <a
                  href="https://profiler.me/usernametool"
                  className="text-muted-foreground hover:text-foreground transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Username Tools
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@profiler.me"
                  className="text-muted-foreground hover:text-foreground transition-all hover:translate-x-1 inline-block"
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
            <h3 className="text-xl font-bold mb-6 text-foreground relative">
              <span className="h-1 w-10 absolute -bottom-2 left-0"></span>
              Company
            </h3>
            <ul className="space-y-3 mb-8">
              <li>
                <a
                  href="https://profiler.me/about"
                  className="text-muted-foreground hover:text-foreground transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  About Us
                </a>
              </li>

              <li>
                <a
                  href="https://profiler.me/contact"
                  className="text-muted-foreground hover:text-foreground transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="mailto:hi@profiler.me"
                  className="text-muted-foreground hover:text-foreground transition-all hover:translate-x-1 inline-block"
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
                <h3 className="text-xl font-bold mb-4 text-foreground">Account</h3>
                <div className="space-y-3">
                  {isAuthenticated && user ? (
                    <>
                      <div className="text-muted-foreground text-sm mb-3">
                        Welcome, {user.name || user.nickname || user.given_name || "User"}!
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={toDashboard}
                          className="text-left text-muted-foreground hover:text-foreground transition-all hover:translate-x-1 inline-block"
                        >
                          Dashboard
                        </button>
                        <button
                          onClick={toProfile}
                          className="text-left text-muted-foreground hover:text-foreground transition-all hover:translate-x-1 inline-block"
                        >
                          Profile
                        </button>
                        <div className="text-muted-foreground text-sm">
                          Credits: ${user?.credits?.toFixed(2)}
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

            <h3 className="text-xl font-bold mb-4 text-foreground">Connect With Us</h3>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.linkedin.com/company/osintambition/?originalSubdomain=in"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-muted to-card p-2.5 rounded-lg hover:scale-110 transition-all border border-border hover:border-border shadow-lg"
              >
                <Linkedin size={25} className="text-foreground font-bold " />
              </a>
              <a
                href="https://x.com/osintambition"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-muted to-card p-2.5 rounded-lg hover:scale-110 transition-all border border-border hover:border-border shadow-lg"
              >
                <X size={25} className="text-foreground font-bold " />
              </a>
              <a
                href="https://www.youtube.com/channel/UCxi_L9SyoUdtbKd8OrG0V7w"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-muted to-card p-2.5 rounded-lg hover:scale-110 transition-all border border-border hover:border-border shadow-lg"
              >
                <Youtube size={25} className="text-foreground font-bold " />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-muted-foreground text-sm text-center md:text-left">
              © {currentYear} Made with 🤍 by OSINTAmbition.
            </div>
            {/* Quick Auth Actions in Bottom Footer */}
            {!isLoading && (
              <div className="flex items-center gap-4">
                {isAuthenticated && user ? (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">{user.name || user.nickname || "User"}</span>
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
