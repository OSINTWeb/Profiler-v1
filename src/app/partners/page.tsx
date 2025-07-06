"use client";
import { useUser } from "@auth0/nextjs-auth0";
import React, { useEffect } from "react";

const PartnersPage = () => {
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!user) return;
    const script = document.createElement("script");
    script.src = "https://refgrow.com/embed.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [user]);

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
        <h2 className="text-2xl font-bold mb-4">Affiliate Dashboard</h2>
        <p className="mb-4">You must be logged in to access the affiliate dashboard.</p>
        <a
          href="/api/auth/login"
          className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-700 transition"
        >
          Log In
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
      <h2 className="text-2xl font-bold mb-4">Affiliate Dashboard</h2>
      <div
        id="refgrow"
        data-project-id="252"
        data-project-email={user.email}
        data-lang="en"
        style={{ width: "100%", minHeight: "600px" }}
      ></div>
    </div>
  );
};

export default PartnersPage;
