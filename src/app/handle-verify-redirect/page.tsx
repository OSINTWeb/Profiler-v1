"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HandleVerifyRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/verify-email");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border-2 border-blue-600 p-8 space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <h1 className="text-2xl font-semibold mt-4 text-blue-600">Loading...</h1>
        </div>
      </div>
    </div>
  );
}
