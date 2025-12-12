# MostlyWhat Systems - CRM Platform

A comprehensive Customer Relationship Management (CRM) platform built with SvelteKit, featuring ticket management, project tracking, invoicing, and more.

## 🚀 Tech Stack

- **Framework**: SvelteKit 5 with TypeScript
- **UI Components**: shadcn-svelte (Radix UI primitives)
- **Database**: Supabase (PostgreSQL) with Drizzle ORM
- **Authentication**: Supabase Auth
- **Styling**: TailwindCSS with custom design system
- **Deployment**: Cloudflare Pages with Workers
- **Email**: Resend API
- **Payments**: Lemon Squeezy

## ✨ Features

### Core CRM Functionality
- **Ticket Management** - Full-featured support ticket system with SLA tracking
- **Project Management** - Project tracking with phases, milestones, and time tracking
- **Customer Management** - Organization and contact management
- **Invoicing** - Invoice generation with multiple payment methods
- **Knowledge Base** - Help articles and documentation system
- **Notifications** - Real-time in-app and email notifications

### Advanced Features
- **Role-Based Access Control** - Fine-grained permissions system
- **Activity Logging** - Comprehensive audit trail
- **Webhook System** - Event-driven integrations
- **API Keys** - RESTful API with key-based authentication
- **Automated Workflows** - Ticket auto-assignment and escalation
- **Search** - Advanced search with filters and saved searches
- **Reporting** - Analytics and custom reports

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](docs/) folder:

- **[Documentation Index](docs/INDEX.md)** - Start here for complete documentation navigation
- **[System Architecture](docs/architecture/SYSTEM_ARCHITECTURE.md)** - Technical architecture overview
- **[API Documentation](docs/guides/API_DOCUMENTATION.md)** - API endpoints and usage
- **[Quick Reference](docs/guides/QUICK_REFERENCE.md)** - Common tasks and patterns

## 🛠️ Development

### Prerequisites

- Node.js 20+ 
- pnpm 9+
- Supabase account (for database)
- Cloudflare account (for deployment)

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd Website
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=your_resend_api_key
# ... see .env.example for full list
```

4. **Set up the database**
```bash
# Run Supabase migrations
pnpm drizzle-kit push
```

See [Supabase Setup Guide](docs/guides/SUPABASE_SETUP.md) for detailed instructions.

5. **Start development server**
```bash
pnpm dev
```

Visit `http://localhost:5173` to see the app.

### Development Commands

```bash
# Development server
pnpm dev

# Type checking
pnpm check

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run tests
pnpm test

# Lint and format
pnpm lint
pnpm format

# Database operations
pnpm db:push       # Push schema changes
pnpm db:studio     # Open Drizzle Studio
pnpm db:generate   # Generate migrations
```

## 🏗️ Project Structure

```
Website/
├── src/
│   ├── lib/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── ui/          # shadcn-svelte components
│   │   │   ├── layout/      # Layout components
│   │   │   ├── settings/    # Settings components
│   │   │   └── payment/     # Payment components
│   │   ├── server/          # Server-side code
│   │   │   ├── auth/        # Authentication
│   │   │   ├── db/          # Database schema & client
│   │   │   ├── tickets/     # Ticket management
│   │   │   ├── invoices/    # Invoice management
│   │   │   ├── projects/    # Project management
│   │   │   ├── integrations/# External integrations
│   │   │   ├── notifications/# Notification system
│   │   │   └── utils/       # Shared utilities
│   │   ├── stores/          # Svelte stores
│   │   └── utils/           # Client utilities
│   ├── routes/              # SvelteKit routes
│   │   ├── (app)/           # Authenticated app routes
│   │   ├── (admin)/         # Admin-only routes
│   │   ├── (auth)/          # Authentication routes
│   │   ├── (marketing)/     # Public marketing pages
│   │   └── api/             # API endpoints
│   └── app.html             # HTML template
├── docs/                    # Documentation
│   ├── architecture/        # System architecture docs
│   ├── guides/              # Developer guides
│   ├── implementation/      # Implementation details
│   └── reports/             # Completion reports
├── static/                  # Static assets
├── supabase/                # Database migrations
└── tests/                   # Test files
```

## 🚀 Deployment

### Cloudflare Pages

1. **Build the project**
```bash
pnpm build
```

2. **Deploy to Cloudflare**
```bash
pnpm deploy
```

See [Testing & Deployment Checklist](docs/guides/TESTING_DEPLOYMENT_CHECKLIST.md) for complete deployment guide.

## 🔐 Security

- All sensitive operations require authentication
- Role-based access control (RBAC) for admin features
- Row-Level Security (RLS) enabled on all database tables
- API keys with scope-based permissions
- Activity logging for audit trails
- GDPR compliance features built-in

See [Security Recommendations](docs/guides/SECURITY_RECOMMENDATIONS.md) for details.

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run specific test file
pnpm test path/to/test.ts
```

## 📝 Code Style

This project uses:
- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Svelte 5** runes for reactivity

## 🤝 Contributing

1. Follow the existing code style
2. Write tests for new features
3. Update documentation as needed
4. Ensure all type checks pass (`pnpm check`)
5. Follow [Design System](docs/architecture/DESIGN_SYSTEM.md) guidelines

## 📄 License

[Your License Here]

## 🆘 Support

- **Documentation**: Check the [docs](docs/) folder
- **Issues**: Open an issue on GitHub
- **Quick Reference**: See [Quick Reference](docs/guides/QUICK_REFERENCE.md)

---

Built with ❤️ using SvelteKit
