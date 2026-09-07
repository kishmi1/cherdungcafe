# Environment Variables Setup for Vercel Deployment

## Required Environment Variables for Khalti Payment

When deploying to Vercel, you must set these environment variables in your Vercel project settings:

### 1. APP_URL (Required for Vercel)
```
APP_URL=https://your-app.vercel.app
```
Replace `your-app.vercel.app` with your actual Vercel domain. This is critical for Khalti return URLs to work correctly.

### 2. KHALTI_SECRET_KEY
```
KHALTI_SECRET_KEY=your_khalti_secret_key
```
Your Khalti secret key from the Khalti merchant dashboard.

### 3. KHALTI_ENV (Important)
```
KHALTI_ENV=production
```
Set to `production` when using production Khalti credentials, or `development` for sandbox/testing.

### 4. Other Required Variables
```
DATABASE_URL=your_postgresql_connection_string
BREVO_API_KEY=your_brevo_api_key
EMAIL_FROM=no-reply@yourdomain.com
NODE_ENV=production
```

## Steps to Configure in Vercel:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable listed above
4. Redeploy your application after adding the variables

## Common Issues:

**Issue**: Khalti payment fails on Vercel but works locally
**Solution**: Make sure `APP_URL` is set to your Vercel domain (not localhost)

**Issue**: Khalti returns "payment failed" 
**Solution**: Check that `KHALTI_ENV` is set correctly (development for sandbox, production for live)

**Issue**: Return URL redirects to localhost
**Solution**: The code now automatically detects Vercel environment, but `APP_URL` should still be set as a fallback