// app/api/checkout/route.ts
import Stripe from 'stripe';
import { NextRequest } from 'next/server';

// Ensure we're using the correct secret key - use test key for development
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-05-28.basil',
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body to get amount, currency, and referralId
    const { amount = 20, currency, referralId } = await request.json();
    console.log('Referral ID:', referralId);  
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: 'Your Service',
              description: 'Payment for premium services',
            },
            unit_amount: Math.round(amount * 100), // Convert to cents/smallest currency unit
          },
          quantity: 1,
        },
      ],
      success_url: `${request.nextUrl.origin}/success`,
      cancel_url: `${request.nextUrl.origin}/cancel`,
      // Add referral ID to Stripe session if present
      ...(referralId && { client_reference_id: referralId }),
    });

    console.log('Stripe session created:', session.id);
    console.log('Using secret key mode:', stripeSecretKey!.startsWith('sk_test_') ? 'test' : 'live');
    if (referralId) {
      console.log('Referral ID included:', referralId);
    }

    return Response.json({ sessionId: session.id });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
