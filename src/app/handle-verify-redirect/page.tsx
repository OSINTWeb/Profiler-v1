
'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

function HandleRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Get all query parameters and forward them to verify-email
    const params = new URLSearchParams();
    
    // Forward all existing parameters
    searchParams.forEach((value, key) => {
      params.append(key, value);
    });
    
    // Build the target URL with all parameters
    const queryString = params.toString();
    const targetUrl = queryString ? `/verify-email?${queryString}` : '/verify-email';
    
    // Use replace to avoid adding to history
    router.replace(targetUrl);
  }, [searchParams, router]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <h1 className="text-2xl font-semibold mt-4">Redirecting...</h1>
          <p className="text-sm text-gray-500 mt-2">
            Please wait while we redirect you to the verification page.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function HandleRedirect() {
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
      <HandleRedirectContent />
    </Suspense>
  );
}


