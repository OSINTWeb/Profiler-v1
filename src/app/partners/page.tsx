"use client";
import { useUser } from "@auth0/nextjs-auth0";
import React, { useEffect } from "react";

const PartnersPage = () => {
  const { user, isLoading } = useUser();

  useEffect(() => {
    const refgrow = window.Refgrow as unknown as { reset?: () => void; init?: () => void };
    if (refgrow?.reset) {
      refgrow.reset(); // clear old render
    }
    if (refgrow?.init) {
      refgrow.init(); // render the widget
    }
  }, []);

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
      <h2 className="text-2xl font-bold mb-4">Affiliate Dashboard</h2>

      <div
        id="refgrow"
        data-project-id="252"
        {...(user && { 'data-project-email': user.email })}
      ></div>
    </div>
  );
};

export default PartnersPage;
 