# Online Ordering Payment Flow Implementation

This document provides a comprehensive overview of the complete online ordering payment flow implementation for Cherdung Cafe.

## Overview

The implementation adds support for three payment methods:
1. **Cash** - Pay at counter/cash on delivery
2. **eSewa** - Online payment via eSewa gateway
3. **Khalti** - Online payment via Khalti gateway

## Implementation Summary

### 1. Database Schema Changes

#### Prisma Schema Updates (`prisma/schema.prisma`)

**Added Payment Model:**
```prisma
model Payment {
  id              Int           @id @default(autoincrement())
  orderId         Int
  order           Order         @relation(fields: [orderId], references: [id], onDelete: Cascade)
  paymentMethod   String
  amount          Float
  transactionId   String?
  reference       String?
  paymentStatus   PaymentStatus @default(PENDING)
  paidAt          DateTime?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}
```

**Updated Order Model:**
- Added `payments` relation to Payment model
- Added `REFUNDED` to PaymentStatus enum

**Migration Command:**
```bash
npx prisma db push
```

### 2. API Routes Created

#### Payment Initiation APIs

**eSewa Payment Initiation** (`/api/payments/esewa/initiate/route.ts`)
- Creates pending payment record
- Generates unique transaction ID
- Creates eSewa payment parameters with signature
- Returns payment URL and parameters for form submission

**Khalti Payment Initiation** (`/api/payments/khalti/initiate/route.ts`)
- Creates pending payment record
- Generates unique transaction ID
- Initiates Khalti payment via API
- Returns payment URL for redirect

#### Payment Verification APIs

**eSewa Payment Verification** (`/api/payments/esewa/verify/route.ts`)
- Verifies payment with eSewa API
- Updates payment status to PAID on success
- Updates order status to CONFIRMED
- Redirects to order success/failure page

**Khalti Payment Verification** (`/api/payments/khalti/verify/route.ts`)
- Verifies payment with Khalti API
- Updates payment status to PAID on success
- Updates order status to CONFIRMED
- Redirects to order success/failure page

**eSewa Payment Cancellation** (`/api/payments/esewa/cancel/route.ts`)
- Handles payment cancellation
- Updates payment status to FAILED
- Redirects to order failure page

#### Updated Order API

**Order Creation** (`/api/orders/route.ts`)
- Added server-side price verification
- Validates menu item availability
- Prevents price manipulation
- Supports all three payment methods
- Calculates actual total from database prices

**Admin Order Management** (`/api/admin/orders/[id]/route.ts`)
- Prevents manual marking of online payments as PAID
- Validates status transitions
- Maintains security for payment verification

**Staff Order Management** (`/api/staff/orders/[id]/route.ts`)
- Role-based permission system
- Different permissions for different staff positions
- Prevents unauthorized payment status changes

### 3. Frontend Changes

#### Checkout Page Updates (`/src/app/checkout/page.tsx`)

**Payment Method Selection:**
- Enabled eSewa and Khalti payment options
- Added payment flow handling for online payments
- Implemented form submission for eSewa
- Implemented redirect for Khalti

**Payment Flow:**
1. Customer selects payment method
2. For online payments: Creates order → Initiates payment → Redirects to gateway
3. For cash: Creates order → Redirects to success page

#### Order Success Page Updates (`/src/app/order-success/[id]/page.tsx`)

**Enhanced Information Display:**
- Added payment information section
- Shows payment method and status
- Displays transaction ID and reference
- Shows payment timestamp
- Visual indicators for payment status

#### Order Failure Page (`/src/app/order-failed/page.tsx`)

**New Page Created:**
- Handles payment failures
- Provides error messages based on failure reason
- Offers retry payment option
- Links to cart, menu, and home

#### Admin Orders Page Updates (`/src/app/admin/orders/page.tsx`)

**Enhanced Payment Information:**
- Shows payment status with visual indicators
- Differentiates between online and cash payments
- Prevents manual marking of online payments as PAID
- Shows verification status for online payments

#### Staff Orders Page Updates (`/src/app/staff/orders/page.tsx`)

**Enhanced Payment Information:**
- Shows payment status with visual indicators
- Differentiates between online and cash payments
- Respects role-based permissions for payment updates

### 4. Security Features

#### Server-Side Validation
- **Price Verification:** Calculates total from database prices, not client input
- **Amount Validation:** Verifies payment amount matches order total
- **Order Validation:** Checks order existence and status before payment
- **Duplicate Prevention:** Prevents duplicate payment initiation within 15 minutes

