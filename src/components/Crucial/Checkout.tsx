// components/CheckoutButton.tsx
'use client';

import { loadStripe } from '@stripe/stripe-js';

// Ensure we're using the correct publishable key - must match the secret key environment
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined in environment variables');
}

const stripePromise = loadStripe(stripePublishableKey);

export default function CheckoutButton() {
  const handleClick = async () => {
    try {
      console.log('Using publishable key mode:', stripePublishableKey!.startsWith('pk_test_') ? 'test' : 'live');
      
      const res = await fetch('/api/Payments/checkout', {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }

      const result = await stripe.redirectToCheckout({ sessionId: data.sessionId });
      
      if (result.error) {
        console.error('Stripe redirect error:', result.error);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Payment failed. Please try again.');
    }
  };

  return (
    <button onClick={handleClick} className="bg-blue-600 px-4 py-2 text-white rounded hover:bg-blue-700 transition-colors">
      Pay Now
    </button>
  );
}
