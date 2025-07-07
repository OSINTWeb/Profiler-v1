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
    rewardful: (method: "ready" | "convert" | "source", callback?: () => void) => void;
    Rewardful?: {
      referral: string;
    };
    RefgrowNoAutoInit?: boolean;
  }
}

// Move metadata to a separate file since we need client component
const metadata = {
  title: "Profiler.me" as const,
  description:
    "Profiler.me is a platform for searching and finding information about people." as const,
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
  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )refgrow_ref_code=([^;]*)/);
    window.RefgrowNoAutoInit = true;
    if (match) {
      console.log("refgrow_ref_code:", decodeURIComponent(match[1]));
    } else {
      console.log("refgrow_ref_code cookie not set");
    }
  }, []);

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

  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: "window.RefgrowNoAutoInit = true;" }} />
        <script src="https://refgrow.com/tracking.js" data-project-id="252" async defer></script>
        <script src="https://refgrow.com/js/page.js" async defer></script>

        {/* Main */}
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body className="bg-black text-white">
        <Header />
        <a href="/partners" className="px-4 py-2 hover:underline">
          Partners
        </a>
        {children}
        <Footer />
      </body>
    </html>
  );
}