#### Payment Security
- **Secret Keys:** All payment credentials stored server-side only
- **No Client-Side Secrets:** Never exposes secret keys to frontend
- **Gateway Verification:** Never trusts frontend payment success, always verifies with gateway
- **Transaction ID uniqueness:** Generates unique transaction IDs for each payment

#### Access Control
- **Role-Based Permissions:** Different staff roles have different permissions
- **Status Validation:** Prevents invalid status transitions
- **Payment Protection:** Prevents manual marking of online payments as PAID

### 5. Staff Permission System

#### Role-Based Access Control

**SUPERVISOR:**
- Can view all orders
- Can update any order status
- Can view payment information
- Can update payment status (cash only)
- Allowed status transitions: All

**CASHIER:**
- Can view all orders
- Can update order status (limited)
- Can view payment information
- Can update payment status (cash only)
- Allowed status transitions: PENDING → CONFIRMED → CANCELLED

**KITCHEN_STAFF:**
- Can view all orders
- Can update order status (limited)
- Cannot view payment information
- Cannot update payment status
- Allowed status transitions: PREPARING → READY

**BARISTA:**
- Can view all orders
- Can update order status (limited)
- Cannot view payment information
- Cannot update payment status
- Allowed status transitions: PREPARING → READY

**WAITER:**
- Can view all orders
- Can update order status (limited)
- Cannot view payment information
- Cannot update payment status
- Allowed status transitions: READY → COMPLETED

### 6. Error Handling

#### Payment Error Scenarios
- **Payment Cancelled:** User-friendly message with retry option
- **Payment Failed:** Clear error message with retry option
- **Verification Failed:** Contact support message
- **Invalid Parameters:** Validation error message
- **Gateway Error:** Configuration error message
- **Server Error:** Generic error with retry option

#### Order Error Scenarios
- **Amount Mismatch:** Prevents price manipulation
- **Invalid Order ID:** Validation error
- **Order Not Found:** 404 error
- **Order Already Paid:** Duplicate payment prevention
- **Order Cancelled:** Prevents payment on cancelled orders

### 7. Order Lifecycle

#### Order Status Flow
```
NEW → CONFIRMED → PREPARING → READY → COMPLETED
      ↓
   CANCELLED
```

#### Payment Status Flow
```
PENDING → PAID (via gateway verification)
         ↓
      FAILED (via gateway or cancellation)
         ↓
      REFUNDED (manual process)
```

### 8. Files Changed

#### Database Schema
- `prisma/schema.prisma` - Added Payment model, updated Order model

#### API Routes
- `src/app/api/orders/route.ts` - Updated with security and validation
- `src/app/api/admin/orders/[id]/route.ts` - Updated with payment protection
- `src/app/api/staff/orders/[id]/route.ts` - Updated with role-based permissions
- `src/app/api/payments/esewa/initiate/route.ts` - New
- `src/app/api/payments/esewa/verify/route.ts` - New
- `src/app/api/payments/esewa/cancel/route.ts` - New
- `src/app/api/payments/khalti/initiate/route.ts` - New
- `src/app/api/payments/khalti/verify/route.ts` - New

#### Frontend Pages
- `src/app/checkout/page.tsx` - Updated with payment methods
- `src/app/order-success/[id]/page.tsx` - Updated with payment details
- `src/app/order-failed/page.tsx` - New
- `src/app/admin/orders/page.tsx` - Updated with payment info
- `src/app/staff/orders/page.tsx` - Updated with payment info

#### Documentation
- `ENV_SETUP.md` - New - Environment variables setup guide
- `PAYMENT_IMPLEMENTATION.md` - This file

## Environment Variables Required

### Payment Gateway Credentials
```bash
# eSewa
ESEWA_MERCHANT_ID="your_esewa_merchant_id"
ESEWA_SECRET_KEY="your_esewa_secret_key"

# Khalti
KHALTI_SECRET_KEY="your_khalti_secret_key"
```

### Application Configuration
```bash
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

## Testing Instructions

### Local Testing Setup

1. **Set up environment variables:**
   - Create `.env` file in project root
   - Add payment gateway sandbox credentials
   - Set `NEXT_PUBLIC_APP_URL=http://localhost:3000`

