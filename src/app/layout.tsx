"use client";

import "./globals.css";
import { Header } from "@/components/Crucial/Header";
import { Footer } from "@/components/Crucial/Footer";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0";

// Declare Rewardful types
declare global {
  interface Window {
    rewardful: (method: 'ready' | 'convert' | 'source', callback?: () => void) => void;
    Rewardful?: {
      referral: string;
    };
  }
}

// Move metadata to a separate file since we need client component
const metadata = {
  title: "Profiler.me" as const,
  description: "Profiler.me is a platform for searching and finding information about people." as const,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSharedPage = pathname.startsWith("/sharedpage");
  const { user, isLoading } = useUser();

  // Handle auth redirect
  useEffect(() => {
    if (!isLoading && !isSharedPage && !user) {
      window.location.href = "/auth/login";
    }
  }, [isSharedPage, user, isLoading]);

  // Handle Rewardful tracking
  useEffect(() => {
    // Initialize Rewardful tracking
    window.rewardful('ready', function() {
      if (window.Rewardful?.referral) {
        console.log('Current referral ID: ', window.Rewardful.referral);
        // You can store the referral ID in localStorage or state if needed
      } else {
        console.log('No referral present.');
      }
    });
  }, []); // Empty dependency array since we only want this to run once
  
  return (
    <html lang="en">
      <head>
        {/* Rewardful initialization */}
        <script dangerouslySetInnerHTML={{ 
          __html: `(function(w,r){w._rwq=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}})(window,'rewardful');`
        }} />
        <script async src="https://r.wdfl.co/rw.js" data-rewardful="YOUR-API-KEY"></script>
        
        {/* Main */}
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
