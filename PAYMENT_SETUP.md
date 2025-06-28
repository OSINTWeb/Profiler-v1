# Payment Integration Setup Guide

This application supports both **Stripe** and **Razorpay** payment gateways, giving users the flexibility to choose their preferred payment method.

## Features

- ✅ **Stripe Integration**: International card payments with redirect-based checkout
- ✅ **Razorpay Integration**: UPI, Cards, Netbanking, and other Indian payment methods
- ✅ **Payment Method Selection**: Users can choose between Stripe and Razorpay
- ✅ **Secure Payment Verification**: Server-side payment verification for both gateways
- ✅ **Responsive UI**: Modern, mobile-friendly payment interface

## Environment Variables Setup

### 1. Copy the environment template
```bash
cp .env.example .env.local
```

### 2. Configure Stripe
1. Sign up at [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get your API keys from the Dashboard
3. Add to `.env.local`:
```env
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

### 3. Configure Razorpay
1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Get your API keys from Settings > API Keys
3. Add to `.env.local`:
```env
RAZORPAY_KEY_ID=rzp_test_your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
```

## API Endpoints

### Stripe Endpoints
- `POST /api/Payments/checkout` - Create Stripe checkout session
- Redirects to Stripe-hosted checkout page

### Razorpay Endpoints
- `POST /api/Payments/razorpay-checkout` - Create Razorpay order
- `POST /api/Payments/razorpay-verify` - Verify Razorpay payment

## Usage

### Basic Implementation
```tsx
import CheckoutButton from '@/components/Crucial/Checkout';

export default function PaymentPage() {
  return (
    <div>
      <CheckoutButton />
    </div>
  );
}
```

### Customizing Payment Amount
Edit the `PAYMENT_AMOUNT` constant in `src/components/Crucial/Checkout.tsx`:
```tsx
const PAYMENT_AMOUNT = 50; // Change to your desired amount
```

## Payment Flow

### Stripe Flow
1. User selects Stripe payment method
2. Clicks "Pay $XX with Stripe"
3. Creates checkout session via API
4. Redirects to Stripe-hosted checkout
5. After payment, redirects to success/cancel page

### Razorpay Flow
1. User selects Razorpay payment method
2. Clicks "Pay ₹XX with Razorpay"
3. Creates order via API
4. Opens Razorpay checkout modal
5. After payment, verifies signature server-side
6. Redirects to success page

## Security Features

### Stripe Security
- Server-side session creation
- Webhook support (can be added)
- PCI DSS compliant

### Razorpay Security
- Server-side signature verification
- Order-based payment flow
- Webhook support (can be added)

## Testing

### Stripe Test Cards
- **Success**: `4242 4242 4242 4242`
- **Declined**: `4000 0000 0000 0002`
- Any future expiry date and any 3-digit CVC

### Razorpay Test Credentials
- **UPI**: `success@razorpay`
- **Cards**: `4111 1111 1111 1111`
- **CVV**: Any 3-digit number
- **Expiry**: Any future date

## Production Deployment

### Before Going Live
1. **Stripe**: Replace test keys with live keys (sk_live_ and pk_live_)
2. **Razorpay**: Replace test keys with live keys (rzp_live_)
3. **Environment**: Ensure proper environment variable management
4. **Testing**: Test both payment flows thoroughly
5. **Webhooks**: Consider implementing webhooks for production

### Currency Considerations
- **Stripe**: Supports multiple currencies (USD, EUR, etc.)
- **Razorpay**: Primarily INR, with some multi-currency support

## Troubleshooting

### Common Issues
1. **Environment Variables**: Ensure all required env vars are set
2. **CORS Issues**: Check API route configurations
3. **Script Loading**: Razorpay script loads dynamically
4. **Network Issues**: Handle API call failures gracefully

### Debug Mode
Enable console logging by checking browser developer tools. Both integrations include comprehensive error logging.

## Next Steps

### Potential Enhancements
- [ ] Add webhook handlers for both gateways
- [ ] Implement subscription payments
- [ ] Add more payment methods (Apple Pay, Google Pay)
- [ ] Enhanced error handling and user feedback
- [ ] Payment analytics dashboard
- [ ] Multi-currency dynamic conversion

## Support

For integration issues:
- **Stripe**: [Stripe Documentation](https://docs.stripe.com/)
- **Razorpay**: [Razorpay Documentation](https://razorpay.com/docs/) 