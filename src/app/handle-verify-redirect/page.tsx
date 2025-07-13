
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HandleRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/verify-email'); // strips out ?state=...
  }, []);

  return null;
}