# Cloudinary Setup for Offers & Promotions

To enable image upload functionality for offers, you need to configure Cloudinary credentials.

## Required Environment Variables

Add the following environment variables to your `.env` file:

```env
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key" 
CLOUDINARY_API_SECRET="your_api_secret"
```

## How to Get Cloudinary Credentials

1. Sign up for a free Cloudinary account at https://cloudinary.com
2. Go to the Dashboard
3. Copy your:
   - Cloud Name (shown on the dashboard)
   - API Key (from Account Settings > API Keys)
   - API Secret (from Account Settings > API Keys)

## Features Enabled

With Cloudinary configured, you can:
- Upload offer images directly from the admin panel
- Automatic image optimization and resizing
- Secure image storage and delivery
- Support for various image formats

## Image Upload Details

- Maximum file size: 5MB
- Supported formats: JPG, PNG, GIF, WebP
- Auto-optimization: Enabled
- Default transformations: Quality auto, max 1200x800px
- Storage folder: `offers/` (configurable)