2. **Run database migration:**
   ```bash
   npx prisma db push
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

### Testing Cash Payment Flow

1. Add items to cart
2. Go to checkout
3. Select "Cash" payment method
4. Fill in customer details
5. Place order
6. Verify order is created with PENDING payment status
7. Verify order success page shows payment details

### Testing eSewa Payment Flow

1. Add items to cart
2. Go to checkout
3. Select "eSewa" payment method
4. Fill in customer details
5. Place order
6. Verify redirect to eSewa payment page
7. Complete test payment in eSewa sandbox
8. Verify redirect back to order success page
9. Verify payment status is PAID
10. Verify order status is CONFIRMED
11. Check payment record in database

### Testing Khalti Payment Flow

1. Add items to cart
2. Go to checkout
3. Select "Khalti" payment method
4. Fill in customer details
5. Place order
6. Verify redirect to Khalti payment page
7. Complete test payment in Khalti sandbox
8. Verify redirect back to order success page
9. Verify payment status is PAID
10. Verify order status is CONFIRMED
11. Check payment record in database

### Testing Payment Failure Scenarios

1. **Cancel Payment:**
   - Initiate payment
   - Cancel on payment gateway page
   - Verify redirect to order failure page
   - Verify payment status is FAILED
   - Verify retry option works

2. **Failed Payment:**
   - Use invalid payment details
   - Verify payment fails
   - Verify proper error message
   - Verify retry option works

3. **Verification Failure:**
   - Simulate verification API failure
   - Verify proper error handling
   - Verify payment status is FAILED

### Testing Admin Order Management

1. Log in as admin
2. Go to Orders section
3. View order details
4. Verify payment information is displayed
5. Try to mark online payment as PAID (should fail)
6. Update order status through lifecycle
7. Verify email notifications (if configured)

### Testing Staff Order Management

1. Log in as different staff roles
2. Test permissions for each role
3. Verify order status update restrictions
4. Verify payment information visibility based on role
5. Test payment status update permissions

## Merchant Dashboard Configuration

### eSewa Merchant Dashboard

1. **Configure Callback URLs:**
   - Success URL: `https://yourdomain.com/api/payments/esewa/verify`
   - Failure URL: `https://yourdomain.com/api/payments/esewa/cancel`

2. **Set up Webhooks (if available):**
   - Configure payment notifications
   - Set up IP whitelist for your server

3. **Test Configuration:**
   - Use sandbox environment first
   - Test with small amounts
   - Verify callback URLs are accessible

### Khalti Merchant Dashboard

1. **Configure Return URL:**
   - Return URL: `https://yourdomain.com/api/payments/khalti/verify`

2. **Set up Webhooks:**
   - Configure payment notifications
   - Set up IP whitelist for your server

3. **Test Configuration:**
   - Use test environment first
   - Test with small amounts
   - Verify return URL is accessible

## Production Deployment Checklist

- [ ] Update `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Set `NODE_ENV=production`
- [ ] Use production payment gateway credentials
- [ ] Configure SSL/HTTPS for domain
- [ ] Test payment flows in production
- [ ] Set up monitoring for payment failures
- [ ] Configure callback URLs in merchant dashboards
- [ ] Enable email notifications
- [ ] Set up database backups
- [ ] Configure error logging
- [ ] Test staff permissions with real accounts
- [ ] Load test payment flows
- [ ] Set up payment reconciliation process

## Monitoring and Maintenance

### Key Metrics to Monitor
- Payment success rate
- Payment failure rate by payment method
- Average payment processing time
- Order confirmation rate
- Payment verification failures

### Regular Maintenance Tasks
- Monitor payment gateway API status
- Review failed payment logs
- Reconcile payments with bank statements
- Update payment gateway credentials if needed
- Review and update staff permissions
- Test payment flows after any updates

## Troubleshooting

### Common Issues

**Payment initiation fails:**
- Check payment gateway credentials
- Verify `NEXT_PUBLIC_APP_URL` is correct
- Check browser console for errors
- Verify payment gateway API status

**Payment verification fails:**
- Check callback URLs in merchant dashboard
- Verify server can receive callbacks
- Check server logs for verification errors
- Ensure secret keys are correct

**Payment status not updating:**
- Check database connection
- Verify payment record exists
- Check server logs for update errors
- Ensure verification is completing

**Staff permissions not working:**
- Verify staff role is set correctly
- Check permission matrix in API
- Ensure session is valid
- Check for authentication errors

## Support

For issues related to:
- **Payment Gateways:** Contact eSewa/Khalti support
- **Implementation:** Check this documentation and code comments
- **Technical Issues:** Review server logs and error messages