# TPS Site - Scalable Tour Booking Platform

A comprehensive Next.js 15-based tour booking platform with an integrated Content Management System (CMS), built using **Claude Code** for rapid AI-assisted development.

![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![Tailwind](https://img.shields.io/badge/Tailwind-3.3.0-blue)

## 🚀 Overview

TPS Site is a production-ready, scalable tour booking platform designed for **replication across 300+ microsites**. Built in **5+ days** using Claude Code, it demonstrates rapid AI-assisted development of enterprise-grade applications.

### Key Highlights
- **White-label Architecture**: Easily customizable for different tour operators
- **SEO-First Design**: Comprehensive search engine optimization
- **Performance Optimized**: Core Web Vitals monitoring and optimization
- **Security Hardened**: Row Level Security and comprehensive auditing
- **Mobile Responsive**: Optimized for all device sizes
- **Production Ready**: Complete testing framework and deployment tools

## 🎯 Core Features

### 🏠 **Customer-Facing Website**

#### Homepage & Discovery
- **Dynamic Hero Section**: Customizable through admin CMS
- **Featured Experiences Grid**: Automatically highlights popular tours
- **Category Navigation**: Organized browsing by tour type
- **Customer Testimonials**: Review display with rating system
- **FAQ Section**: Expandable frequently asked questions
- **Search Functionality**: Full-text search across all content
- **Performance Monitoring**: Real-time Web Vitals tracking

#### Tour Detail Pages (`/tour/[slug]`)
- **SEO Optimization**: Dynamic meta tags, Open Graph, structured data
- **Rich Media Display**: Image galleries, descriptions, highlights
- **Dynamic Pricing**: Real-time pricing with multi-currency support
- **Review Integration**: Customer ratings and detailed testimonials
- **FAQ Integration**: Tour-specific frequently asked questions
- **Booking Integration**: Direct links to booking platforms (GetYourGuide, Viator)
- **Jump Navigation**: Quick links to different page sections
- **Includes/Excludes**: Clear what's included in tour packages
- **Mobile Optimized**: Responsive design for all screen sizes

#### Category & Browse Pages
- **Category Landing Pages**: `/category/[slug]` with filtered experiences
- **Advanced Filtering**: Price, duration, group size, location filters
- **Search Results**: Comprehensive search with highlighting
- **Pagination**: Efficient handling of large content volumes
- **Breadcrumb Navigation**: Clear navigation hierarchy

#### Travel Guide System (`/travel-guide/[slug]`)
- **Blog/Article Management**: Content marketing articles
- **Category Organization**: Organized travel content by topics
- **SEO Optimization**: Full meta tag and structured data support
- **Related Content**: Automatic content suggestions
- **Rich Text Content**: Full-featured article display
- **Image Galleries**: Photo carousels and galleries
- **Social Sharing**: Open Graph optimized sharing

### ⭐ **Review & Testimonial System**
- **Dynamic Review Display**: Real-time review statistics calculation
- **Rating Calculations**: Automatic average rating computation
- **Review Assignment**: Link reviews to specific tours/experiences
- **Rating Distribution**: Visual star rating breakdowns with charts
- **Customer Avatars**: Gradient-based avatar generation system
- **Review Filtering**: Filter by rating, date, tour
- **Helpful Voting**: Community-driven review quality assessment

### ❓ **FAQ Management System**
- **Searchable Tour Association**: Command/Popover interface for tour linking
- **Category Organization**: Group FAQs by topic (booking, pricing, weather, etc.)
- **Global vs Tour-Specific**: Flexible FAQ display options
- **Sort Order Control**: Custom FAQ ordering and prioritization
- **Visibility Controls**: Show/hide on specific pages
- **Admin-Friendly Interface**: Easy FAQ creation with rich text editor

## 🛠️ **Comprehensive Admin CMS**

### 📊 **Admin Dashboard** (`/admin`)
- **Analytics Overview**: Key metrics and performance indicators
- **Content Statistics**: Tours, reviews, FAQs, blog posts counts
- **Recent Activity**: Latest content updates and user actions
- **Quick Actions**: Fast access to common admin tasks
- **System Health**: Database connection and performance monitoring

### 🎪 **Experience Management** (`/admin/experiences`)
- **Complete CRUD Operations**: Create, read, update, delete tours
- **Rich Content Editor**: Full-featured tour description editor
- **SEO Field Management**: Title, description, keywords, canonical URLs
- **Open Graph Control**: Social media optimization fields
- **Image Management**: Upload, crop, and optimize tour images
- **Pricing Controls**: Dynamic pricing with currency support
- **Status Management**: Draft, active, archived, featured states
- **Category Assignment**: Organize tours by type and location
- **Availability Integration**: Connect to external booking systems
- **Duplicate Detection**: Prevent duplicate tour entries
- **Bulk Operations**: Mass edit multiple tours

### ❓ **FAQ Management** (`/admin/faqs`)
- **Searchable Tour Selection**: Advanced search for tour association
- **Command Interface**: Fast keyboard-driven tour selection
- **Category Organization**: Group FAQs by topic areas
- **Rich Text Editor**: Full formatting options for answers
- **Sort Order Control**: Drag-and-drop FAQ ordering
- **Visibility Controls**: Show/hide on specific pages or globally
- **Bulk Operations**: Mass edit, delete, or categorize FAQs
- **Preview Mode**: See how FAQs appear on live site
- **Analytics Integration**: Track FAQ effectiveness

### 📖 **Blog Management** (`/admin/blog`, `/admin/travel-guide`)
- **Rich Text Editor**: Full-featured content creation with media
- **SEO Optimization**: Complete meta tag and structured data management
- **Category & Tag System**: Flexible content organization
- **Publication Workflow**: Draft, review, scheduled, published states
- **Image Integration**: Upload, optimize, and manage blog images
- **Related Content**: Automatic and manual content linking
- **Preview Mode**: See articles before publication
- **Analytics Integration**: Track article performance
- **Bulk Operations**: Mass publish, categorize, or archive

### ⭐ **Testimonial Management** (`/admin/testimonials`)
- **Review Creation**: Add customer testimonials with rich details
- **Rating System**: 1-5 star rating management
- **Review Assignment**: Link reviews to specific tours or general
- **Avatar Management**: Custom gradient avatar selection system
- **Status Controls**: Published, pending, archived states
- **Bulk Import**: CSV-based review import from external systems
- **Moderation Tools**: Approve, reject, or edit reviews
- **Analytics Dashboard**: Review statistics and trends

### 🔗 **URL Management** (`/admin/redirects`)
- **Dynamic Redirect System**: Database-driven URL redirects
- **301/302 Support**: SEO-friendly redirect types
- **Bulk Import**: CSV-based redirect management
- **Legacy URL Handling**: Maintain SEO value during migrations
- **Wildcard Redirects**: Pattern-based redirect rules
- **Analytics Integration**: Track redirect usage and effectiveness
- **Automatic Detection**: Find and suggest redirects for broken links

### 🤖 **SEO Management** (`/admin/robots`)
- **Dynamic Robots.txt**: Database-driven robots.txt generation
- **Live Preview**: Real-time robots.txt preview
- **Directive Management**: Allow, disallow, sitemap directives
- **Search Engine Control**: Fine-grained crawling control
- **Sitemap Integration**: Automatic sitemap generation and linking
- **User-Agent Specific**: Different rules for different crawlers

### 🏠 **Homepage Management** (`/admin/homepage`)
- **Section Control**: Enable/disable homepage sections
- **Content Management**: Edit hero text, descriptions, CTAs
- **Featured Content**: Select which tours to feature
- **Layout Customization**: Arrange homepage sections
- **A/B Testing**: Test different homepage variations
- **Performance Monitoring**: Track homepage conversion rates

### 🔧 **System Management**
- **Bulk Upload**: CSV-based content import (`/admin/bulk-upload`)
- **Internal Links**: Manage cross-references between content
- **Schema Management**: Control structured data output
- **Performance Monitoring**: Real-time site performance tracking
- **Security Auditing**: Automated vulnerability scanning
- **Database Health**: Monitor query performance and optimization

## 🏗️ **Technology Stack**

### **Frontend Technologies**
- **Next.js 15.3.4**: React framework with App Router and server components
- **React 19.1.0**: Latest React with concurrent features
- **TypeScript 5.x**: Full type safety with strict mode
- **Tailwind CSS 3.3.0**: Utility-first CSS framework
- **shadcn/ui**: High-quality, accessible React components
- **Radix UI**: Unstyled, accessible UI primitives
- **Lucide React**: Beautiful, customizable icon library
- **Embla Carousel**: Touch-friendly carousel component

### **Backend & Database**
- **Supabase**: PostgreSQL database with real-time features
- **Row Level Security (RLS)**: Database-level access control
- **Supabase Auth**: Built-in authentication and authorization
- **Supabase Storage**: File upload and optimization
- **Next.js API Routes**: Server-side API endpoints
- **PostgreSQL**: Advanced relational database features

### **Development & Quality Tools**
- **Jest**: Unit testing framework with React Testing Library
- **Playwright**: Cross-browser end-to-end testing
- **ESLint**: Code linting with security rules
- **Prettier**: Automatic code formatting
- **TypeScript Strict**: Enhanced type checking
- **Web Vitals**: Core performance metrics tracking
- **Bundle Analyzer**: JavaScript bundle optimization

### **SEO & Performance**
- **Next.js Image**: Automatic image optimization and lazy loading
- **Static Site Generation**: Pre-rendered pages for performance
- **Incremental Static Regeneration**: Dynamic content with caching
- **Structured Data**: JSON-LD for rich search results
- **Open Graph**: Social media optimization
- **Sitemap Generation**: Automatic XML sitemap creation
- **Robots.txt**: Dynamic crawler directive management

## 📊 **Database Schema**

### Core Tables
```sql
-- Main content tables
experiences          # Tours, activities, attractions
categories           # Tour categories and organization  
cities               # Location and destination data
faqs                 # FAQ system with tour association
blog_posts           # Travel guides and articles
testimonials         # Customer reviews and ratings

-- SEO and management
slug_redirects       # URL redirect management
robots_config        # Dynamic robots.txt configuration  
homepage_settings    # CMS-driven homepage content
page_schemas         # Structured data management

-- System tables
users                # Admin user management
internal_links       # Cross-content referencing
review_assignments   # Link reviews to experiences
```

### Key Features
- **UUID Primary Keys**: Globally unique identifiers
- **Audit Trails**: Created/updated timestamps on all tables
- **Soft Deletes**: Preserve data with status fields
- **Full Text Search**: PostgreSQL search capabilities
- **JSON Fields**: Flexible schema extensions
- **Foreign Key Constraints**: Data integrity enforcement

## 🚀 **Getting Started**

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project
- Git for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TheProjectSEO/TPS-Site.git
   cd TPS-Site
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.local.example .env.local
   # Add your Supabase credentials
   ```

4. **Database setup**
   ```bash
   # Run migrations
   npx supabase db push
   
   # Seed sample data (optional)
   npx supabase db seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to see the site and `http://localhost:3000/admin` for the CMS.

## 🧪 **Testing & Quality Assurance**

### Available Scripts
```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Testing
npm run test             # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
npm run test:e2e         # Run end-to-end tests
npm run test:e2e:ui      # Run E2E tests with UI
npm run test:all         # Run all tests

# Code Quality
npm run lint             # Run ESLint
npm run typecheck        # TypeScript type checking
npm run format           # Format code with Prettier

# Auditing
npm run audit:security   # Security vulnerability scan
npm run audit:performance # Performance analysis
npm run audit:all        # Complete audit
npm run production:audit # Full production readiness check

# Analysis
npm run analyze          # Bundle size analysis
```

### Testing Framework
- **Unit Tests**: Jest with React Testing Library
- **E2E Tests**: Playwright across Chrome, Firefox, Safari, Edge
- **Coverage**: 60%+ code coverage requirement
- **Performance**: Web Vitals monitoring and optimization
- **Security**: Automated vulnerability scanning

## 📈 **Performance Benchmarks**

### Target Metrics
- **Lighthouse Score**: 95+ across all pages
- **First Contentful Paint**: < 1.8s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms
- **Time to Interactive**: < 3.8s

### Bundle Size Targets
- **Initial JavaScript**: < 250KB
- **Total JavaScript**: < 1MB
- **CSS**: < 50KB compressed
- **Images**: WebP format, properly sized

## 🔒 **Security Features**

### Database Security
- **Row Level Security (RLS)**: Fine-grained access control
- **API Key Management**: Secure environment variable handling
- **Input Validation**: Zod schema validation for all inputs
- **SQL Injection Prevention**: Parameterized queries only

### Application Security
- **Authentication**: Supabase Auth with secure sessions
- **Authorization**: Role-based access control
- **CSRF Protection**: Built-in Next.js CSRF protection
- **XSS Prevention**: Content sanitization and validation
- **Security Headers**: Comprehensive security header configuration

### Regular Auditing
- **Dependency Scanning**: npm audit integration
- **Vulnerability Monitoring**: Automated security alerts
- **Code Analysis**: ESLint security rules
- **Penetration Testing**: Regular security assessments

## 🌐 **SEO Features**

### On-Page SEO
- **Dynamic Meta Tags**: Contextual title, description, keywords
- **Open Graph**: Social media optimization for all pages
- **Twitter Cards**: Enhanced Twitter sharing
- **Canonical URLs**: Prevent duplicate content issues
- **Schema Markup**: Rich snippets for search engines

### Technical SEO
- **XML Sitemap**: Automatic generation and updates
- **Robots.txt**: Dynamic crawler directive management
- **URL Structure**: SEO-friendly URL patterns
- **Page Speed**: Core Web Vitals optimization
- **Mobile-First**: Responsive design throughout

### Content SEO
- **Structured Data**: JSON-LD for rich search results
- **Breadcrumbs**: Clear navigation hierarchy
- **Internal Linking**: Automated cross-content references
- **Image Optimization**: Alt tags, lazy loading, WebP format

## 🔄 **Scalability & Replication**

### White-Label Architecture
- **Configuration-Driven**: Easy customization for different brands
- **Theme System**: Customizable colors, fonts, layouts
- **Content Templates**: Reusable content structures
- **Multi-Language Ready**: Internationalization support

### Deployment Scalability
- **Environment Configuration**: Easy multi-environment setup
- **Database Separation**: Independent databases per client
- **CDN Integration**: Global content delivery
- **Container Ready**: Docker support for scaling

### 300+ Microsite Vision
- **Centralized Management**: Single codebase, multiple deployments
- **Automated Deployments**: CI/CD pipeline for rapid deployment
- **Performance Monitoring**: Centralized analytics across all sites
- **Cost Optimization**: Shared infrastructure and resources

## 📝 **API Documentation**

### Public API Endpoints
```typescript
GET    /api/experiences          # List all experiences
GET    /api/experiences/[slug]   # Get single experience
GET    /api/search               # Search across content
GET    /api/reviews/[id]         # Get reviews for experience
```

### Admin API Endpoints
```typescript
POST   /api/admin/experiences    # Create experience
PUT    /api/admin/experiences/[id] # Update experience
DELETE /api/admin/experiences/[id] # Delete experience
POST   /api/admin/faqs           # Create FAQ
PUT    /api/admin/faqs/[id]      # Update FAQ
DELETE /api/admin/faqs/[id]      # Delete FAQ
```

## 🤝 **Contributing**

### Development Workflow
1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/new-feature`
3. **Run tests**: `npm run test:all`
4. **Run audits**: `npm run audit:all`
5. **Commit changes**: Follow conventional commit format
6. **Create pull request**: Include description and tests

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: All rules must pass
- **Prettier**: Code formatting enforced
- **Testing**: Maintain 60%+ coverage
- **Documentation**: Update docs for new features

## 📚 **Documentation**

### Available Documentation
- **[PROJECT_OVERVIEW.md](./docs/PROJECT_OVERVIEW.md)**: Complete project specifications
- **[MCP_INTEGRATION_GUIDE.md](./docs/technical/MCP_INTEGRATION_GUIDE.md)**: Model Context Protocol usage
- **[TECHNICAL_ARCHITECTURE.md](./docs/technical/TECHNICAL_ARCHITECTURE.md)**: System architecture
- **[PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)**: Deployment guidelines
- **[AUDIT_SETUP_SUMMARY.md](./AUDIT_SETUP_SUMMARY.md)**: Testing framework overview

### Quick Links
- **Live Demo**: [Coming Soon]
- **Admin Demo**: [Coming Soon]
- **API Documentation**: [Coming Soon]
- **Component Storybook**: [Coming Soon]

## 🛟 **Support & Troubleshooting**

### Common Issues
- **Database Connection**: Check Supabase credentials in `.env.local`
- **Build Errors**: Run `npm run typecheck` to identify TypeScript issues
- **Performance Issues**: Use `npm run analyze` to check bundle size
- **Security Alerts**: Run `npm run audit:security` for vulnerability scan

### Getting Help
- **Issues**: [GitHub Issues](https://github.com/TheProjectSEO/TPS-Site/issues)
- **Discussions**: [GitHub Discussions](https://github.com/TheProjectSEO/TPS-Site/discussions)
- **Documentation**: Check `docs/` folder for detailed guides

## 📄 **License**

This project is proprietary software developed for tour booking platform replication. Please contact the development team for licensing information.

## 🏆 **Built With Claude Code**

This project showcases the power of **Claude Code** (claude.ai/code) for rapid, AI-assisted development:

- **5+ Days Development**: Complete platform from concept to production
- **75,000+ Lines of Code**: Comprehensive, well-structured codebase
- **Enterprise Quality**: Production-ready with full testing suite
- **Best Practices**: Modern development patterns and security
- **Documentation**: Comprehensive guides and technical documentation

---

**Developed by**: TPS Development Team with Claude Code  
**Last Updated**: January 2025  
**Version**: 1.0.0