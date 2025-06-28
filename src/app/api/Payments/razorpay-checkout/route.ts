import Razorpay from 'razorpay';
import { NextRequest } from 'next/server';

// Initialize Razorpay
const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

if (!razorpayKeyId || !razorpayKeySecret) {
  throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be defined in environment variables');
}

const razorpay = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
});

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'INR' } = await request.json();

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects amount in smallest unit (paise for INR)
      currency: currency,
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1, // Auto capture payment
    });

    console.log('Razorpay order created:', order.id);

    return Response.json({
      orderId: order.id,
      currency: order.currency,
      amount: order.amount,
      keyId: razorpayKeyId, // Frontend needs this for checkout
    });
  } catch (err) {
    console.error('Razorpay checkout error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ error: errorMessage }, { status: 500 });
  }
} 