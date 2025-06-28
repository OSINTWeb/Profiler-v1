import { NextRequest } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpayKeySecret) {
      throw new Error('RAZORPAY_KEY_SECRET is not defined in environment variables');
    }

    // Create expected signature
    const expectedSignature = crypto
      .createHmac('sha256', razorpayKeySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    // Verify signature
    if (expectedSignature === razorpay_signature) {
      console.log('Razorpay payment verified successfully');
      return Response.json({ 
        verified: true, 
        message: 'Payment verified successfully' 
      });
    } else {
      console.log('Razorpay payment verification failed');
      return Response.json(
        { verified: false, message: 'Payment verification failed' },
        { status: 400 }
      );
    }
  } catch (err) {
    console.error('Razorpay verification error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ error: errorMessage }, { status: 500 });
  }
} 