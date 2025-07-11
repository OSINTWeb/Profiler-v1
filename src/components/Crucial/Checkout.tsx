// components/CheckoutButton.tsx
'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import PaymentMethodSelector, { PaymentMethod } from './PaymentMethodSelector';
import { RazorpayOptions, RazorpayResponse } from '@/types/razorpay';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { useUser } from "@auth0/nextjs-auth0";
// Stripe configuration
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined in environment variables');
}

const stripePromise = loadStripe(stripePublishableKey);

// Declare Razorpay for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutButton() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [amount, setAmount] = useState<number>(20); // Custom amount state
  const [amountError, setAmountError] = useState<string>('');
  const [currency, setCurrency] = useState<string>('usd'); // Currency state
  const { user } = useUser();
  // Currency config
  const currencyOptions = [
    { value: 'usd', label: 'USD ($)' },
    { value: 'eur', label: 'EUR (€)' },
    { value: 'inr', label: 'INR (₹)' },
  ];
  const currencySymbols: Record<string, string> = {
    usd: '$',
    eur: '€',
    inr: '₹',
  };

  // Payment configuration
  // const PAYMENT_AMOUNT = 20; // $20 USD or ₹20 INR equivalent (removed)

  // Stripe payment handler
  const handleStripePayment = async () => {
    try {
      console.log('Using publishable key mode:', stripePublishableKey!.startsWith('pk_test_') ? 'test' : 'live');
      
      // Get Rewardful referral ID using official API
      const referralId = typeof window !== 'undefined' && window.Rewardful ? window.Rewardful.referral : undefined;
      if (referralId) {
        console.log('Including Rewardful referral ID:', referralId);
      }
      
      const res = await fetch('/api/Payments/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount, // Use custom amount
          currency: currency,
          referralId, // Include referral ID in the request
        }),
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
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Stripe checkout error:', error);
      throw error;
    }
  };

  // Razorpay payment handler
  const handleRazorpayPayment = async () => {
    try {
      // Create Razorpay order
      const res = await fetch('/api/Payments/razorpay-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount, // Use custom amount
          currency: 'INR'
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Load Razorpay script dynamically
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      }

      // Configure Razorpay options
      const options: RazorpayOptions = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Profiler.me',
        description: 'Payment for Profiler.me',
        order_id: data.orderId,
        handler: async function (response: RazorpayResponse) {
          try {
            // Verify payment on server
            const verifyRes = await fetch('/api/Payments/razorpay-verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.verified) {
              // Redirect to success page
              window.location.href = '/success';
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: '#3B82F6',
        },
        modal: {
          ondismiss: function() {
            console.log('Razorpay checkout modal closed');
            setIsProcessing(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Razorpay checkout error:', error);
      throw error;
    }
  };

  // Main payment handler
  const handlePayment = async () => {
    if (isProcessing) return;
    // Validate amount
    let minAmount = 1;
    if (selectedPaymentMethod === 'stripe') {
      minAmount = currency === 'usd' ? 0.5 : currency === 'eur' ? 0.5 : 1;
    } else if (selectedPaymentMethod === 'razorpay') {
      minAmount = 1;
    }
    if (!amount || isNaN(amount) || amount < minAmount) {
      setAmountError(`Please enter a valid amount (minimum ${currencySymbols[currency] || ''}${minAmount})`);
      return;
    }
    setAmountError('');
    setIsProcessing(true);
    
    try {
      if (selectedPaymentMethod === 'stripe') {
        await handleStripePayment();
      } else if (selectedPaymentMethod === 'razorpay') {
        await handleRazorpayPayment();
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <PaymentMethodSelector 
        selectedMethod={selectedPaymentMethod}
        onMethodChange={setSelectedPaymentMethod}
      />
      <div className="my-4">
        <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger className="w-full" id="currency">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            {currencyOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="my-4">
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
        <input
          id="amount"
          type="number"
          min={selectedPaymentMethod === 'stripe' ? (currency === 'usd' || currency === 'eur' ? 0.5 : 1) : 1}
          step={selectedPaymentMethod === 'stripe' ? 0.01 : 1}
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
          disabled={isProcessing}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {amountError && <p className="text-red-500 text-xs mt-1">{amountError}</p>}
      </div>
      <button 
        onClick={handlePayment}
        disabled={isProcessing}
        className={`w-full px-6 py-3 text-white rounded-xl font-semibold transition-all duration-200 ${
          isProcessing 
            ? 'bg-gray-600 cursor-not-allowed' 
            : selectedPaymentMethod === 'stripe'
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing...
          </div>
        ) : (
          `Pay ${currencySymbols[currency] || ''}${amount} with ${selectedPaymentMethod === 'stripe' ? 'Stripe' : 'Razorpay'}`
        )}
      </button>
      
      <p className="text-center text-sm text-gray-400 mt-3">
        {selectedPaymentMethod === 'stripe' 
          ? 'Secure payment with Stripe • International cards accepted'
          : 'Secure payment with Razorpay • UPI, Cards, Netbanking accepted'
        }
      </p>
    </div>
  );
}
