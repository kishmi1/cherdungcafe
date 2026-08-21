# Blog Implementation Guide

## Overview
Complete implementation of the Blog system for Cherdung Cafe website with advanced features including rich text editing, SEO optimization, category filtering, and draft/publish workflow.

## Features Implemented

### 1. Database Schema Updates
- **Category field** - Added for organizing blog posts
- **SEO fields** - metaTitle and metaDescription for search optimization
- **Read time** - Estimated reading time in minutes
- **Enhanced tags** - Better categorization with tag management

### 2. Backend API Routes
- **GET /api/blog** - Fetch all published posts (with filters)
- **GET /api/blog?includeAll=true** - Fetch all posts (including drafts)
- **GET /api/blog?category=Coffee** - Filter by category
- **GET /api/blog?search=term** - Search posts
- **POST /api/blog** - Create new blog post
- **PUT /api/blog/[id]** - Update existing blog post
- **DELETE /api/blog/[id]** - Delete blog post

### 3. Admin Management Interface
- **Location**: `/admin/blog`
- **Draft → Edit → Preview → Publish workflow**
- **Features**:
  - Rich text editor with formatting tools
  - Cover image upload via Cloudinary
  - Category selection from predefined list
  - Tag management (add/remove tags)
  - SEO meta fields (title, description)
  - Read time estimation
  - Slug generation from title
  - Status management (Draft/Published)
  - Search and filter functionality
  - Preview mode before publishing
  - One-click publish from draft

### 4. Rich Text Editor
- **Location**: `src/components/RichTextEditor.tsx`
- **Built with**: TipTap editor
- **Features**:
  - Bold, italic formatting
  - Headings (H1, H2, H3)
  - Bullet and numbered lists
  - Undo/redo functionality
  - Clean, intuitive toolbar

### 5. Public Blog Listing Page
- **Location**: `/blog`
- **Features**:
  - Responsive grid layout (1-3 columns)
  - Category filter buttons
  - Search functionality
  - Pagination (6 posts per page)
  - Post cards with cover images
  - Read time display
  - Author and date information
  - Newsletter subscription CTA

### 6. Blog Detail Page
- **Location**: `/blog/[slug]`
- **Layout as specified**:
  1. Cover Image
  2. Category
  3. Title
  4. Author + Date
  5. Full rich content
  6. Images inside article
  7. Related Posts
- **Features**:
  - SEO-optimized with meta tags
  - Structured data (BlogPosting schema)
  - Breadcrumb schema
  - Related posts by category
  - Social sharing buttons
  - Tag display
  - Back to blog navigation

### 7. Categories
Predefined categories:
- All (for filtering)
- Coffee Tips
- Recipes
- Cafe Stories
- Events
- Behind the Scenes
- Sustainability

### 8. SEO Features
- Custom meta titles and descriptions
- OpenGraph tags for social sharing
- Structured data (JSON-LD)
- Breadcrumb navigation schema
- SEO-friendly URLs with slugs
- Optimized images with alt text

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── blog/
│   │       ├── route.ts (GET, POST)
│   │       └── [id]/route.ts (GET, PUT, DELETE)
│   ├── admin/
│   │   └── blog/
│   │       └── page.tsx (Admin interface)
│   └── blog/
│       ├── page.tsx (Listing page)
│       └── [slug]/
│           └── page.tsx (Detail page)
├── components/
│   ├── RichTextEditor.tsx (TipTap editor)
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
└── lib/
    ├── cloudinary.ts (Image upload)
    └── prisma.ts (Database client)
