# Bali Tourism CMS

A comprehensive Content Management System for the Bali Tourism website built with Next.js 14, TypeScript, Prisma, and modern web technologies.

## 🚀 Features

### Core CMS Functionality
- **Full CRUD Operations** for Packages, Activities, and Testimonials
- **Multilingual Support** (English, Hindi, Malayalam)
- **Media Library** with SEO fields and folder organization
- **Publishing Controls** with draft, published, and scheduled states
- **Version Control** and backup system
- **Preview Mode** for content review before publishing
- **Real-time Data Sync** with the main website

### Advanced Features
- **Editable Tables** for bulk content management
- **Drag & Drop Media Upload** with optimization
- **Scheduled Publishing** with automatic content activation
- **Cache Revalidation** for immediate content updates
- **SEO Management** with meta fields and OpenGraph support
- **Analytics Dashboard** with content statistics

### Technical Features
- **REST API** with clean endpoints
- **Database Migrations** for demo data import
- **Authentication** with NextAuth.js or Clerk
- **Type Safety** with TypeScript and Zod validation
- **Responsive Design** with Tailwind CSS
- **State Management** with Zustand

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js / Clerk
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Radix UI
- **File Upload**: UploadThing
- **Icons**: Lucide React

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bali-tourism-cms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```
   
   Update the `.env.local` file with your configuration:
   - Database connection string
   - NextAuth secret and URL
   - Clerk keys (if using Clerk)
   - UploadThing credentials
   - Migration secret

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Or run migrations
   npm run db:migrate
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Access the Application**
   - Main Site: `http://localhost:3000`
   - Admin Dashboard: `http://localhost:3000/admin-dashboard`

## 🗄️ Database Schema

The CMS uses a comprehensive database schema with the following main models:

- **User**: Authentication and user management
- **Package**: Tourism packages with translations and media
- **Activity**: Activities with multilingual support
- **Testimonial**: Customer testimonials
- **Media**: File management with SEO fields
- **CMSSettings**: System configuration
- **Translations**: Multilingual content support
- **Versions**: Content versioning and backup

## 🔧 API Endpoints

### Packages
- `GET /api/packages` - List packages with filtering
- `POST /api/packages` - Create new package
- `GET /api/packages/[id]` - Get specific package
- `PUT /api/packages/[id]` - Update package
- `DELETE /api/packages/[id]` - Delete package

### Activities
- `GET /api/activities` - List activities
- `POST /api/activities` - Create activity
- `GET /api/activities/[id]` - Get specific activity
- `PUT /api/activities/[id]` - Update activity
- `DELETE /api/activities/[id]` - Delete activity

### Testimonials
- `GET /api/testimonials` - List testimonials
- `POST /api/testimonials` - Create testimonial
- `GET /api/testimonials/[id]` - Get specific testimonial
- `PUT /api/testimonials/[id]` - Update testimonial
- `DELETE /api/testimonials/[id]` - Delete testimonial

### Media
- `GET /api/media` - List media files
- `POST /api/media` - Upload media files
- `GET /api/media/[id]` - Get specific media
- `PUT /api/media/[id]` - Update media metadata
- `DELETE /api/media/[id]` - Delete media file

### CMS Management
- `GET /api/cms/settings` - Get CMS settings
- `PUT /api/cms/settings` - Update CMS settings
- `GET /api/cms/stats` - Get dashboard statistics
- `POST /api/cms/revalidate` - Revalidate cache
- `POST /api/migrate` - Migrate demo data

## 📝 Content Management

### Adding Content

1. **Navigate to Admin Dashboard**
   - Go to `/admin-dashboard`
   - Login with your credentials

2. **Create New Content**
   - Select content type (Packages, Activities, Testimonials)
   - Fill in required fields
   - Add media attachments
   - Set publishing status
   - Save as draft or publish immediately

3. **Multilingual Content**
   - Switch language in the language selector
   - Add translations for each enabled language
   - Content will be served based on user's language preference

### Publishing Workflow

1. **Draft**: Content is saved but not visible on the website
2. **Published**: Content is live and visible to users
3. **Scheduled**: Content will be automatically published at a specified date/time

### Media Management

1. **Upload Files**
   - Drag and drop files or click to browse
   - Files are automatically optimized
   - Add SEO metadata (alt text, captions, etc.)

2. **Organize Media**
   - Create folders for better organization
   - Tag media for easy searching
   - Link media to content items

## 🔄 Data Migration

To migrate existing demo data from your main site:

1. **Run Migration**
   ```bash
   curl -X POST http://localhost:3000/api/migrate \
     -H "Content-Type: application/json" \
     -d '{"secret": "your-migration-secret"}'
   ```

2. **Verify Migration**
   - Check admin dashboard for imported content
   - Review and edit imported data as needed
   - Publish content when ready

## 🎨 Customization

### Styling
- Modify Tailwind configuration in `tailwind.config.js`
- Update component styles in respective component files
- Add custom CSS in `globals.css`

### Adding New Content Types
1. Update Prisma schema
2. Create API endpoints
3. Add Zustand store
4. Create admin interface components
5. Update navigation and routing

### Extending Functionality
- Add new API endpoints in `/api` directory
- Create custom hooks for data fetching
- Implement additional UI components
- Add new pages and routes

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Other Platforms
1. Build the application: `npm run build`
2. Start production server: `npm start`
3. Configure environment variables on your platform
4. Set up database connection

## 🔒 Security

- All API endpoints are protected with authentication
- Input validation with Zod schemas
- SQL injection protection with Prisma
- File upload restrictions and validation
- Environment variable protection

## 📊 Performance

- **ISR (Incremental Static Regeneration)** for fast page loads
- **Image optimization** with Next.js Image component
- **Database indexing** for efficient queries
- **Caching strategies** for API responses
- **Bundle optimization** with Next.js

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify DATABASE_URL in environment variables
   - Ensure PostgreSQL is running
   - Check database permissions

2. **Authentication Problems**
   - Verify NextAuth configuration
   - Check NEXTAUTH_SECRET and NEXTAUTH_URL
   - Ensure callback URLs are correct

3. **File Upload Issues**
   - Verify UploadThing configuration
   - Check file size limits
   - Ensure upload directory permissions

4. **Build Errors**
   - Run `npm run type-check` for TypeScript errors
   - Verify all environment variables are set
   - Check for missing dependencies

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the documentation

---

**Built with ❤️ for modern content management**
