# Offers & Promotions Implementation Guide

## Overview
Complete implementation of the Offers & Promotions feature for Cherdung Cafe website. This system allows admins to create, manage, and display special offers with automatic scheduling and image support.

## Features Implemented

### 1. Backend API Routes
- **GET /api/offers** - Fetch all active offers (within date range)
- **GET /api/offers?includeAll=true** - Fetch all offers (including expired)
- **POST /api/offers** - Create new offer
- **PUT /api/offers/[id]** - Update existing offer
- **DELETE /api/offers/[id]** - Delete offer
- **POST /api/upload** - Upload images to Cloudinary

### 2. Admin Management Interface
- **Location**: `/admin/offers`
- **Features**:
  - Create, edit, delete offers
  - Upload images directly to Cloudinary
  - Set offer date ranges (automatic activation/expiry)
  - Mark offers as featured
  - Add promo codes and discount details
  - Include terms and conditions
  - Visual status indicators (Active/Expired)

### 3. Public Offers Page
- **Location**: `/offers`
- **Features**:
  - Display all active offers in a grid layout
  - Filter by featured offers
  - Show offer details (title, description, discount, promo code)
  - Time remaining countdown
  - Copy promo code functionality
  - Terms and conditions display
  - Responsive design with cafe branding

### 4. Home Page Integration
- Featured offers automatically displayed on homepage
- Dynamic content from database
- Maximum 2 featured offers shown
- Seamless integration with existing design

### 5. SEO Optimization
- Structured data (Offer schema) for rich results
- JSON-LD format for search engines
- Automatic generation from offer data
- Improved discoverability

### 6. Image Management
- Cloudinary integration for image storage
- Automatic optimization and resizing
- Support for multiple formats (JPG, PNG, GIF, WebP)
- 5MB file size limit
- Secure upload handling

## Database Schema

The Offer model includes:
- `id` - Unique identifier
- `title` - Offer title
- `description` - Detailed description
- `image` - Cloudinary image URL
- `discount` - Discount text (e.g., "20% OFF")
- `promoCode` - Optional promo code
- `startsAt` - Start date/time
- `endsAt` - End date/time
- `isFeatured` - Featured flag for homepage
- `terms` - Terms and conditions
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## Setup Instructions

### 1. Configure Cloudinary
Add these environment variables to your `.env` file:
```env
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

See `CLOUDINARY_SETUP.md` for detailed setup instructions.

### 2. Database Migration
The Offer model already exists in the schema. Run:
```bash
npx prisma generate
```

### 3. Start the Development Server
```bash
npm run dev
```

## Usage

### Admin Usage
1. Navigate to `/admin/offers`
2. Click "Add Offer" to create a new promotion
3. Fill in offer details:
   - Title and description
   - Upload image (optional)
   - Discount details
   - Promo code (optional)
   - Start and end dates
   - Terms and conditions
   - Featured status
4. Click "Create" to save
5. Offers automatically activate/deactivate based on date range

### Public Usage
1. Visit `/offers` to see all active promotions
2. Filter by featured offers using the toggle
3. Copy promo codes with one click
4. View time remaining for each offer

## File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── offers/
│   │   │   ├── route.ts (GET, POST)
│   │   │   └── [id]/route.ts (GET, PUT, DELETE)
│   │   └── upload/
│   │       └── route.ts (Image upload)
│   ├── admin/
│   │   └── offers/
│   │       └── page.tsx (Admin interface)
│   ├── offers/
│   │   └── page.tsx (Public offers page)
│   └── page.tsx (Home page with featured offers)
├── components/
│   └── StructuredData.tsx (SEO schema)
└── lib/
    ├── cloudinary.ts (Cloudinary utilities)
    └── prisma.ts (Database client)
```

## Automatic Features

### Date-Based Activation
- Offers automatically become active when `startsAt` is reached
- Offers automatically expire when `endsAt` is passed
- No manual toggle required
- Admin can still see all offers (including expired)

### Featured Offers
- Mark offers as featured to display on homepage
- Maximum 2 featured offers shown on home
- Featured offers prioritized in listings
- Easy toggle in admin interface

### Image Optimization
- Automatic quality optimization
- Maximum dimensions: 1200x800px
- Web format conversion when beneficial
- CDN delivery via Cloudinary

## Customization

### Styling
All components use the cafe's color scheme:
- Primary: `#7A4E2D` (Coffee brown)
- Background: `#F7F4EF` (Cream)
- Text: `#292522` (Dark brown)
- Accent: `#E7DED4` (Light beige)

### Business Logic
Modify the API routes to customize:
- Offer validation rules
- Date range logic
- Featured offer limits
- Image upload constraints

## Troubleshooting

### Cloudinary Upload Issues
- Verify environment variables are set
- Check API key permissions
- Ensure file size is under 5MB
- Verify file format is supported

### Database Issues
- Run `npx prisma generate` after schema changes
- Check database connection string
- Verify Prisma client is properly configured

### Display Issues
- Clear browser cache
- Check console for errors
- Verify API endpoints are accessible
- Ensure dates are properly formatted

## Future Enhancements

Potential improvements:
- Email notifications for new offers
- Offer analytics and tracking
- Social media sharing integration
- Multi-language support
- Advanced filtering options
- Offer redemption tracking
- User-specific offers
- Bulk offer management
- Offer templates

## Support

For issues or questions:
1. Check the implementation files for detailed logic
2. Review Cloudinary documentation for upload issues
3. Consult Prisma docs for database queries
4. Test API endpoints directly for debugging

The system is now fully functional and ready for use!
