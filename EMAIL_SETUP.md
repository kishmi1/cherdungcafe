# Email Setup for Enquiry Form

To enable email notifications for the enquiry form, you need to configure the following environment variables:

## Required Environment Variables

Add these to your `.env.local` file:

```env
# Email Configuration (Resend)
RESEND_API_KEY=your_resend_api_key_here
FROM_EMAIL=noreply@cherdungcafe.com
CAFE_EMAIL=info@cherdungcafe.com

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Setup Instructions

1. **Get a Resend API Key**
   - Sign up at https://resend.com/
   - Create an API key in your dashboard
   - Add the API key to `RESEND_API_KEY`

2. **Configure Email Addresses**
   - `FROM_EMAIL`: The email address that will send notifications (should be verified in Resend)
   - `CAFE_EMAIL`: The email address where café staff will receive enquiry notifications

3. **Set App URL**
   - `NEXT_PUBLIC_APP_URL`: Your website's URL (used for links in emails)

## Email Features

- **Cafe Notification**: Sends detailed enquiry information to café staff
- **Customer Acknowledgement**: Sends automatic confirmation email to enquirers
- **Professional Templates**: Beautiful HTML email templates with café branding

## Testing

After configuration, test the email functionality by:
1. Submitting a test enquiry through the form
2. Checking both the café email and customer email for notifications
3. Verifying email content and links work correctly

## Troubleshooting

If emails are not being sent:
1. Check that `RESEND_API_KEY` is correctly set
2. Verify email addresses are verified in Resend dashboard
3. Check server logs for error messages
4. Ensure Resend API is not rate-limited