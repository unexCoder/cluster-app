# CLUSTER Festival - Digital Event Management Platform

A modern, high-performance web application for managing multimedia art and music festivals with integrated ticket management, QR code validation, and real-time event analytics.

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
# Database
DATABASE_URL="mysql://user:password@localhost:3306/festival_cluster"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# API Keys
STRIPE_PUBLIC_KEY="pk_..."
STRIPE_SECRET_KEY="sk_..."
```

4. **Initialize the database**
```bash
npm run db:setup
npm run db:seed
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
- **ORM:** [Prisma](https://www.prisma.io/) *(in development)*
- **Authentication:** [NextAuth.js](https://next-auth.js.org/) *(in development)*
- **Validation:** [Zod](https://zod.dev/) *(in development)*

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
POST   /api/auth/register        # Create new account
POST   /api/auth/login           # User login
POST   /api/auth/logout          # User logout
POST   /api/auth/refresh         # Refresh tokens
```

### Events
```
GET    /api/events               # List all events
GET    /api/events/[id]          # Get event details
POST   /api/events               # Create event (admin)
PUT    /api/events/[id]          # Update event (admin)
DELETE /api/events/[id]          # Delete event (admin)
```

### Tickets
```
GET    /api/tickets              # List user's tickets
GET    /api/tickets/[id]         # Get ticket details
POST   /api/tickets              # Purchase tickets
PUT    /api/tickets/[id]         # Update ticket (transfer)
GET    /api/tickets/[id]/qr      # Get QR code
```

### Orders
```
POST   /api/orders               # Create order
GET    /api/orders/[id]          # Get order details
PUT    /api/orders/[id]/cancel   # Cancel order
POST   /api/orders/[id]/refund   # Request refund
```

### Search
```
GET    /api/search               # Global search
GET    /api/search/events        # Search events
GET    /api/search/artists       # Search artists
GET    /api/search/venues        # Search venues
```

### QR Code
```
GET    /api/qr/[uuid]            # Generate QR code (SVG)
POST   /api/qr/validate          # Validate QR code
```

### Users
```
GET    /api/users/me             # Get current user
GET    /api/users/[id]           # Get user profile
PUT    /api/users/me             # Update profile
GET    /api/users/[id]/orders    # User's orders
```

Full API documentation coming soon with OpenAPI/Swagger specification.

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

⚠️ **Note:** Authentication and advanced security features are currently in development. Do not use in production without completing security hardening.

---

## 🚦 Development Status

| Component | Status | Timeline |
|-----------|--------|----------|
| Database Schema | ✅ Complete | - |
| Frontend Foundation | ✅ Complete | - |
| 3D Visualization | ✅ Complete | - |
| API Infrastructure | 🔄 In Progress | Week 1-2 |
| Authentication | 🔄 In Progress | Week 2-3 |
| Core Features | ⏳ Planned | Week 3-6 |
| Payment Integration | ⏳ Planned | Week 7-8 |
| Admin Dashboard | ⏳ Planned | Week 11-12 |

**Legend:** ✅ Complete | 🔄 In Progress | ⏳ Planned | ❌ Not Started

Full development roadmap available in [PROJECT_ANALYSIS.md](./PROJECT_ANALYSIS.md).

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

## 🛠️ Troubleshooting

### Dev server won't start
```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

### Database connection error
- Verify `DATABASE_URL` in `.env.local`
- Ensure MySQL server is running
- Check database credentials
- Confirm the database exists

### 3D visualization not rendering
- Check browser WebGPU support ([Can I Use](https://caniuse.com/webgpu))
- Try Chrome 113+ or Edge 113+
- Check browser console for errors
- Fallback message should appear if unsupported

### Port 3000 already in use
```bash
# Use a different port
npm run dev -- -p 3001
```

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

*Last updated: December 2025 | Version 0.1.0*
