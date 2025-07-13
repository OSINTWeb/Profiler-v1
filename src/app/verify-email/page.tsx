"use client";
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MailCheck, MailX } from 'lucide-react';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const reason = searchParams.get('reason');

  const suspicious = reason === 'suspicious';

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="relative w-full max-w-md bg-zinc-900 rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.1)] p-8 space-y-6 border border-zinc-800">
        <div className="text-center">
          {suspicious ? (
            <>
              <div className="relative">
                <div className="absolute -inset-1 bg-white/20 blur-sm rounded-full"></div>
                <MailX className="relative mx-auto text-white h-12 w-12" />
              </div>
              <h1 className="text-2xl font-semibold mt-6 text-white">Invalid Email Address</h1>
              <p className="text-sm text-zinc-400 mt-3">
                The email you provided appears to be invalid or randomly generated. Please contact support to update your email.
              </p>
            </>
          ) : (
            <>
              <div className="relative">
                <div className="absolute -inset-1 bg-white/20 blur-sm rounded-full"></div>
                <MailCheck className="relative mx-auto text-white h-12 w-12" />
              </div>
              <h1 className="text-2xl font-semibold mt-6 text-white">Verify Your Email</h1>
              <p className="text-sm text-zinc-400 mt-3">
                We&apos;ve sent a verification link to <span className="font-medium text-white">{email}</span>. Please check your inbox and verify to continue.
              </p>
            </>
          )}
        </div>

        {!suspicious && (
          <div className="text-center mt-8">
            <p className="text-sm text-zinc-500 mb-4">Already verified?</p>
            <Link href="/auth/login" className="block">
              <Button variant="outline" className="w-full bg-transparent border-zinc-700 text-white hover:bg-white hover:text-black transition-all duration-300">
                Try Logging In Again
              </Button>
            </Link>
          </div>
        )}

        {suspicious && (
          <Alert variant="destructive" className="bg-zinc-800 border-zinc-700 text-white">
            <AlertTitle>Need help?</AlertTitle>
            <AlertDescription>
              Contact us at <a href="mailto:support@profiler.me" className="underline hover:text-zinc-300 transition-colors">support@profiler.me</a> to update your email address.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}