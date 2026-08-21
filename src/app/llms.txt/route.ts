import { NextResponse } from "next/server"

export const dynamic = "force-static"

export async function GET() {
  const content = `# Cherdung Café - AI Crawler Information

## Website Overview
Cherdung Café is a neighborhood café serving specialty coffee, delicious food, and memorable experiences. We offer dine-in, takeaway, catering, private events, and fresh bakery items.

## Business Information
- **Name**: Cherdung Café
- **Type**: Café / Coffee Shop
- **Location**: 123 Coffee Street, City, State 12345, United States
- **Phone**: +1 (555) 123-4567
- **Email**: hello@cherdungcafe.com
- **Website**: https://cherdungcafe.com

## Opening Hours
- Monday - Friday: 7:00 AM - 8:00 PM
- Saturday - Sunday: 8:00 AM - 9:00 PM

## Services
- Specialty Coffee (premium beans, expert brewing)
- Dine-In Experience (comfortable seating)
- Takeaway Service (quick service)
- Catering Services (events and meetings)
- Private Events (special occasions)
- Fresh Bakery (daily pastries and treats)

## Menu Categories
- Coffee Beverages (espresso, pour-over, cold brew, specialty drinks)
- Food Items (breakfast, lunch, pastries, snacks)
- Bakery Items (fresh baked goods daily)

## Key Pages
- **Home**: https://cherdungcafe.com/ - Overview with services preview, gallery, blog, and contact
- **Services**: https://cherdungcafe.com/services - Detailed service descriptions
- **Offers**: https://cherdungcafe.com/offers - Current promotions and deals
- **Gallery**: https://cherdungcafe.com/gallery - Photo gallery of interior, food, and events
- **Blog**: https://cherdungcafe.com/blog - Coffee tips, recipes, and café stories
- **Contact**: https://cherdungcafe.com/contact - Contact information and map
- **Enquiry**: https://cherdungcafe.com/enquiry - Form for customer inquiries

## Content Structure
- Blog posts cover coffee education, brewing techniques, café culture, and recipes
- Gallery images categorized as: Interior, Food, Events
- Offers include time-bound promotions with start/end dates
- Services are organized by type with descriptions and pricing notes

## Brand Values
- Quality: Premium coffee beans and expert preparation
- Community: Welcoming neighborhood gathering place
- Sustainability: Environmentally conscious practices
- Customer Service: Friendly, knowledgeable staff

## Contact for AI Crawler Questions
For specific questions about our content or business, please contact: hello@cherdungcafe.com

## Data Freshness
- Offers: Updated daily based on current promotions
- Blog: New posts added weekly
- Gallery: Updated monthly with new images
- Services: Updated quarterly or as needed

## Accessibility
- Website follows WCAG 2.1 AA guidelines
- All images include alt text
- Semantic HTML structure
- Keyboard navigation supported`

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  })
}