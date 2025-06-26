"use client";

import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Crucial/Header";
import { Footer } from "@/components/Crucial/Footer";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0";

// Move metadata to a separate file since we need client component
const metadata: Metadata = {
  title: "Profiler.me",
  description: "Profiler.me is a platform for searching and finding information about people.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSharedPage = pathname.startsWith("/sharedpage");
  const { user, isLoading } = useUser();

  useEffect(() => {
    // Only redirect after user loading is complete to avoid infinite loop
    if (!isLoading && !isSharedPage && !user) {
      window.location.href = "/auth/login";
    }
  }, [isSharedPage, user, isLoading]);
  
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body className="bg-black text-white">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