```

## Usage

### Admin Workflow

#### Creating a New Post
1. Navigate to `/admin/blog`
2. Click "New Post"
3. Fill in post details:
   - Title (auto-generates slug)
   - Excerpt for listings
   - Upload cover image
   - Select category
   - Add tags
   - Write content with rich text editor
   - Set read time
   - Add SEO meta fields
4. Choose status: "Draft" or "Published"
5. Click "Preview" to see how it will look
6. Click "Create" to save

#### Publishing from Draft
1. Find draft post in the list
2. Click the "Eye" icon to publish
3. Post status changes to "Published"
4. Post becomes visible on public blog

#### Editing Existing Post
1. Click "Edit" icon on any post
2. Make changes in the editor
3. Preview changes
4. Update status if needed
5. Click "Update" to save

### Public User Experience

#### Browsing Blog
1. Visit `/blog` to see all published posts
2. Use category filters to browse specific topics
3. Search for specific posts
4. Navigate through pagination
5. Click "Read More" to view full post

#### Reading Blog Post
1. Click on any post card
2. View cover image (if available)
3. See category and title
4. Read author and date information
5. Read full rich content
6. View related posts by category
7. Share post on social media

## API Examples

### Get all published posts
```bash
GET /api/blog
```

### Get all posts (including drafts)
```bash
GET /api/blog?includeAll=true
```

### Filter by category
```bash
GET /api/blog?category=Coffee%20Tips
```

### Search posts
```bash
GET /api/blog?search=pour%20over
```

### Create new post
```bash
POST /api/blog
{
  "title": "The Art of Pour-Over Coffee",
  "slug": "art-of-pour-over-coffee",
  "excerpt": "Learn the secrets to brewing perfect pour-over coffee",
  "content": "<p>Detailed content here...</p>",
  "coverImage": "https://res.cloudinary.com/...",
  "category": "Coffee Tips",
  "tags": ["Coffee", "Brewing", "Tips"],
  "status": "DRAFT",
  "metaTitle": "The Art of Pour-Over Coffee | Cherdung Cafe",
  "metaDescription": "Learn the secrets to brewing the perfect pour-over coffee at home",
  "readTime": 5,
  "authorId": 1
}
```

### Update post
```bash
PUT /api/blog/1
{
  "status": "PUBLISHED"
}
```

### Delete post
```bash
DELETE /api/blog/1
```

## Rich Text Editor

The TipTap editor supports:
- **Bold**: Ctrl+B
- **Italic**: Ctrl+I
- **Headings**: H1, H2, H3
- **Lists**: Bullet and numbered
- **Undo/Redo**: Ctrl+Z, Ctrl+Y

## SEO Optimization

### Meta Tags
Each blog post can have:
- Custom meta title (fallback to post title)
- Custom meta description (fallback to excerpt)
- OpenGraph image (cover image)
- Structured data for rich results

### URL Structure
- Clean, SEO-friendly URLs: `/blog/art-of-pour-over-coffee`
- Auto-generated slugs from titles
- Unique slug validation

## Related Posts Algorithm

Related posts are selected based on:
1. Same category as current post
2. Published status only
3. Most recent first
4. Maximum 3 posts
5. Falls back to recent posts if no category match

## Performance Features

1. **Lazy Loading**: Images load as needed
2. **Pagination**: 6 posts per page
3. **Cloudinary CDN**: Fast image delivery
4. **Optimized Queries**: Prisma includes only needed fields
5. **Client-side Filtering**: Instant search and category filtering

## Customization

### Add New Categories
Edit the `CATEGORIES` array in:
- `src/app/admin/blog/page.tsx`
- `src/app/blog/page.tsx`

### Change Posts Per Page
Edit `POSTS_PER_PAGE` in `src/app/blog/page.tsx`

### Customize Rich Text Editor
Modify `src/components/RichTextEditor.tsx` to add:
- More formatting options
- Image uploads
- Link insertion
- Code blocks

### Adjust SEO Fields
The metadata generation is in `src/app/blog/[slug]/page.tsx`

## Troubleshooting

### Rich Text Editor Not Working
- Ensure TipTap packages are installed
- Check browser console for errors
- Verify editor initialization

### Images Not Uploading
- Check Cloudinary credentials
- Verify API upload endpoint
- Check file size limits

### Related Posts Not Showing
- Ensure posts have same category
- Check if posts are published
- Verify database queries

### SEO Meta Tags Not Working
- Check metadata generation function
- Verify OpenGraph tags
- Test with social media preview tools

## Future Enhancements

Potential improvements:
- Comment system
- Social media auto-sharing
- Email newsletter integration
- Advanced analytics
- Author profiles
- Scheduled publishing
- Revision history
- Multiple authors per post
- Blog series support
- Advanced search with filters

## Dependencies Added

```json
{
  "@tiptap/react": "^2.1.13",
  "@tiptap/starter-kit": "^2.1.13"
}
```

## Support

For issues or questions:
1. Check the implementation files for detailed logic
2. Review TipTap documentation for editor issues
3. Consult Prisma docs for database queries
4. Test API endpoints directly for debugging

The blog system is now fully functional with the exact workflow you specified: Draft → Edit → Preview → Publish!
