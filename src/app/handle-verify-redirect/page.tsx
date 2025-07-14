"use client";

import { Button } from "@/components/ui/button";
import { MailCheck } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function VerifyEmailContent() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border-2 border-black p-8 space-y-6">
        <div className="text-center">
          <MailCheck className="mx-auto text-black h-12 w-12" />
          <h1 className="text-2xl font-semibold mt-4 text-black">Verify Your Email</h1>
          <p className="text-sm text-black mt-2">
            We&apos;ve sent a verification link to your email.
            Please check your inbox and verify to continue.
          </p>
        </div>

          <div className="text-center">
            <p className="text-sm text-black mb-4">Already verified?</p>
            <Link href="/login">
              <Button variant="default" className="bg-black text-white hover:bg-white hover:text-black border-2 border-black">
                Try Logging In Again
              </Button>
            </Link>
          </div>    
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black px-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border-2 border-black p-8 space-y-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
              <h1 className="text-2xl font-semibold mt-4 text-black">Loading...</h1>
            </div>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
