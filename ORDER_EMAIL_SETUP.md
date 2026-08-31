# Order Email & Tracking Setup

## Environment Variables Required

To enable order confirmation emails and status update notifications, configure the following environment variables in your `.env.local` file:

```env
# Email Configuration (Resend)
RESEND_API_KEY=your_resend_api_key_here
FROM_EMAIL=noreply@cherdungcafe.com
CAFE_EMAIL=info@cherdungcafe.com

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Setup Instructions

### 1. Get a Resend API Key
- Sign up at https://resend.com/
- Create an API key in your dashboard
- Add the API key to `RESEND_API_KEY`

### 2. Configure Email Addresses
- `FROM_EMAIL`: The email address that will send order notifications (should be verified in Resend)
- `CAFE_EMAIL`: The email address where café staff receive notifications (used for enquiries)

### 3. Set App URL
- `NEXT_PUBLIC_APP_URL`: Your website's URL (used for Track Order links in emails)
- For local development: `http://localhost:3000`
- For production: `https://your-domain.com`

## Email Features

### Order Confirmation Email
- Sent automatically when a customer places an order
- Includes order ID, customer name, items, quantities, total amount
- Contains "Track Your Order" button linking to the track order page
- Professional HTML template with café branding

### Status Update Emails
- Sent automatically when Staff/Admin updates order status
- Supported statuses:
  - Confirmed: "Your order has been confirmed"
  - Preparing: "Your order is now being prepared"
  - Ready: "Your order is ready for pickup"
  - Completed: "Your order has been completed"
  - Cancelled: "Your order has been cancelled"
- Each email includes current status and Track Order link

## Track Order Feature

### Public Access
- No customer login required
- Accessible via navbar "Track Order" button
- Can be accessed directly via email links: `/track-order?orderId=ORD-XXXX`

### Track Order Page Features
- Order ID input field (supports both "ORD-123" and "123" formats)
- Real-time order status display
- Visual progress tracker showing order flow:
  - ✓ Pending → Confirmed → Preparing → Ready → Completed
- Cancelled order display with clear messaging
- Customer information display
- Order items with images, quantities, and prices
- Total amount calculation
- Order notes display
- Help section with contact links

## API Endpoints

### Order Creation (POST /api/orders)
- Creates order in database
- Sends confirmation email to customer's email address
- Email sending errors don't fail order creation

### Order Status Update (PATCH /api/admin/orders/[id] or /api/staff/orders/[id])
- Updates order status in database
- Sends status update email to customer's email address
- Email sending errors don't fail status update

### Order Fetch (GET /api/orders/[id])
- Public endpoint (no authentication required)
- Fetches order by ID for track order page
- Returns complete order details with items

## Testing

### Test Order Flow
1. Navigate to Menu page
2. Add items to cart
3. Proceed to checkout
4. Enter customer details with real email address
5. Place order
6. Verify order saved to database
7. Check email for order confirmation
8. Note Order ID from email

### Test Status Updates
1. Login as Staff/Admin
2. Navigate to Orders page
3. Find the new order
4. Click status buttons to update order status
5. Verify database update succeeds
6. Check customer email for status notifications
7. Test each status transition

### Test Track Order
1. Click "Track Order" in navbar
2. Enter Order ID (from confirmation email)
3. Verify order details display correctly
4. Check status progress tracker
5. Test with cancelled order
6. Test with invalid Order ID
7. Test direct link from email

## Troubleshooting

### Emails Not Sending
1. Check `RESEND_API_KEY` is correctly set
2. Verify email addresses are verified in Resend dashboard
3. Check server logs for error messages
4. Ensure Resend API is not rate-limited
5. Verify network connectivity

### Track Order Not Working
1. Check `NEXT_PUBLIC_APP_URL` is set correctly
2. Verify API endpoint `/api/orders/[id]` is accessible
3. Check browser console for JavaScript errors
4. Verify Order ID format is correct

### Status Update Emails Not Sending
1. Verify customer email is saved in order
2. Check that status update API is called correctly
3. Review server logs for email sending errors
4. Ensure email sending doesn't fail status update

## Security Notes

- Email credentials are stored in environment variables only
- No sensitive information exposed in URLs (only Order ID)
- Public track order endpoint only exposes necessary order information
- Email templates don't expose internal system details
- All email sending errors are logged for debugging