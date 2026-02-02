# CLUSTER Festival - Digital Event Management Platform

A modern, high-performance web application for managing multimedia art and music festivals with integrated ticket management, QR code validation, and advanced 3D visualization. **Currently in early development (25-30% complete).**

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-61dafb?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat-square&logo=typescript)
![MySQL](https://img.shields.io/badge/MySQL-InnoDB-00758f?style=flat-square&logo=mysql)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## ✨ Overview

CLUSTER is a comprehensive platform designed to bring together creative industries—music, visual arts, digital media, game development, and design—into a unified festival experience. The platform provides robust tools for event management, ticketing, artist coordination, and attendee engagement.

### 🎯 Key Features

- **Event Management** - Create and manage multiple events with rich metadata, dynamic pricing, and real-time status tracking
- **Advanced Ticketing System** - Multi-tier ticket system with inventory management, promotional codes, and secure QR code generation
- **Real-time Analytics** - Dashboard insights into sales, attendance patterns, and user engagement
- **Secure QR Validation** - High-security QR code system with device fingerprinting and fraud detection
- **Artist Collaboration** - Complete artist profile management with social media integration and performance scheduling
- **Venue Management** - Comprehensive venue database with capacity planning and accessibility information
- **Payment Processing** - Flexible payment system supporting multiple payment methods
- **3D Visualization** - Cutting-edge WebGPU-powered 3D interface for engaging festival exploration

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18.0.0
- **npm** or **yarn** package manager
- **MySQL** 8.0+ (for production)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/cluster-festival.git
cd cluster-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your-password
DB_NAME=festival_cluster

# Optional: AWS Secrets Manager (for production)
USE_SECRETS_MANAGER=false
AWS_REGION=us-east-1
SECRET_NAME=cluster/db

# NextAuth Configuration (in development)
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Email Service (Resend - in development)
RESEND_API_KEY=re_xxxxx

# Optional: Payment Processing (coming soon)
STRIPE_PUBLIC_KEY=pk_...
STRIPE_SECRET_KEY=sk_...

# SMS Service (Twilio - optional)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
```

4. **Initialize the database**
```bash
# Import the schema
mysql -u root -p festival_cluster < clusterDB.sql

# Or run migrations when available
npm run db:migrate
```

5. **Start development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📋 Technology Stack

### Frontend
- **Framework:** [Next.js 16](https://nextjs.org/) - React meta-framework with App Router
- **Language:** [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **UI Rendering:** [React 19.2](https://react.dev/) - Latest React features
- **3D Graphics:** [Three.js](https://threejs.org/) - WebGL/WebGPU 3D library
- **Styling:** CSS Modules + Custom CSS

### Backend
- **Runtime:** Node.js (via Next.js)
- **Database:** MySQL 8.0 with InnoDB
- **Database Client:** mysql2/promise (with connection pooling)
- **Authentication:** JWT tokens + bcrypt password hashing
- **Email Service:** Resend
- **Email Templates:** Built-in system with HTML templates
- **Validation:** Zod schema validation
- **Security:** AWS Secrets Manager integration, cryptographic token generation
- **SMS/Voice:** Twilio integration
- **Cloud Storage:** AWS S3 (for file uploads)

### DevOps & Tools
- **Package Manager:** npm
- **Version Control:** Git
- **Task Runner:** npm scripts

---

## 📁 Project Structure

```
cluster-app/
├── src/
│   ├── app/
│   │   ├── api/                 # API routes
│   │   │   ├── hello/          # Test endpoint
│   │   │   ├── qr/             # QR code generation
│   │   │   ├── search/         # Search functionality
│   │   │   ├── users/          # User management
│   │   │   └── random/         # Placeholder
│   │   ├── components/          # React components
│   │   │   ├── Portada.tsx     # Landing hero section
│   │   │   ├── Fundacion.tsx   # About section
│   │   │   ├── Footer.tsx      # Footer
│   │   │   ├── GaussianCluster.tsx  # 3D visualization
│   │   │   └── *.module.css    # Component styles
│   │   ├── events/             # Event detail pages
│   │   ├── microcluster/       # Secondary pages
│   │   ├── error/              # Error handling
│   │   ├── renderer/           # WebGPU renderer setup
│   │   ├── scenes/             # 3D scene components
│   │   ├── utils/              # Utility functions
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── globals.css         # Global styles
│   │   └── not-found.tsx       # 404 page
│   ├── lib/                     # Shared utilities *(to be created)*
│   └── types/                   # TypeScript types *(to be created)*
├── public/                      # Static assets
├── clusterDB.sql               # Database schema
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

---

## 🏗️ Database Schema

The application uses a comprehensive MySQL database with 17 normalized tables:

### Core Tables
- **`user`** - User accounts with role-based access control
- **`event`** - Festival events with rich metadata
- **`venue`** - Event venues with location and capacity data
- **`artist`** - Artist profiles with social media integration

### Commerce Tables
- **`ticket_tier`** - Dynamic ticket pricing and inventory
- **`order`** - Purchase orders with status tracking
- **`payment`** - Payment processing with multiple methods
- **`ticket`** - Individual tickets with QR codes

### Operations Tables
- **`event_artist`** - Many-to-many event/artist relationships
- **`promo_code`** - Promotional discount management
- **`ticket_validation_log`** - Check-in audit trail
- **`audit_log`** - Complete system audit tracking

### Analytics Tables
- **`search_cache`** - Search performance optimization
- **`search_log`** - User search analytics

See [clusterDB.sql](./clusterDB.sql) for the complete schema.

---

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload

# Production
npm run build            # Build for production
npm run start            # Start production server

# Database *(coming soon)*
npm run db:setup        # Initialize database
npm run db:seed         # Populate with sample data
npm run db:migrate      # Run migrations
npm run db:studio       # Open Prisma Studio

# Testing *(coming soon)*
npm run test            # Run test suite
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report

# Code Quality *(coming soon)*
npm run lint            # Run ESLint
npm run type-check      # TypeScript check
npm run format          # Format with Prettier
```

---

## 📖 API Documentation

The application provides RESTful API endpoints for all major operations:

### Authentication
```
POST   /api/auth/login           # User login (in development)
POST   /api/auth/register        # Create new account (in development)
POST   /api/auth/logout          # User logout (not implemented)
POST   /api/auth/refresh         # Refresh tokens (not implemented)
GET    /api/health               # Health check / DB connectivity
```

### Events *(Not yet implemented)*
```
GET    /api/events               # List all events
GET    /api/events/[id]          # Get event details
POST   /api/events               # Create event (admin)
PUT    /api/events/[id]          # Update event (admin)
DELETE /api/events/[id]          # Delete event (admin)
```

### Tickets *(Not yet implemented)*
```
GET    /api/tickets              # List user's tickets
GET    /api/tickets/[id]         # Get ticket details
POST   /api/tickets              # Purchase tickets
PUT    /api/tickets/[id]         # Update ticket (transfer)
GET    /api/qr/[uuid]            # Generate QR code (SVG) ✅ Working
```

### Orders *(Not yet implemented)*
```
POST   /api/orders               # Create order
GET    /api/orders/[id]          # Get order details
PUT    /api/orders/[id]/cancel   # Cancel order
POST   /api/orders/[id]/refund   # Request refund
```

### Newsletter *(Partially working)*
```
POST   /api/newsletter            # Subscribe to newsletter
GET    /api/newsletter/confirm    # Confirm subscription
GET    /api/newsletter/unsubscribe # Unsubscribe
```

### Search *(Placeholder)*
```
GET    /api/search               # Global search
GET    /api/search/events        # Search events
GET    /api/search/artists       # Search artists
GET    /api/search/venues        # Search venues
```

### Users *(Placeholder)*
```
GET    /api/users/me             # Get current user (not working)
GET    /api/users/[id]           # Get user profile (not working)
PUT    /api/users/me             # Update profile (not working)
GET    /api/users/[id]/orders    # User's orders (not working)
```

**Note:** Most endpoints are stubbed out. See [z_PROJECT_ANALYSIS.md](./z_PROJECT_ANALYSIS.md) for implementation priority.

---

## 🎨 3D Visualization

CLUSTER features a stunning WebGPU-powered 3D visualization using Three.js:

- **Gaussian Distribution Cluster** - 5000+ particles rendered in real-time
- **Interactive Camera Controls** - Explore the cluster from different angles
- **High-Performance GPU Rendering** - Utilizes modern GPU acceleration
- **Responsive Design** - Adapts to different screen sizes
- **Error Handling** - Graceful fallback for unsupported browsers

The visualization is powered by:
- [Three.js](https://threejs.org/) for 3D graphics
- [WebGPU](https://www.w3.org/TR/webgpu/) for high-performance GPU compute
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) for React integration

---

## 🔐 Security

CLUSTER implements industry-standard security practices:

### Authentication & Authorization
- Session-based authentication with NextAuth.js
- Role-based access control (RBAC)
- JWT token support for API access
- Secure password hashing (bcrypt)

### Data Protection
- HTTPS/TLS encryption in transit
- Database encryption at rest
- CORS protection
- CSRF token validation
- SQL injection prevention via ORM

### Ticket Security
- Cryptographically secure QR tokens (SHA-256)
- Device fingerprinting to prevent ticket fraud
- Check-in validation with audit logging
- Rate limiting on API endpoints

### Audit & Compliance
- Complete audit logging of all operations
- GDPR compliance ready
- Payment Card Industry (PCI) compliance path
- Regular security assessments

⚠️ **Current Status:** 
- Basic authentication infrastructure is in place but not fully functional
- User registration and login endpoints exist but need debugging
- Email verification flow not yet implemented
- Session management incomplete
- Do not use in production without completing security hardening and testing

---

## 🚦 Development Status - January 2026

**Current Progress:** 25-30% (API Implementation Phase)

| Component | Status | Details |
|-----------|--------|---------|
| **Database Schema** | ✅ Complete | 17 normalized tables with full indexing |
| **Frontend Structure** | ✅ Complete | Route structure, layout framework, 3D hero |
| **3D Visualization** | ✅ Complete | WebGPU-powered Gaussian cluster rendering |
| **Database Connection** | ✅ Complete | Connection pooling, AWS Secrets Manager support |
| **Core API Infrastructure** | 🔄 In Progress | Health check, QR generation working; auth/user endpoints partial |
| **Authentication** | 🔄 In Progress | 40% - JWT tokens, bcrypt, client utilities; missing email verification |
| **Frontend Components** | ⏳ Next | Forms, navigation, data display |
| **Core Features** | ⏳ Planned | Event browsing, ticket purchase, search |
| **Payment Integration** | ⏳ Planned | Stripe integration |
| **Admin Dashboard** | ⏳ Planned | Management interfaces |
| **Production Ready** | ❌ Not Started | Deployment, monitoring, scaling |

**Legend:** ✅ Complete | 🔄 In Progress | ⏳ Planned | ❌ Not Started

### Current Working Features
- ✅ Landing page with 3D visualization
- ✅ Database connection with connection pooling
- ✅ QR code generation endpoint
- ✅ Health check endpoint
- ✅ Email template system
- ✅ Token generation and validation
- ✅ Basic authentication utilities
- ⚠️ Login/Register endpoints (needs debugging & completion)
- ⚠️ Newsletter subscription management

### Known Limitations
- ❌ User authentication flow not complete
- ❌ Event data endpoints not implemented
- ❌ Ticket purchasing not functional
- ❌ Payment processing not integrated
- ❌ Admin features not available
- ❌ Frontend state management not implemented
- ❌ Error handling not standardized
- ❌ Rate limiting not implemented
- ⚠️ Full authorization (RBAC) not enforced

For detailed analysis and roadmap, see [z_PROJECT_ANALYSIS.md](./z_PROJECT_ANALYSIS.md)

---

## 🤝 Contributing

We welcome contributions from developers, designers, and festival enthusiasts!

### Getting Started with Development

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Commit with conventional commits: `git commit -m 'feat: description'`
5. Push to your fork: `git push origin feature/your-feature`
6. Open a Pull Request

### Development Guidelines

- **Code Style:** Follow the existing code style and use Prettier for formatting
- **Type Safety:** Use TypeScript strict mode
- **Testing:** Add tests for new features
- **Documentation:** Update docs for API changes
- **Commits:** Use [Conventional Commits](https://www.conventionalcommits.org/)

### Reporting Issues

Found a bug? Please [create an issue](https://github.com/yourusername/cluster-festival/issues) with:
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- System information (OS, browser, Node version)

---

## 📚 Documentation

<!-- - **[Project Analysis](./PROJECT_ANALYSIS.md)** - Comprehensive technical analysis, architecture, and roadmap -->
<!-- - **[Database Schema](./clusterDB.sql)** - Complete MySQL database definition -->
- **API Documentation** *(coming soon)* - Full API reference with examples
- **Deployment Guide** *(coming soon)* - Production deployment instructions
- **Contributing Guide** *(coming soon)* - Detailed contribution guidelines

---

## 🛠️ Immediate Next Steps (Priority Order)

Based on the current codebase analysis, here are the critical items to address next:

### Week 1: Complete Authentication
1. **Debug & complete login endpoint** (4-6 hours)
   - Test JWT token generation
   - Verify password comparison with bcrypt
   - Add proper error responses

2. **Complete registration endpoint** (4-6 hours)
   - Input validation with Zod schemas
   - Email verification flow
   - Prevent duplicate accounts

3. **Add protected route middleware** (3-4 hours)
   - JWT verification
   - Role-based access control (RBAC)
   - Error handling for unauthorized access

### Week 2: Implement Core API Endpoints
4. **Events CRUD operations** (8-10 hours)
   - GET /api/events (list with filtering)
   - GET /api/events/[id] (single event)
   - POST/PUT/DELETE for admin users

5. **User endpoints** (6-8 hours)
   - GET /api/users/profile (current user)
   - PUT /api/users/profile (update profile)
   - Artist profile management

6. **Search functionality** (6-8 hours)
   - Implement full-text search on events
   - Filter by category, date, venue
   - Search caching strategy

### Week 3: Frontend Components & State
7. **Frontend state management** (6-8 hours)
   - Set up TanStack Query for server state
   - Implement Zustand for client state
   - Add auth context provider

8. **Core UI components** (10-12 hours)
   - Navigation menu
   - Authentication forms (login/register)
   - Event cards & list components
   - User profile page

### Detailed Implementation Guide
For complete implementation details, breaking down each feature, estimated timeline, and specific code patterns needed, see [z_PROJECT_ANALYSIS.md - PRIORITY IMPROVEMENTS](./z_PROJECT_ANALYSIS.md#-priority-improvements--corrections)

---

## 🔍 Troubleshooting

### Dev server won't start
```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

### Database connection error
```
ERROR: connect ECONNREFUSED 127.0.0.1:3306
```
- Verify MySQL server is running: `sudo service mysql start` (Linux) or start via Docker
- Check `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` in `.env.local`
- Verify database exists: `mysql -u root -e "SHOW DATABASES;"`
- If needed, create database: `mysql -u root -e "CREATE DATABASE festival_cluster;"`

### Database credentials from Secrets Manager
```
Error: Unable to retrieve secret from AWS Secrets Manager
```
- Ensure `USE_SECRETS_MANAGER=false` in `.env.local` for development
- For production, configure AWS credentials and set `USE_SECRETS_MANAGER=true`
- Verify secret format: `{"username":"...","password":"...","host":"...","port":3306}`

### 3D visualization not rendering
- Check browser WebGPU support: Use Chrome 113+ or Edge 113+
- Open DevTools → Console for WebGL errors
- Fallback message should appear if unsupported
- Try disabling browser extensions that might interfere

### JWT token errors
```
Error: Invalid token signature
```
- Ensure `NEXTAUTH_SECRET` is set in `.env.local`
- Clear browser localStorage: `localStorage.clear()`
- Restart dev server

### Port 3000 already in use
```bash
# Use a different port
npm run dev -- -p 3001
```

---

## 📚 Key Implementation Files

Important files to understand for development:

- **[src/lib/db.ts](./src/lib/db.ts)** - Database connection pooling & query execution
- **[src/lib/auth-client.ts](./src/lib/auth-client.ts)** - Client-side authentication utilities
- **[src/app/api/auth/login/route.ts](./src/app/api/auth/login/route.ts)** - Authentication endpoint
- **[src/lib/validations/](./src/lib/validations/)** - Zod validation schemas
- **[clusterDB.sql](./clusterDB.sql)** - Database schema definition
- **[z_PROJECT_ANALYSIS.md](./z_PROJECT_ANALYSIS.md)** - Detailed technical analysis & roadmap

---

## 📊 Performance

CLUSTER is built for performance:

- **Static Generation** - Pages pre-rendered at build time
- **Image Optimization** - Automatic image optimization via Next.js
- **Code Splitting** - Automatic route-based code splitting
- **Database Indexes** - Strategic indexes for fast queries
- **Caching** - Query result caching and CDN-ready architecture

Target metrics:
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
- API Response Time: < 200ms

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙌 Credits

Created with ❤️ by the CLUSTER Festival team for the digital transformation of creative industries.

### Technologies Used
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Three.js](https://threejs.org/)
- [MySQL](https://www.mysql.com/)

---

## 📞 Contact & Support

- **GitHub Issues:** [Bug reports & feature requests](https://github.com/yourusername/cluster-festival/issues)
- **Email:** [support@clusterfestival.com](mailto:support@clusterfestival.com)
- **Website:** [clusterfestival.com](https://clusterfestival.com) *(coming soon)*
- **Twitter:** [@ClusterFest](https://twitter.com/clusterfest) *(coming soon)*

---

## 🎊 Join the Festival

CLUSTER is more than just a ticketing platform—it's a movement to celebrate digital creativity and technological innovation in regional communities. Whether you're a developer, artist, musician, designer, or festival enthusiast, there's a place for you.

**Let's build something amazing together! 🚀**

---

*Last updated: January 18, 2026 | Version 0.1.0 - Early Development (25-30% complete)*
