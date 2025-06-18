import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Crucial/Header";
import { Footer } from "@/components/Crucial/Footer";

export const metadata: Metadata = {
  title: "My Auth0 App",
  description: "Next.js app with Auth0 authentication",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <Header />

        {children}

        <Footer />
      </body>
    </html>
  );
}
