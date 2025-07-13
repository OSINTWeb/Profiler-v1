'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MailCheck, MailX } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const reason = searchParams.get('reason');

  const suspicious = reason === 'suspicious';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          {suspicious ? (
            <>
              <MailX className="mx-auto text-red-500 h-12 w-12" />
              <h1 className="text-2xl font-semibold mt-4">Invalid Email Address</h1>
              <p className="text-sm text-gray-500 mt-2">
                The email you provided appears to be invalid or randomly generated. Please contact support to update your email.
              </p>
            </>
          ) : (
            <>
              <MailCheck className="mx-auto text-green-600 h-12 w-12" />
              <h1 className="text-2xl font-semibold mt-4">Verify Your Email</h1>
              <p className="text-sm text-gray-500 mt-2">
                We&apos;ve sent a verification link to <span className="font-medium">{email}</span>. Please check your inbox and verify to continue.
              </p>
            </>
          )}
        </div>

        {!suspicious && (
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">Already verified?</p>
            <Link href="/login">
              <Button variant="default">Try Logging In Again</Button>
            </Link>
          </div>
        )}

        {suspicious && (
          <Alert variant="destructive">
            <AlertTitle>Need help?</AlertTitle>
            <AlertDescription>
              Contact us at <a href="mailto:support@profiler.me" className="underline">support@profiler.me</a> to update your email address.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-slate-100 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <h1 className="text-2xl font-semibold mt-4">Loading...</h1>
          </div>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}