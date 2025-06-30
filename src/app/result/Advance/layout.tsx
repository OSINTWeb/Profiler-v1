import React from "react";
export const metadata = {
  title: "Advanced Search Results",
  description: "View detailed results and analytics for your advanced search.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      {children}
    </div>
  );
}
