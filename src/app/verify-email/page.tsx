"use client";
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MailCheck, MailX, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { useState, useEffect, useRef } from 'react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email');
  const reason = searchParams.get('reason');
  const token = searchParams.get('token');
  
  const [verificationState, setVerificationState] = useState<'loading' | 'success' | 'error' | 'suspicious'>('loading');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const verificationAttempted = useRef(false);

  useEffect(() => {
    const verifyEmail = async () => {
      // Prevent multiple verification attempts
      if (verificationAttempted.current) {
        return;
      }
      verificationAttempted.current = true;

      if (!email || !token) {
        setVerificationState('error');
        return;
      }

      if (reason === 'suspicious') {
        setVerificationState('suspicious');
        return;
      }

      try {
        // If there's a token, attempt to verify
        if (token) {
          // Here you would typically make an API call to verify the token
          // For now, we'll simulate success after a brief delay
          await new Promise(resolve => setTimeout(resolve, 1500));
          setVerificationState('success');
          
          // After successful verification, redirect to login after 3 seconds
          const redirectTimeout = setTimeout(() => {
            setIsRedirecting(true);
            router.push('/auth/login');
          }, 3000);

          // Cleanup timeout on unmount
          return () => clearTimeout(redirectTimeout);
        }
      } catch (err) {
        console.error('Email verification failed:', err);
        setVerificationState('error');
      }
    };

    verifyEmail();
  }, [email, token, reason]); // Remove router from dependencies

  if (verificationState === 'loading') {
    return (
      <div className="relative w-full max-w-md bg-zinc-900 rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.1)] p-8 space-y-6 border border-zinc-800">
        <div className="text-center">
          <div className="relative">
            <div className="absolute -inset-1 bg-white/20 blur-sm rounded-full"></div>
            <Loader2 className="relative mx-auto text-white h-12 w-12 animate-spin" />
          </div>
          <h1 className="text-2xl font-semibold mt-6 text-white">Verifying Email</h1>
          <p className="text-sm text-zinc-400 mt-3">
            Please wait while we verify your email address...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md bg-zinc-900 rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.1)] p-8 space-y-6 border border-zinc-800">
      <div className="text-center">
        {verificationState === 'suspicious' ? (
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
        ) : verificationState === 'success' ? (
          <>
            <div className="relative">
              <div className="absolute -inset-1 bg-white/20 blur-sm rounded-full"></div>
              <MailCheck className="relative mx-auto text-white h-12 w-12" />
            </div>
            <h1 className="text-2xl font-semibold mt-6 text-white">Email Verified!</h1>
            <p className="text-sm text-zinc-400 mt-3">
              {isRedirecting ? (
                "Redirecting you to login..."
              ) : (
                "Your email has been successfully verified. You'll be redirected to login shortly."
              )}
            </p>
          </>
        ) : (
          <>
            <div className="relative">
              <div className="absolute -inset-1 bg-white/20 blur-sm rounded-full"></div>
              <MailX className="relative mx-auto text-white h-12 w-12" />
            </div>
            <h1 className="text-2xl font-semibold mt-6 text-white">Verification Failed</h1>
            <p className="text-sm text-zinc-400 mt-3">
              We couldn&apos;t verify your email address. The verification link might be expired or invalid.
            </p>
          </>
        )}
      </div>

      {verificationState === 'error' && (
        <div className="text-center mt-8">
          <Link href="/auth/login" className="block">
            <Button variant="outline" className="w-full bg-transparent border-zinc-700 text-white hover:bg-white hover:text-black transition-all duration-300">
              Return to Login
            </Button>
          </Link>
        </div>
      )}

      {verificationState === 'suspicious' && (
        <Alert variant="destructive" className="bg-zinc-800 border-zinc-700 text-white">
          <AlertTitle>Need help?</AlertTitle>
          <AlertDescription>
            Contact us at <a href="mailto:support@profiler.me" className="underline hover:text-zinc-300 transition-colors">support@profiler.me</a> to update your email address.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <Suspense fallback={
        <div className="w-full max-w-md p-8 space-y-6 text-center">
          <div className="animate-pulse">
            <div className="h-12 w-12 bg-zinc-800 rounded-full mx-auto"></div>
            <div className="h-6 bg-zinc-800 rounded mt-6 w-3/4 mx-auto"></div>
            <div className="h-4 bg-zinc-800 rounded mt-3 w-full"></div>
          </div>
        </div>
      }>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}