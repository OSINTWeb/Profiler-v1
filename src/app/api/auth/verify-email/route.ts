import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

export async function POST(request: Request) {
  try {
    const { state } = await request.json();

    if (!state) {
      return NextResponse.json(
        { error: 'Missing state parameter' },
        { status: 400 }
      );
    }

    try {
      // Verify the state parameter with Auth0
      const verification = await auth0.handleEmailVerification({ state });

      if (verification.status === 'success') {
        return NextResponse.json({ status: 'success' });
      } else {
        return NextResponse.json(
          { error: 'Email verification failed', reason: verification.reason },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error('Auth0 verification error:', error);
      return NextResponse.json(
        { error: 'Invalid or expired verification link' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 