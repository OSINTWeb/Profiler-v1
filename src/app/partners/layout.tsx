"use client";
import React, { useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0";
export default function PartnersLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  useEffect(() => {
    function tryInit() {
      if (window.Refgrow && window.Refgrow.init) {
        window.Refgrow.reset?.();
        window.Refgrow.init();
      } else {
        setTimeout(tryInit, 100); // Try again in 100ms
      }
    }
    tryInit();
  }, [user]);
  return <section className="min-h-screen bg-black text-white">{children}</section>;
}
