'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';

export type PaymentMethod = 'stripe' | 'razorpay';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
}

export default function PaymentMethodSelector({ 
  selectedMethod, 
  onMethodChange 
}: PaymentMethodSelectorProps) {
  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <h3 className="text-white text-lg font-semibold mb-4 text-center">
        Choose Payment Method
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Stripe Option */}
        <Card 
          className={`p-4 cursor-pointer transition-all duration-200 ${
            selectedMethod === 'stripe'
              ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500'
              : 'bg-gray-800/50 border-gray-600 hover:bg-gray-700/50'
          }`}
          onClick={() => onMethodChange('stripe')}
        >
          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <svg 
                className="w-5 h-5 text-white" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
              </svg>
            </div>
            <span className={`text-sm font-medium ${
              selectedMethod === 'stripe' ? 'text-blue-400' : 'text-gray-300'
            }`}>
              Stripe
            </span>
            <span className="text-xs text-gray-400 text-center">
              International Cards
            </span>
          </div>
        </Card>

        {/* Razorpay Option */}
        <Card 
          className={`p-4 cursor-pointer transition-all duration-200 ${
            selectedMethod === 'razorpay'
              ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500'
              : 'bg-gray-800/50 border-gray-600 hover:bg-gray-700/50'
          }`}
          onClick={() => onMethodChange('razorpay')}
        >
          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
              <svg 
                className="w-5 h-5 text-white" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M22.436 4l-7.091 14.568L7.022 4h15.414zm-8.705 13.795L6.654 5.409 5.564 7.682l7.167 11.886 1-1.773z" fill="#fff"/>
              </svg>
            </div>
            <span className={`text-sm font-medium ${
              selectedMethod === 'razorpay' ? 'text-blue-400' : 'text-gray-300'
            }`}>
              Razorpay
            </span>
            <span className="text-xs text-gray-400 text-center">
              UPI, Cards, Netbanking
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
} 