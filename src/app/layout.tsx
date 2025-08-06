import "./globals.css";
import { Header } from "@/components/Crucial/Header";
import { Footer } from "@/components/Crucial/Footer";

// Declare Rewardful types
// Move metadata to a separate file since we need client component
const metadata = {
  title: "Profiler.me" as const,
  description:
    "Profiler.me is a platform for searching and finding information about people." as const,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Main */}
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body className="bg-background text-foreground">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
