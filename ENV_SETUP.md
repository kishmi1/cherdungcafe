# Environment Variables Setup

This document describes the environment variables required for the Cherdung Cafe online ordering payment system.

## Payment Gateway Environment Variables

### eSewa Payment Gateway

You need to obtain eSewa merchant credentials from https://esewa.com.np/merchant

**Required Environment Variables:**
```bash
ESEWA_MERCHANT_ID="your_esewa_merchant_id"
ESEWA_SECRET_KEY="your_esewa_secret_key"
```

**Testing:**
- eSewa provides a sandbox environment for testing
- Use sandbox credentials during development
- Switch to production credentials when deploying to production

**Configuration:**
- Ensure your eSewa merchant account has the correct callback URLs configured:
  - Success URL: `https://yourdomain.com/api/payments/esewa/verify`
  - Failure URL: `https://yourdomain.com/api/payments/esewa/cancel`

### Khalti Payment Gateway

You need to obtain Khalti merchant credentials from https://khalti.com/merchant

**Required Environment Variables:**
```bash
KHALTI_SECRET_KEY="your_khalti_secret_key"
```

**Testing:**
- Khalti provides a sandbox environment for testing
- Use sandbox credentials during development
- Switch to production credentials when deploying to production

**Configuration:**
- Ensure your Khalti merchant account has the correct return URL configured:
  - Return URL: `https://yourdomain.com/api/payments/khalti/verify`

## Application Environment Variables

**Required:**
```bash
# Application URL (used for payment callbacks - server-side only)
APP_URL="http://localhost:3000"  # Change to your production domain

# Application URL (used for email links - client-side)
NEXT_PUBLIC_APP_URL="http://localhost:3000"  # Change to your production domain

# Environment
NODE_ENV="development"  # Change to "production" for production deployment
```

## Database Environment Variables

**Required:**
```bash
# PostgreSQL Database URL
DATABASE_URL="postgresql://user:password@host:port/database"
```

## Email Service Environment Variables (if using email notifications)

**Required for Resend:**
```bash
RESEND_API_KEY="your_resend_api_key"
RESEND_FROM_EMAIL="noreply@cherdungcafe.com"
```

## Setup Instructions

1. **Create a `.env` file** in the root of your project (if it doesn't exist)
2. **Add the required environment variables** based on the payment gateways you want to use
3. **Replace placeholder values** with your actual credentials
4. **Restart your development server** after adding environment variables

## Security Notes

- **NEVER commit `.env` file** to version control
- **NEVER share secret keys** publicly
- **Use different credentials** for development and production
- **Rotate secret keys** periodically
- **Monitor payment gateway dashboards** for suspicious activity

## Testing Payment Gateways Locally

### eSewa Testing
1. Use eSewa sandbox credentials
2. The system automatically uses sandbox URLs when `NODE_ENV=development`
3. Test with small amounts (Rs. 10-50)
4. Verify payment callbacks are working correctly

### Khalti Testing
1. Use Khalti test credentials
2. The system automatically uses test URLs when `NODE_ENV=development`
3. Test with small amounts (Rs. 10-50)
4. Verify payment callbacks are working correctly

## Production Deployment Checklist

- [ ] Update `APP_URL` to production domain (for payment callbacks)
- [ ] Update `NEXT_PUBLIC_APP_URL` to production domain (for email links)
- [ ] Set `NODE_ENV=production`
- [ ] Use production payment gateway credentials
- [ ] Configure SSL/HTTPS for your domain
- [ ] Test payment flows in production environment
- [ ] Set up monitoring for payment failures
- [ ] Configure webhook/callback URLs in payment gateway dashboards
- [ ] Enable email notifications for order confirmations

## Troubleshooting

### Payment initiation fails
- Check that payment gateway credentials are correctly set
- Verify `APP_URL` is accessible (for payment callbacks)
- Verify `NEXT_PUBLIC_APP_URL` is accessible (for email links)
- Check browser console for JavaScript errors
- Verify payment gateway API status

### Payment verification fails
- Check callback URLs are correctly configured in payment gateway dashboard
- Verify server can receive callback requests
- Check server logs for verification errors
- Ensure payment gateway secret keys are correct

### Payment status not updating
- Check database connection
- Verify payment record exists
- Check server logs for update errors
- Ensure payment verification is completing successfully