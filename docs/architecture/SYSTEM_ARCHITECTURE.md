# MostlyWhat Systems' Horizon Architecture

> **Purpose**: This document provides a comprehensive guide to building full-stack SaaS applications using the **Horizon Architecture** - a production-ready stack built on SvelteKit, Supabase, and Cloudflare Workers. It is designed for LLM consumption to replicate or extend this architecture, and as a developer reference for building robust web applications.

## 🎨 Customization Notice

**This architecture is a foundation, not a template.** While the core patterns (authentication, database, deployment) are production-ready, the following should be customized for your specific use case:

- **Styles & Design System**: Tailwind configuration, color palettes, typography, and component styling in `src/routes/css/` and `src/lib/components/ui/`
- **Database Schema**: Tables, columns, relationships, and enums in `src/lib/server/db/schema.ts`
- **Business Logic**: Domain-specific features, workflows, and validation rules
- **Email Templates**: HTML email designs and content in `src/lib/server/email.ts`
- **UI Components**: Build on top of `components/ui` (shadcn-svelte) - reuse and compose existing components rather than creating new ones unless necessary

The architecture provides standardized **layout patterns**, **payment workflows**, and **email notification systems** as starting points. Extend and adapt them to your requirements.

---

## Quick Reference Links

Before diving into the architecture, these resources are essential for getting started:

| Resource | Purpose | Link |
|----------|---------|------|
| **Cloudflare Workers + Svelte** | Edge deployment guide | [developers.cloudflare.com/workers/framework-guides/web-apps/svelte](https://developers.cloudflare.com/workers/framework-guides/web-apps/svelte/) |
| **Supabase Svelte Server-Side Setup** | Setting Up Supabase | [supabase.com/docs/guides/auth/server-side/creating-a-client](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=package-manager&package-manager=pnpm&queryGroups=framework&framework=sveltekit) |
| **Supabase + SvelteKit Tutorial** | Authentication & database setup | [Davis-Media/supabase-sveltekit-2024-tutorial](https://github.com/Davis-Media/supabase-sveltekit-2024-tutorial) |
| **shadcn-svelte** | UI component library | [shadcn-svelte.com/docs/installation/sveltekit](https://www.shadcn-svelte.com/docs/installation/sveltekit) |
| **Drizzle ORM** | Type-safe database access | [drizzle-orm.com/docs/usage/sveltekit](https://drizzle-orm.com/docs/usage/sveltekit) |
| **Paraglide (inlang)** | Type-safe internationalization | [inlang.com/docs/getting-started/sveltekit](https://inlang.com/docs/getting-started/sveltekit) |
| **Sentry for SvelteKit** | Error monitoring setup for SvelteKit with Cloudflare | [docs.sentry.io/platforms/javascript/guides/cloudflare/frameworks/sveltekit](https://docs.sentry.io/platforms/javascript/guides/cloudflare/frameworks/sveltekit/) |

### MCP Server Tools

This project uses Model Context Protocol (MCP) servers for AI-assisted development:

- **Svelte MCP Server**: Official Svelte documentation server for accurate Svelte 5 patterns and runes
- **Sentry MCP Server**: Error monitoring integration for production debugging

---

## Table of Contents

1. [Technology Stack](#1-technology-stack)
2. [Project Structure](#2-project-structure)
3. [Authentication System](#3-authentication-system)
4. [Authorization & Route Protection](#4-authorization--route-protection)
5. [Database Architecture](#5-database-architecture)
6. [Design System](#6-design-system)
7. [Layout Components](#7-layout-components)
8. [Email & Notifications](#8-email--notifications)
9. [Payment Systems](#9-payment-systems)
10. [Internationalization (i18n)](#10-internationalization-i18n)
11. [Error Monitoring](#11-error-monitoring)
12. [API Design](#12-api-design)
13. [Security Principles](#13-security-principles)
14. [Deployment Architecture](#14-deployment-architecture)
15. [Common Patterns](#15-common-patterns)

---

## 1. Technology Stack

### Core Framework
```
SvelteKit 2.x          - Full-stack framework (SSR + SPA hybrid)
Svelte 5.x             - UI framework with runes ($state, $derived, $effect)
TypeScript             - Type safety throughout
```

### Database & Auth
```
Supabase               - PostgreSQL database + Auth service
Drizzle ORM            - Type-safe SQL query builder
PostgreSQL             - Primary database (via Supabase)
```

### Styling & UI
```
Tailwind CSS 4.x       - Utility-first CSS
shadcn-svelte (bits-ui) - Headless component library
Lucide Icons           - Icon library
```

### Deployment
```
Cloudflare Workers     - Edge runtime (serverless)
Cloudflare Pages       - Static asset hosting
Wrangler               - Cloudflare CLI tool
```

### Monitoring & i18n
```
Sentry                 - Error tracking & monitoring
Paraglide (inlang)     - Type-safe i18n
```

### Build Tools
```
Vite 7.x               - Build tool & dev server
pnpm                   - Package manager
ESLint + Prettier      - Code quality
```

---

## 2. Project Structure

```
src/
├── app.d.ts                    # Global TypeScript declarations
├── app.html                    # HTML template
├── hooks.server.ts             # Server hooks (middleware)
├── hooks.ts                    # Shared hooks
│
├── lib/
│   ├── components/
│   │   ├── layout/             # Layout components (organized by type)
│   │   │   ├── page/           # Page layouts (Create, Detail, Edit, Slug)
│   │   │   ├── section/        # Section components (Hero, CTA, Description)
│   │   │   ├── navigation/     # Header, Footer, MobileNav
│   │   │   ├── form/           # Form layouts and components
│   │   │   └── index.ts        # Centralized exports
│   │   ├── section/            # Legacy - use layout/section instead
│   │   └── ui/                 # shadcn-svelte UI components
│   ├── config/
│   │   └── site.ts             # Site configuration
│   ├── server/
│   │   ├── auth.ts             # Auth helper functions
│   │   ├── email.ts            # Email notification system
│   │   ├── db/
│   │   │   ├── index.ts        # Database client factory (createDb)
│   │   │   └── schema.ts       # Drizzle schema definitions
│   │   ├── invoices/           # Payment and invoicing logic
│   │   │   ├── index.ts        # Invoice utilities
│   │   │   ├── recurring.ts    # Recurring billing & reminders
│   │   │   └── wire-transfer.ts # Wire transfer workflows
│   │   ├── notifications/      # Notification templates
│   │   └── activity-logger.ts  # Audit logging
│   ├── stores/                 # Svelte stores
│   ├── utils/                  # Utility functions
│   └── paraglide/              # Generated i18n files
│
├── routes/
│   ├── (admin)/admin/          # Admin panel routes (grouped)
│   ├── (app)/app/              # Customer app routes (grouped)
│   ├── (auth)/auth/            # Authentication routes (grouped)
│   ├── (marketing)/            # Public marketing pages (grouped)
│   ├── api/                    # API endpoints
│   │   ├── contact/            # Contact form submissions
│   │   ├── lemon-squeezy/      # Payment webhook handler
│   │   └── cron/               # Scheduled tasks (invoices, reminders)
│   ├── onboarding/             # Onboarding flow
│   └── css/                    # Global CSS files
│
├── messages/                   # i18n translation files
├── supabase/                   # Supabase config & migrations
└── static/                     # Static assets
```

### Route Groups
SvelteKit route groups `(groupname)` allow shared layouts without affecting URL structure:
- `(admin)` - Admin panel with sidebar navigation
- `(app)` - Customer dashboard with different layout
- `(auth)` - Authentication pages (login, register, etc.)
- `(marketing)` - Public pages with marketing header/footer

---

## 3. Authentication System

### Overview
Authentication is handled by **Supabase Auth** with profile data stored in a custom `profiles` table. The system supports:
- Email/Password login
- Magic link (passwordless) login
- OAuth providers (configurable)
- Password reset flow

### Auth Flow Diagram
```
User Action          Server                         Database
    │                   │                              │
    ├──Login POST──────►│                              │
    │                   ├──Supabase.signIn()──────────►│
    │                   │◄─────Session + JWT───────────┤
    │                   │                              │
    │                   ├──getOrCreateProfile()───────►│
    │                   │◄─────Profile data────────────┤
    │                   │                              │
    │◄──Redirect────────┤                              │
    │   (onboarding     │                              │
    │    or dashboard)  │                              │
```

### Key Files

#### `src/hooks.server.ts` - Server Middleware
```typescript
// Middleware chain (executed in order)
export const handle = sequence(
  initSentry,           // 1. Error tracking
  sentryHandle(),       // 2. Sentry request tracking
  handleParaglide,      // 3. i18n locale detection
  handleSupabase,       // 4. Auth session management
  handleRouteProtection // 5. Route access control
);
```

#### `handleSupabase` Middleware
```typescript
const handleSupabase: Handle = async ({ event, resolve }) => {
  // 1. Create Supabase client for this request
  event.locals.supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => event.cookies.getAll(),
      setAll: (cookies) => { /* set cookies */ }
    }
  });

  // 2. Safe session getter (validates JWT)
  event.locals.safeGetSession = async () => {
    const { session } = await supabase.auth.getSession();
    if (!session) return { session: null, user: null };
    
    // IMPORTANT: Validate JWT by calling getUser()
    const { user, error } = await supabase.auth.getUser();
    if (error) return { session: null, user: null };
    
    return { session, user };
  };

  // 3. Get session and user
  const { session, user } = await event.locals.safeGetSession();
  event.locals.session = session;
  event.locals.user = user;

  // 4. Fetch profile from database
  if (user) {
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.id, user.id)
    });
    event.locals.profile = profile ?? null;
  }

  return resolve(event);
};
```

#### `src/lib/server/auth.ts` - Auth Helpers
```typescript
// Get or create profile after authentication
export async function getOrCreateProfile(user: User): Promise<Profile> {
  // Try to get existing profile
  const existing = await db.query.profiles.findFirst({
    where: eq(profiles.id, user.id)
  });

  if (existing) {
    // Update last login timestamp
    await db.update(profiles)
      .set({ lastLoginAt: new Date() })
      .where(eq(profiles.id, user.id));
    return existing;
  }

  // Create new profile with defaults
  const [created] = await db.insert(profiles)
    .values({
      id: user.id,
      email: user.email,
      role: 'customer',
      onboardingCompleted: false,
      preferences: DEFAULT_PREFERENCES
    })
    .onConflictDoUpdate({
      target: profiles.id,
      set: { lastLoginAt: new Date() }
    })
    .returning();

  return created;
}
```

### Auth Callback Handler
Located at `/auth/callback`, handles:
- OAuth code exchange
- Magic link token verification
- Email verification
- Password reset tokens

```typescript
// src/routes/(auth)/auth/callback/+server.ts
export const GET = async ({ url, locals: { supabase } }) => {
  const code = url.searchParams.get('code');
  const token_hash = url.searchParams.get('token_hash');
  const type = url.searchParams.get('type');

  // Handle OAuth code exchange
  if (code) {
    const { data } = await supabase.auth.exchangeCodeForSession(code);
    if (data.user) {
      const profile = await getOrCreateProfile(data.user);
      if (!profile.onboardingCompleted) {
        redirect(303, '/onboarding');
      }
    }
    redirect(303, '/app');
  }

  // Handle magic link / email verification
  if (token_hash && type) {
    const { data } = await supabase.auth.verifyOtp({ token_hash, type });
    // Similar profile handling...
  }
};
```

---

## 4. Authorization & Route Protection

### Defense-in-Depth Strategy
Protection is implemented at **multiple layers** to prevent unauthorized access:

```
Layer 1: hooks.server.ts (handleRouteProtection)
    ↓
Layer 2: Layout server load functions (+layout.server.ts)
    ↓
Layer 3: Page server load functions (+page.server.ts)
    ↓
Layer 4: API route handlers (+server.ts)
```

### Route Protection Middleware
```typescript
// src/hooks.server.ts
const handleRouteProtection: Handle = async ({ event, resolve }) => {
  const { pathname } = event.url;
  const { user, profile } = event.locals;

  // Categorize routes
  const isAuthRoute = pathname.startsWith('/auth');
  const isAppRoute = pathname.startsWith('/app');
  const isAdminRoute = pathname.startsWith('/admin');
  const isOnboardingRoute = pathname.startsWith('/onboarding');
  const isApiRoute = pathname.startsWith('/api');

  // Skip API routes (they handle their own auth)
  if (isApiRoute) return resolve(event);

  // Auth routes: Redirect logged-in users away
  if (isAuthRoute && !pathname.includes('/logout') && !pathname.includes('/callback')) {
    if (user) {
      if (profile && !profile.onboardingCompleted) {
        return redirect(302, '/onboarding');
      }
      const dest = isStaffRole(profile) ? '/admin' : '/app';
      return redirect(302, dest);
    }
  }

  // Protected routes: Require authentication
  if (isAppRoute || isAdminRoute || isOnboardingRoute) {
    // Must be logged in
    if (!user) {
      return redirect(302, `/auth/login?redirectTo=${pathname}`);
    }

    // Must have profile (except onboarding)
    if (!isOnboardingRoute && !profile) {
      return redirect(302, '/onboarding');
    }

    // Must complete onboarding (except onboarding route)
    if (!isOnboardingRoute && profile && !profile.onboardingCompleted) {
      return redirect(302, '/onboarding');
    }

    // Admin routes: Require staff role
    if (isAdminRoute) {
      const allowedRoles = ['super_admin', 'admin', 'staff'];
      if (!profile || !allowedRoles.includes(profile.role)) {
        return redirect(302, '/app');
      }
    }
  }

  return resolve(event);
};
```

### Layout-Level Protection (Redundancy)
```typescript
// src/routes/(app)/app/+layout.server.ts
export const load: LayoutServerLoad = async ({ locals }) => {
  // Redundant checks for defense-in-depth
  if (!locals.user) {
    redirect(303, '/auth/login?redirectTo=/app');
  }
  if (!locals.profile) {
    redirect(303, '/onboarding');
  }
  if (!locals.profile.onboardingCompleted) {
    redirect(303, '/onboarding');
  }

  // Load layout data...
  return { user, profile, announcements };
};
```

### User Roles
```typescript
type UserRole = 'super_admin' | 'admin' | 'staff' | 'customer';

// Role hierarchy:
// super_admin - Full system access
// admin       - Admin panel access, manage users
// staff       - Admin panel access, limited permissions
// customer    - App access only
```

### Onboarding Flow
Users must complete onboarding before accessing the app:

1. **Profile Creation**: Handled by `getOrCreateProfile()` during auth
2. **Onboarding Form**: Collects name, preferences
3. **Completion**: Sets `onboardingCompleted: true` in database

**Critical Fix**: After form submission, use full page reload to refresh `locals.profile`:
```typescript
// src/routes/onboarding/+page.svelte
use:enhance={() => {
  return async ({ result }) => {
    if (result.type === 'redirect') {
      // Force full page load to refresh profile data
      await invalidateAll();
      window.location.href = result.location;
      return;
    }
  };
}}
```

---

## 5. Database Architecture

### Cloudflare Workers Compatibility

⚠️ **CRITICAL**: Cloudflare Workers have strict request isolation. Each request runs in its own context and **cannot share I/O objects** (like database connections) with other requests.

If you use a module-level database connection:
```typescript
// ❌ ANTI-PATTERN: This causes "Cannot perform I/O on behalf of a different request"
const client = postgres(DATABASE_URL);
export const db = drizzle(client, { schema });
```

This will cause errors like:
```
Cannot perform I/O on behalf of a different request
```

### Solution: Per-Request Database Connections

```typescript
// src/lib/server/db/index.ts
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

export type DbSchema = typeof schema;
export type Database = PostgresJsDatabase<DbSchema>;

/**
 * Creates a new database connection per request.
 * Call this within request handlers (load functions, actions, API routes).
 */
export function createDb(): Database {
    if (!env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not set');
    }

    const client = postgres(env.DATABASE_URL, {
        max: 1,           // Single connection per instance
        idle_timeout: 20, // Close idle connections after 20s
        connect_timeout: 10, // Connection timeout
        prepare: false,   // Required for Supavisor connection pooler
    });

    return drizzle(client, { schema });
}

// Legacy export for backwards compatibility (deprecated)
export const db = createDb();
```

### Usage Patterns

#### Pattern 1: Via `event.locals.db` (Recommended for SSR)
Set up the database in hooks and access via locals:

```typescript
// src/hooks.server.ts
import { createDb, type Database } from '$lib/server/db';

const handleSupabase: Handle = async ({ event, resolve }) => {
    // Create per-request database connection
    const db = createDb();
    event.locals.db = db;
    
    // ... rest of middleware
    return resolve(event);
};
```

```typescript
// src/routes/(app)/app/+layout.server.ts
export const load: LayoutServerLoad = async ({ locals }) => {
    const { db, profile } = locals;
    
    const projects = await db.query.projects.findMany({
        where: eq(projects.organizationId, profile.activeOrganizationId)
    });
    
    return { projects };
};
```

#### Pattern 2: Direct `createDb()` Call (For Actions/API Routes)
```typescript
// src/routes/api/contact/+server.ts
import { createDb } from '$lib/server/db';

export const POST = async ({ request }) => {
    const db = createDb();
    
    const [contact] = await db.insert(contactSubmissions)
        .values({ ... })
        .returning();
    
    return json({ success: true, id: contact.id });
};
```

### App.Locals Type Definition
```typescript
// src/app.d.ts
import type { Database } from '$lib/server/db';

declare global {
    namespace App {
        interface Locals {
            db: Database;
            supabase: SupabaseClient;
            safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
            session: Session | null;
            user: User | null;
            profile: Profile | null;
        }
    }
}
```

### Connection Settings Explained

| Setting | Value | Reason |
|---------|-------|--------|
| `max` | 1 | Single connection per Worker instance |
| `idle_timeout` | 20 | Prevent connection pool exhaustion |
| `connect_timeout` | 10 | Fast fail for unresponsive database |
| `prepare` | false | **Required** for Supavisor pooler (transaction mode) |

### ORM: Drizzle

### Schema Pattern
```typescript
// src/lib/server/db/schema.ts

// NOTE: Import authUsers from Supabase auth schema in drizzle
import { authUsers } from 'drizzle-orm/supabase';

// 1. Define enums
export const userRoleEnum = pgEnum('user_role', [
  'super_admin', 'admin', 'staff', 'customer'
]);

// 2. Define tables with RLS enabled
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().references(() => authUsers.id),
  email: text('email').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  role: userRoleEnum('role').default('customer').notNull(),
  onboardingCompleted: boolean('onboarding_completed').default(false),
  preferences: jsonb('preferences').$type<PreferencesType>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}).enableRLS();

// 3. Define relations
export const profilesRelations = relations(profiles, ({ many }) => ({
  organizationMembers: many(organizationMembers)
}));
```

### Key Tables (Multi-Tenant SaaS Pattern)

The database schema follows a multi-tenant pattern where resources are scoped to tenants (organizations):

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CORE TABLES                                   │
├─────────────────────────────────────────────────────────────────────────┤
│ profiles              - User data (extends Supabase auth.users)         │
│ organizations         - Tenant/workspace entities                       │
│ organization_members  - Many-to-many: users ↔ organizations (with role) │
├─────────────────────────────────────────────────────────────────────────┤
│                        BUSINESS DOMAIN TABLES                           │
├─────────────────────────────────────────────────────────────────────────┤
│ projects              - Scoped to organization                          │
│ proposals             - Scoped to organization                          │
│ invoices              - Scoped to organization                          │
│ tickets               - Support tickets, scoped to organization         │
├─────────────────────────────────────────────────────────────────────────┤
│                          SYSTEM TABLES                                  │
├─────────────────────────────────────────────────────────────────────────┤
│ activity_log          - Audit trail for compliance                      │
│ announcements         - System-wide or targeted notifications           │
│ contact_submissions   - Public contact form submissions                 │
│ file_uploads          - File metadata storage                           │
└─────────────────────────────────────────────────────────────────────────┘
```

**Key Design Principles:**
- Every tenant-scoped table has an `organizationId` foreign key
- Users can belong to multiple organizations with different roles
- Activity logging captures who did what, when, and to which resource
- All tables use UUIDs for primary keys (compatible with Supabase auth)

### Row Level Security (RLS)
Enable RLS on tables for Supabase security:
```typescript
.enableRLS()
```

Policies are managed via SQL migrations in `supabase/migrations/`.

---

## 6. Design System

### Design Principles
1. **Sharp Industrial Aesthetic**: No rounded corners (`--radius: 0`)
2. **Dark-First Design**: Dark mode as primary
3. **Monospace Accents**: Technical, precise typography
4. **High Contrast**: Accessibility-focused color choices

### Color Palette (OKLCH)
```css
:root {
  /* Primary: Cobalt Blue */
  --cobalt-500: oklch(0.58 0.20 230);
  
  /* Accent: Yellow */
  --yellow-500: oklch(0.87 0.18 95);
  
  /* Destructive: Red */
  --red-500: oklch(0.63 0.24 25);
  
  /* Background: Deep Black */
  --black-950: oklch(0.06 0.02 260);
}
```

### Typography
```css
:root {
  --font-display: "Tourney", system-ui;      /* Headlines */
  --font-body: "Hubot Sans Variable";         /* Body text */
  --font-ui: "Chakra Petch";                  /* UI elements */
  --font-mono: "JetBrains Mono Variable";     /* Code/technical */
}
```

### Component Library
Using **shadcn-svelte** (bits-ui) with custom styling:

```
src/lib/components/ui/
├── button/           # Button variants
├── input/            # Form inputs
├── dialog/           # Modal dialogs
├── sheet/            # Slide-out panels
├── data-table/       # Sortable tables
├── form/             # Form components
└── ...               # 60+ components
```

### Button Example
```svelte
<script lang="ts">
  import { Button } from '$lib/components/ui/button';
</script>

<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
```

---

## 7. Layout Components

### Organized Structure
Layout components are now organized into logical subdirectories for better maintainability and reusability:

```
src/lib/components/layout/
├── page/              # Page-level layouts (standardized patterns)
│   ├── CreatePageLayout.svelte    # For /new routes (forms)
│   ├── DetailPageLayout.svelte    # For /[id] routes (view mode)
│   ├── EditPageLayout.svelte      # For /[id]/edit routes
│   ├── PageHeader.svelte          # Page header component
│   └── SlugPageLayout.svelte      # For dynamic [slug] routes
├── section/           # Reusable section components
│   ├── HeroSection.svelte         # Hero/banner sections
│   ├── DescriptionSection.svelte  # Content description blocks
│   ├── CTASection.svelte          # Call-to-action sections
│   ├── CapabilitiesSection.svelte # Feature showcases
│   ├── LinkCTASection.svelte      # CTA with navigation links
│   ├── WideNavSection.svelte      # Wide navigation sections
│   ├── BackLinkSection.svelte     # Back navigation links
│   ├── BackToSection.svelte       # Return navigation
│   ├── SectionHeader.svelte       # Section headers
│   ├── Section.svelte             # Generic section wrapper
│   └── SidebarSection.svelte      # Sidebar sections
├── navigation/        # Navigation components
│   ├── Header.svelte              # Main site header
│   ├── Footer.svelte              # Main site footer
│   └── MobileNav.svelte           # Mobile navigation
├── form/              # Form layouts and components
│   ├── FormLayout.svelte          # Form wrapper layout
│   ├── MobileForm.svelte          # Mobile-optimized forms
│   └── FieldLabel.svelte          # Form field labels
├── [utility components]           # Additional layout utilities
└── index.ts                       # Centralized exports
```

### Usage Pattern

**Always use named imports from the central index:**
```typescript
// ✅ Recommended: Import from index
import { CreatePageLayout, HeroSection, Header } from '$lib/components/layout';

// ❌ Avoid: Direct imports (harder to refactor)
import CreatePageLayout from '$lib/components/layout/page/CreatePageLayout.svelte';
```

### Standardized Page Layouts

#### CreatePageLayout (for `/new` routes)
```svelte
<script lang="ts">
  import { CreatePageLayout } from '$lib/components/layout';
</script>

<CreatePageLayout
  title="Create New Project"
  description="Fill out the form below to create a new project"
  backLink="/app/projects"
  backLabel="Back to Projects"
>
  <!-- Form content goes here -->
  <form method="POST">
    <!-- ... -->
  </form>
</CreatePageLayout>
```

**Reference implementation:** `/admin/blog/new/+page.svelte`

#### DetailPageLayout (for `/[id]` routes)
```svelte
<script lang="ts">
  import { DetailPageLayout } from '$lib/components/layout';
</script>

<DetailPageLayout
  title={project.name}
  subtitle={project.description}
  backLink="/app/projects"
  editLink="/app/projects/{project.id}/edit"
>
  <!-- Detail content goes here -->
</DetailPageLayout>
```

#### EditPageLayout (for `/[id]/edit` routes)
```svelte
<script lang="ts">
  import { EditPageLayout } from '$lib/components/layout';
</script>

<EditPageLayout
  title="Edit Project"
  backLink="/app/projects/{project.id}"
>
  <!-- Edit form goes here -->
</EditPageLayout>
```

### Component Composition Philosophy

**Reuse before creating new components:**

1. **Check `components/ui` first**: shadcn-svelte provides 60+ accessible, styled components
2. **Compose existing components**: Combine UI components to create new patterns
3. **Only create new components when**: Existing components can't achieve the desired functionality

Example of good composition:
```svelte
<!-- Instead of creating a new "ProjectCard" component -->
<Card.Root>
  <Card.Header>
    <Card.Title>{project.name}</Card.Title>
    <Card.Description>{project.description}</Card.Description>
  </Card.Header>
  <Card.Content>
    <Badge>{project.status}</Badge>
  </Card.Content>
  <Card.Footer>
    <Button href="/app/projects/{project.id}">View Details</Button>
  </Card.Footer>
</Card.Root>
```

### Migration from CRUD Layouts

**Deprecated components (removed):**
- `CrudCreateLayout.svelte` → Use `CreatePageLayout`
- `CrudDetailLayout.svelte` → Use `DetailPageLayout`
- `CrudEditLayout.svelte` → Use `EditPageLayout`

All routes have been migrated to use the new standardized layouts.

---

## 8. Email & Notifications

### Email System Architecture

The application uses **nodemailer** with Office 365 SMTP for reliable email delivery. All email functions are located in `src/lib/server/email.ts`.

#### SMTP Configuration
```typescript
// src/lib/server/email.ts
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST || 'smtp.office365.com',
  port: parseInt(env.SMTP_PORT || '587'),
  secure: false, // Use TLS
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD
  }
});
```

**Environment variables required:**
```bash
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASSWORD=your-password
SMTP_FROM_NAME=Your Company Name
SMTP_FROM_EMAIL=noreply@yourdomain.com
```

### Core Email Functions

#### 1. Generic Email Sender
```typescript
export async function sendEmail(options: EmailOptions): Promise<void> {
  const mailOptions: SendMailOptions = {
    from: `${env.SMTP_FROM_NAME} <${env.SMTP_FROM_EMAIL}>`,
    to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
    subject: options.subject,
    html: options.html,
    text: options.text || stripHtml(options.html),
    replyTo: options.replyTo
  };
  
  await transporter.sendMail(mailOptions);
}
```

#### 2. Contact Form Notifications
```typescript
await sendContactNotification({
  name: 'John Doe',
  email: 'john@example.com',
  company: 'Acme Corp',
  phone: '+1234567890',
  topic: 'General Inquiry',
  message: 'I would like to discuss...',
  submissionId: 123
});
```

Sends formatted email to admin with:
- Contact details
- Message content
- Link to admin dashboard
- Reply-to set to customer's email

#### 3. Payment Confirmations
```typescript
await sendPaymentConfirmation({
  customerEmail: 'customer@example.com',
  customerName: 'Jane Smith',
  amount: 99.00,
  currency: 'USD',
  invoiceNumber: 'INV-001',
  paymentDate: new Date(),
  paymentMethod: 'Credit Card'
});
```

Automated email sent after successful payment processing.

#### 4. Wire Transfer Workflows

**Approval Request (to admin):**
```typescript
await sendWireTransferApprovalRequest({
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  invoiceNumber: 'INV-001',
  amount: 5000.00,
  currency: 'USD',
  referenceNumber: 'WIRE-123',
  transferDate: new Date(),
  bankDetails: 'Account ending in 1234'
});
```

**Confirmation (to customer):**
```typescript
await sendWireTransferConfirmation({
  customerEmail: 'john@example.com',
  customerName: 'John Doe',
  invoiceNumber: 'INV-001',
  amount: 5000.00,
  currency: 'USD',
  approvedDate: new Date(),
  expectedProcessingDays: 3
});
```

**Rejection (to customer):**
```typescript
await sendWireTransferRejection({
  customerEmail: 'john@example.com',
  customerName: 'John Doe',
  invoiceNumber: 'INV-001',
  amount: 5000.00,
  currency: 'USD',
  reason: 'Invalid bank details provided'
});
```

#### 5. Notification Emails (In-App)
```typescript
await sendNotificationEmail({
  to: 'user@example.com',
  subject: 'New message received',
  title: 'You have a new message',
  message: 'John Doe sent you a message...',
  actionUrl: 'https://app.example.com/messages/123',
  actionLabel: 'View Message'
});
```

Generic template for in-app notification emails with call-to-action button.

#### 6. Survey Emails
```typescript
await sendSurveyEmail({
  to: 'customer@example.com',
  subject: 'How was your experience?',
  message: 'We would love to hear your feedback',
  surveyUrl: 'https://app.example.com/surveys/abc123'
});
```

### Email Template Best Practices

1. **HTML + Plain Text**: Always provide both HTML and plain text versions
2. **Responsive Design**: Use inline styles and table layouts for email compatibility
3. **Clear CTAs**: Single, prominent call-to-action button
4. **Branding**: Include company logo and colors (customizable in template)
5. **Mobile-First**: Test on mobile devices (60%+ of email opens)

### Email Template Customization

All email templates are in `src/lib/server/email.ts`. To customize:

1. **Colors & Branding**: Update inline styles
2. **Content**: Modify HTML strings in each function
3. **Layout**: Adjust table structures for different designs
4. **Footer**: Add company info, social links, unsubscribe options

Example customization:
```typescript
const html = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <!-- Your custom branding header -->
    <div style="background-color: #1a1a1a; padding: 20px; text-align: center;">
      <img src="https://yourdomain.com/logo.png" alt="Logo" style="height: 40px;">
    </div>
    
    <!-- Email content -->
    <div style="padding: 40px 20px;">
      ${content}
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f5f5f5; padding: 20px; text-align: center;">
      <p style="color: #666; font-size: 12px;">© 2025 Your Company</p>
    </div>
  </div>
`;
```

---

## 9. Payment Systems

### Payment Architecture

The application supports multiple payment methods with automated workflows:

1. **LemonSqueezy Integration** - Primary payment gateway for credit card payments
2. **Wire Transfers** - Manual approval workflow for large transactions
3. **Recurring Billing** - Automated invoice generation and payment reminders

### LemonSqueezy Webhook Handler

Located at `src/routes/api/lemon-squeezy/webhook/+server.ts`:

```typescript
export const POST: RequestHandler = async ({ request }) => {
  const signature = request.headers.get('x-signature');
  
  // 1. Verify webhook signature
  const isValid = verifySignature(payload, signature, WEBHOOK_SECRET);
  if (!isValid) {
    error(401, 'Invalid signature');
  }
  
  // 2. Handle event type
  switch (event.meta.event_name) {
    case 'order_created':
      // Process new order
      break;
      
    case 'subscription_created':
      // Handle new subscription
      break;
      
    case 'subscription_payment_success':
      // Mark invoice as paid
      await db.update(invoices)
        .set({ 
          status: 'paid',
          paidAt: new Date()
        })
        .where(eq(invoices.id, invoiceId));
      
      // Send payment confirmation
      await sendPaymentConfirmation({ ... });
      break;
  }
  
  return json({ received: true });
};
```

**Security requirements:**
- Verify webhook signature on every request
- Use HTTPS-only endpoints
- Store webhook secret in environment variables
- Log all webhook events for audit trail

### Wire Transfer Workflow

Located in `src/lib/server/invoices/wire-transfer.ts`:

#### 1. Customer Submits Wire Transfer
```typescript
import { submitWireTransfer } from '$lib/server/invoices/wire-transfer';

const result = await submitWireTransfer({
  invoiceId: 'uuid',
  transferDate: new Date(),
  amount: 5000.00,
  currency: 'USD',
  referenceNumber: 'WIRE-123',
  bankDetails: 'Account ending in 1234',
  attachmentUrl: 'path/to/receipt.pdf'  // Optional
});
```

**Process:**
- Creates `wire_transfer_request` record with `pending` status
- Updates invoice to `pending_wire_transfer`
- Sends approval request email to admin
- Logs activity for audit trail

#### 2. Admin Reviews & Approves/Rejects
```typescript
// Approve
await approveWireTransfer({
  requestId: 'uuid',
  approvedById: adminUserId,
  notes: 'Verified with bank'
});

// Reject
await rejectWireTransfer({
  requestId: 'uuid',
  rejectedById: adminUserId,
  reason: 'Invalid reference number'
});
```

**Approval process:**
- Updates request status to `approved`
- Marks invoice as `paid`
- Records payment date and method
- Sends confirmation email to customer
- Logs approval activity

**Rejection process:**
- Updates request status to `rejected`
- Resets invoice to `sent` status
- Sends rejection email with reason
- Logs rejection activity

### Recurring Billing System

Located in `src/lib/server/invoices/recurring.ts`:

#### Scheduled Tasks (Cron Jobs)

**1. Generate Recurring Invoices:**
```typescript
// Run daily to generate invoices for upcoming billing dates
await generateRecurringInvoices();
```

Process:
- Queries active subscription invoices
- Checks if next billing date is within 3 days
- Creates new draft invoice for next period
- Updates subscription's last and next invoice dates
- Sends invoice email to customer

**2. Send Payment Reminders:**
```typescript
// Run daily to remind customers of overdue invoices
await sendPaymentReminders();
```

Reminder schedule:
- **7 days overdue**: First reminder
- **14 days overdue**: Second reminder
- **30 days overdue**: Final reminder
- Tracks sent reminders to avoid duplicates

**3. Process Overdue Invoices:**
```typescript
// Run daily to handle overdue payment actions
await processOverdueInvoices();
```

Actions:
- Identifies invoices >30 days overdue
- Suspends associated services
- Sends suspension notification
- Logs suspension activity

#### Cron Endpoint

Located at `src/routes/api/cron/invoices/+server.ts`:

```typescript
export const GET: RequestHandler = async ({ request }) => {
  // Verify Cloudflare Cron trigger
  const cronHeader = request.headers.get('cf-cron');
  if (cronHeader !== CRON_SECRET) {
    error(401, 'Unauthorized');
  }
  
  // Run all recurring tasks
  const results = await runRecurringTasks();
  
  return json(results);
};
```

**Setup in Cloudflare:**
```jsonc
// wrangler.jsonc
{
  "triggers": {
    "crons": ["0 0 * * *"]  // Daily at midnight UTC
  }
}
```

### Invoice Status Flow

```
draft → sent → (pending_wire_transfer) → paid
                     ↓ (if rejected)
                   sent → overdue → suspended
```

**Status definitions:**
- `draft`: Invoice created, not sent to customer
- `sent`: Invoice sent, awaiting payment
- `pending_wire_transfer`: Wire transfer submitted, awaiting approval
- `paid`: Payment received and confirmed
- `overdue`: Past due date, reminders being sent
- `cancelled`: Invoice cancelled by admin
- `suspended`: Services suspended due to non-payment

### Payment Email Integration

All payment workflows automatically trigger appropriate emails:

| Event | Email Function | Recipients |
|-------|---------------|-----------|
| Invoice created | `sendInvoiceEmail()` | Customer |
| Payment received | `sendPaymentConfirmation()` | Customer |
| Wire transfer submitted | `sendWireTransferApprovalRequest()` | Admin |
| Wire transfer approved | `sendWireTransferConfirmation()` | Customer |
| Wire transfer rejected | `sendWireTransferRejection()` | Customer |
| Payment reminder | `sendPaymentReminderEmail()` | Customer |

### Payment Customization

To adapt payment systems for your use case:

1. **Payment Methods**: Add/remove payment options in invoice creation forms
2. **Approval Workflows**: Customize wire transfer approval logic
3. **Reminder Schedule**: Adjust timing in `recurring.ts`
4. **Status Actions**: Modify what happens when invoices become overdue
5. **Email Templates**: Customize payment-related email content

---

## 10. Internationalization (i18n)

### Paraglide Setup
```json
// project.inlang/settings.json
{
  "baseLocale": "en",
  "locales": ["en", "th"],
  "plugin.inlang.messageFormat": {
    "pathPattern": "./messages/{locale}.json"
  }
}
```

### Message Files
```json
// messages/en.json
{
  "hello": "Hello",
  "welcome": "Welcome, {name}!"
}

// messages/th.json
{
  "hello": "สวัสดี",
  "welcome": "ยินดีต้อนรับ, {name}!"
}
```

### Usage in Components
```svelte
<script>
  import * as m from '$lib/paraglide/messages';
</script>

<h1>{m.hello()}</h1>
<p>{m.welcome({ name: 'User' })}</p>
```

### Middleware Integration
```typescript
// src/hooks.server.ts
const handleParaglide: Handle = ({ event, resolve }) =>
  paraglideMiddleware(event.request, ({ request, locale }) => {
    event.request = request;
    return resolve(event, {
      transformPageChunk: ({ html }) => 
        html.replace('%paraglide.lang%', locale)
    });
  });
```

---

## 11. Error Monitoring

### Sentry Integration for Cloudflare Workers
```typescript
// src/hooks.server.ts
import { initCloudflareSentryHandle, sentryHandle, handleErrorWithSentry } from '@sentry/sveltekit';

const initSentry = initCloudflareSentryHandle({
  dsn: env.PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0
});

export const handle = sequence(initSentry, sentryHandle(), ...);
export const handleError = handleErrorWithSentry();
```

### Wrangler Configuration
```jsonc
// wrangler.jsonc
{
  "compatibility_flags": ["nodejs_compat", "nodejs_als"],
  "version_metadata": {
    "binding": "CF_VERSION_METADATA"
  }
}
```

### Vite Plugin
```typescript
// vite.config.ts
import { sentrySvelteKit } from '@sentry/sveltekit';

export default defineConfig({
  plugins: [
    sentrySvelteKit({
      sourceMapsUploadOptions: {
        org: 'your-org',
        project: 'your-project'
      }
    }),
    sveltekit()
  ]
});
```

---

## 12. API Design

### API Route Pattern
```typescript
// src/routes/api/[resource]/+server.ts
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, url }) => {
  // 1. Auth check
  if (!locals.user || !locals.profile) {
    error(401, 'Authentication required');
  }

  // 2. Onboarding check
  if (!locals.profile.onboardingCompleted) {
    error(403, 'Please complete onboarding');
  }

  // 3. Business logic
  const data = await db.query.items.findMany();

  // 4. Return JSON response
  return json({ items: data });
};

export const POST: RequestHandler = async ({ request, locals }) => {
  // Validation, creation, response...
};
```

### File Upload Pattern
```typescript
// src/routes/api/upload/+server.ts
export const POST: RequestHandler = async ({ request, locals }) => {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  // Validate file type and size
  if (!ALLOWED_TYPES.includes(file.type)) {
    error(400, 'Invalid file type');
  }
  if (file.size > MAX_FILE_SIZE) {
    error(400, 'File too large');
  }

  // Upload to Supabase Storage
  const { data, error: uploadError } = await supabase.storage
    .from('uploads')
    .upload(path, file);

  // Create database record
  await db.insert(fileUploads).values({
    fileName: file.name,
    fileUrl: data.path,
    uploadedById: locals.user.id
  });

  return json({ success: true, url: data.path });
};
```

---

## 13. Security Principles

### 1. Defense in Depth
Protection at multiple layers:
- Server hooks (global middleware)
- Layout load functions (route group level)
- Page load functions (page level)
- API handlers (endpoint level)

### 2. Never Trust Client Data
```typescript
// Always validate and sanitize
const formData = await request.formData();
const email = formData.get('email');

// Validate with Zod or manual checks
if (!email || typeof email !== 'string') {
  return fail(400, { error: 'Invalid email' });
}
```

### 3. JWT Validation
```typescript
// Always validate JWT, don't just trust session
const { session } = await supabase.auth.getSession();
const { user, error } = await supabase.auth.getUser();

if (error) {
  // JWT is invalid or expired
  return { session: null, user: null };
}
```

### 4. Row Level Security
Enable RLS on all tables and never create policies for client-side access. All database access must go through server-side code.

### 5. Audit Logging
Log all sensitive actions:
```typescript
await logActivity({
  entityType: 'settings',
  entityId: key,
  activityType: 'updated',
  description: `Updated ${key}`,
  performedById: userId,
  previousValues: { [key]: oldValue },
  newValues: { [key]: newValue }
});
```

### 6. Redirect Loop Prevention
After state changes (like onboarding completion), force full page reload:
```typescript
// In form enhance handler
if (result.type === 'redirect') {
  await invalidateAll();
  window.location.href = result.location;  // Full reload, not client navigation
  return;
}
```

### 7. Webhook Security
Always verify webhook signatures:
```typescript
// LemonSqueezy webhook example
const signature = request.headers.get('x-signature');
const isValid = verifySignature(payload, signature, WEBHOOK_SECRET);
if (!isValid) {
  error(401, 'Invalid signature');
}
```

---

## 14. Deployment Architecture

### Cloudflare Workers
```jsonc
// wrangler.jsonc
{
  "name": "website",
  "main": ".svelte-kit/cloudflare/_worker.js",
  "compatibility_date": "2025-11-28",
  "compatibility_flags": ["nodejs_compat", "nodejs_als"],
  "assets": {
    "binding": "ASSETS",
    "directory": ".svelte-kit/cloudflare"
  },
  "vars": {
    "PUBLIC_SUPABASE_URL": "https://xxx.supabase.co",
    "PUBLIC_SITE_URL": "https://www.example.com"
  }
}
```

### Build & Deploy
```bash
# Development
pnpm dev

# Build for production
pnpm build

# Deploy to Cloudflare
pnpm deploy  # or: wrangler deploy
```

### Environment Variables
```bash
# Public (available in browser)
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
PUBLIC_SITE_URL=
PUBLIC_SENTRY_DSN=

# Private (server only)
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
SENTRY_AUTH_TOKEN=
```

---

## 15. Common Patterns

### Form Actions with Superforms
```typescript
// +page.server.ts
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email()
});

export const load = async () => {
  const form = await superValidate(zod(schema));
  return { form };
};

export const actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, zod(schema));
    if (!form.valid) return fail(400, { form });
    
    // Process form...
    return { form };
  }
};
```

### Data Table Pattern
```svelte
<script lang="ts">
  import { DataTable } from '$lib/components/ui/data-table';
  
  const columns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    {
      id: 'actions',
      cell: ({ row }) => /* action buttons */
    }
  ];
</script>

<DataTable {columns} data={items} />
```

### Toast Notifications
```svelte
<script>
  import { toast } from 'svelte-sonner';
  
  function handleSave() {
    toast.success('Saved successfully!');
  }
  
  function handleError() {
    toast.error('Something went wrong');
  }
</script>
```

### Confirmation Dialogs
```svelte
<script>
  import * as AlertDialog from '$lib/components/ui/alert-dialog';
</script>

<AlertDialog.Root>
  <AlertDialog.Trigger asChild let:builder>
    <Button builders={[builder]} variant="destructive">Delete</Button>
  </AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action onclick={handleDelete}>Delete</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
```

### Streaming Data with Skeleton Loading
For pages with data that may take time to load, use SvelteKit's streaming pattern to show skeleton UI immediately while data loads in the background.

**Server-side (+page.server.ts):**
```typescript
export const load = async ({ locals }) => {
  const { db } = locals;
  
  // Define async function that loads data
  async function loadUsersData() {
    const users = await db.query.profiles.findMany({
      orderBy: (profiles, { desc }) => [desc(profiles.createdAt)],
      limit: 100
    });
    return users;
  }
  
  // Return promise in streamed object - page renders immediately
  return {
    streamed: {
      users: loadUsersData()  // Promise, not awaited
    }
  };
};
```

**Client-side (+page.svelte):**
```svelte
<script lang="ts">
  import { Skeleton } from '$lib/components/ui/skeleton';
  
  let { data } = $props();
  let streamedUsers = $derived(data.streamed.users);
</script>

{#await streamedUsers}
  <!-- Skeleton loading state -->
  <div class="space-y-4">
    <Skeleton class="h-10 w-full" />
    <Skeleton class="h-10 w-full" />
    <Skeleton class="h-10 w-full" />
  </div>
{:then users}
  <!-- Actual content -->
  {#each users as user}
    <UserCard {user} />
  {/each}
{:catch error}
  <!-- Error state -->
  <p class="text-destructive">Failed to load: {error.message}</p>
{/await}
```

**Reference implementations:**
- `/app/projects` - Full streaming with skeleton cards
- `/admin/users` - Stats + user list skeletons
- `/app/tickets` - Ticket list skeletons

---

## Quick Start Checklist

When building a new application with the Horizon Architecture:

### 1. Initial Setup
- [ ] Create SvelteKit project with `npx sv create`
- [ ] Install dependencies (Tailwind, Drizzle, Supabase, etc.)
- [ ] Configure Cloudflare adapter (`@sveltejs/adapter-cloudflare`)
- [ ] Set up Supabase project

### 2. Authentication
- [ ] Create `hooks.server.ts` with Supabase middleware
- [ ] Implement `getOrCreateProfile()` helper
- [ ] Create auth routes (login, register, callback)
- [ ] Add route protection middleware

### 3. Database
- [ ] Create `createDb()` function for per-request connections
- [ ] Define Drizzle schema with RLS enabled
- [ ] Create profiles table linked to auth.users
- [ ] Set up migrations with `drizzle-kit`
- [ ] Configure connection pooler settings (`prepare: false`)

### 4. Route Groups
- [ ] Create `(auth)` group for auth pages
- [ ] Create `(app)` group for authenticated users
- [ ] Create `(admin)` group for staff (optional)
- [ ] Create `(marketing)` group for public pages

### 5. Onboarding
- [ ] Create onboarding layout and page
- [ ] Add `onboardingCompleted` to profiles
- [ ] Redirect incomplete profiles to onboarding
- [ ] Handle full page reload after completion

### 6. UI Components
- [ ] Install shadcn-svelte components
- [ ] Configure design tokens
- [ ] Set up typography and colors

### 7. Testing
- [ ] Install Vitest (`vitest`, `@vitest/coverage-v8`)
- [ ] Create `vitest.config.ts` with SvelteKit plugin
- [ ] Write tests for database connection patterns
- [ ] Test request isolation for Workers compatibility

### 8. Deployment
- [ ] Configure wrangler.jsonc with `nodejs_compat` flag
- [ ] Set environment variables in Cloudflare dashboard
- [ ] Deploy to Cloudflare Workers

---

## Testing

### Setup
```bash
pnpm add -D vitest @vitest/coverage-v8
```

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
    plugins: [sveltekit()],
    test: {
        include: ['src/**/*.{test,spec}.{js,ts}'],
        globals: true,
        environment: 'node',
        setupFiles: ['./tests/setup.ts']
    }
});
```

### Database Connection Tests
```typescript
// src/lib/server/db/db.test.ts
import { describe, it, expect, vi } from 'vitest';
import postgres from 'postgres';

describe('createDb()', () => {
    it('should create independent connections per call', () => {
        const db1 = createDb();
        const db2 = createDb();
        
        // Each call invokes postgres() again
        expect(postgres).toHaveBeenCalledTimes(2);
    });

    it('should use Workers-compatible connection settings', () => {
        createDb();
        
        expect(postgres).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                max: 1,
                prepare: false
            })
        );
    });
});
```

### Running Tests
```bash
pnpm test        # Watch mode
pnpm test:run    # Single run
pnpm test:coverage  # With coverage
```

---

## File Templates

### `app.d.ts`
```typescript
import type { Database } from '$lib/server/db';
import type { SupabaseClient, Session, User } from '@supabase/supabase-js';

declare global {
  namespace App {
    interface Locals {
      db: Database;
      supabase: SupabaseClient;
      safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
      session: Session | null;
      user: User | null;
      profile: Profile | null;
    }
    interface PageData {
      session: Session | null;
      user: User | null;
      profile: Profile | null;
    }
  }
}

export {};
```

### Root `+layout.server.ts`
```typescript
export const load = async ({ locals }) => {
  return {
    session: locals.session,
    user: locals.user,
    profile: locals.profile
  };
};
```

---

## Troubleshooting

### "Cannot perform I/O on behalf of a different request"
**Cause**: Using a module-level database connection in Cloudflare Workers.  
**Solution**: Use `createDb()` within each request handler instead of importing a shared `db` instance.

### Redirect loops after login
**Cause**: `locals.profile` not refreshed after onboarding completion.  
**Solution**: Use `window.location.href` for full page reload instead of client-side navigation.

### Database connection timeouts
**Cause**: Connection pool exhaustion or wrong settings.  
**Solution**: Ensure `max: 1`, `idle_timeout: 20`, and `prepare: false` in postgres options.

---

## Reference Architecture

The **Horizon Architecture** is built on these key principles:

1. **Edge-First**: Deploy to Cloudflare Workers for global low-latency
2. **Request Isolation**: Per-request database connections for Workers compatibility
3. **Defense in Depth**: Multi-layer route protection (hooks → layouts → pages)
4. **Type Safety**: End-to-end TypeScript with Drizzle ORM
5. **Multi-Tenant**: Organization-scoped resources with RLS
6. **Audit Trail**: Comprehensive activity logging

---

## Best Practices for Future Projects

### Architecture Principles

1. **Start with the Foundation**: Use the core authentication, database, and route protection patterns as-is. These are production-tested and follow security best practices.

2. **Customize the Domain Layer**: The database schema, business logic, and UI should be tailored to your specific use case. Don't try to use the example tables (projects, invoices, tickets) unless they match your needs.

3. **Build on UI Components**: The `components/ui` library (shadcn-svelte) provides 60+ components. Always check if existing components can be composed to achieve your design before creating custom components.

4. **Email Templates**: Use the email system structure (nodemailer + SMTP) but customize all templates for your brand and content. The provided templates are examples, not production-ready for all use cases.

5. **Payment Workflows**: The payment patterns (webhook handlers, wire transfers, recurring billing) are reusable, but adapt the business logic (approval workflows, reminder schedules) to your requirements.

### Development Workflow

1. **Schema-First Development**: Design your database schema first, then generate TypeScript types with Drizzle. This ensures type safety throughout your application.

2. **Layout-First Pages**: Use standardized layouts (CreatePageLayout, DetailPageLayout) for CRUD operations. This creates consistency and reduces development time.

3. **Component Composition**: Before creating a new component:
   ```typescript
   // ✅ Good: Compose existing components
   <Card.Root>
     <Card.Header>
       <Card.Title>Title</Card.Title>
     </Card.Header>
     <Card.Content>Content</Card.Content>
   </Card.Root>
   
   // ❌ Avoid: Creating custom card component
   <CustomCard title="Title">Content</CustomCard>
   ```

4. **Named Imports**: Always use named imports from central indices:
   ```typescript
   // ✅ Good
   import { Header, Footer } from '$lib/components/layout';
   
   // ❌ Avoid
   import Header from '$lib/components/layout/navigation/Header.svelte';
   ```

5. **Email Testing**: Test all email notifications in development before deploying. Use services like Mailtrap or ethereal.email for safe testing.

### Customization Guidelines

#### What to Keep As-Is
- Authentication flow and middleware
- Database connection patterns (per-request with `createDb()`)
- Route protection and authorization logic
- Error monitoring setup
- Deployment configuration

#### What to Customize
- **Database schema**: Tables, columns, relationships specific to your domain
- **Design system**: Colors, typography, spacing, component styles
- **Email templates**: All HTML, branding, and content
- **Business logic**: Workflows, validation rules, status transitions
- **UI layouts**: Page structures and content organization

#### What to Extend
- **Payment methods**: Add new payment gateways alongside existing ones
- **Notification channels**: Add SMS, push notifications, etc.
- **User roles**: Add domain-specific roles beyond the base set
- **Audit logging**: Add custom event types for your domain

### Common Customization Patterns

#### Adding a New Resource (e.g., "Products")

1. **Define schema:**
   ```typescript
   // src/lib/server/db/schema.ts
   export const products = pgTable('products', {
     id: uuid('id').defaultRandom().primaryKey(),
     organizationId: uuid('organization_id').references(() => organizations.id),
     name: text('name').notNull(),
     price: numeric('price', { precision: 10, scale: 2 }),
     createdAt: timestamp('created_at').defaultNow()
   }).enableRLS();
   ```

2. **Create routes:**
   ```
   src/routes/(app)/app/products/
   ├── +page.svelte          # List view
   ├── +page.server.ts       # Load products
   ├── new/
   │   ├── +page.svelte      # Use CreatePageLayout
   │   └── +page.server.ts   # Form action
   └── [id]/
       ├── +page.svelte      # Use DetailPageLayout
       └── +page.server.ts   # Load product
   ```

3. **Reuse layouts:**
   ```svelte
   <!-- new/+page.svelte -->
   <script lang="ts">
     import { CreatePageLayout } from '$lib/components/layout';
   </script>
   
   <CreatePageLayout
     title="Create Product"
     backLink="/app/products"
   >
     <!-- Form here -->
   </CreatePageLayout>
   ```

#### Customizing Email Templates

1. **Create a new email function:**
   ```typescript
   // src/lib/server/email.ts
   export async function sendCustomNotification(data: {
     to: string;
     customData: any;
   }): Promise<void> {
     const html = `
       <div style="font-family: Arial, sans-serif; max-width: 600px;">
         <!-- Your custom template -->
       </div>
     `;
     
     await sendEmail({
       to: data.to,
       subject: 'Your Custom Subject',
       html
     });
   }
   ```

2. **Use consistent styling:**
   - Max width: 600px
   - Inline CSS only (no external stylesheets)
   - Mobile-responsive tables
   - Single CTA button
   - Plain text fallback included

#### Adding New Payment Methods

1. **Create webhook handler:**
   ```typescript
   // src/routes/api/stripe/webhook/+server.ts
   export const POST: RequestHandler = async ({ request }) => {
     // Verify signature
     // Process event
     // Update invoice status
     // Send confirmation email
   };
   ```

2. **Integrate with invoice system:**
   ```typescript
   await db.update(invoices)
     .set({ 
       status: 'paid',
       paymentMethod: 'stripe',
       paidAt: new Date()
     })
     .where(eq(invoices.id, invoiceId));
   ```

3. **Add to payment options:**
   ```svelte
   <select name="paymentMethod">
     <option value="credit_card">Credit Card (LemonSqueezy)</option>
     <option value="stripe">Credit Card (Stripe)</option>
     <option value="wire_transfer">Wire Transfer</option>
   </select>
   ```

### Performance Optimization

**Goal**: Ensure everything loads fast with optimal bundle sizes and runtime performance.

#### 1. Import Strategy & Bundle Size

**Central Module Imports:**

The architecture uses central index exports (`src/lib/components/layout/index.ts`) for convenience. While this pattern doesn't impact load times when properly configured, it's important to understand how Vite handles bundling:

```typescript
// ✅ RECOMMENDED: Named imports (tree-shakeable)
import { Header, Footer } from '$lib/components/layout';
// Only Header and Footer are included in the bundle

// ✅ ALSO GOOD: Direct imports (explicit)
import Header from '$lib/components/layout/navigation/Header.svelte';
// Same result: only Header is included

// ❌ AVOID: Wildcard imports
import * as Layout from '$lib/components/layout';
// Imports everything, increases bundle size
```

**How Vite Optimizes:**

1. **Tree-Shaking**: Vite automatically removes unused exports from central index files
2. **Code Splitting**: Each route creates a separate chunk, shared dependencies are deduplicated
3. **Dynamic Imports**: Use for heavy components that aren't needed immediately

**Verifying Bundle Size:**

```bash
# Build and analyze bundle
pnpm build

# Check output sizes
ls -lh .svelte-kit/output/client/_app/immutable/chunks/
```

**Bundle Size Best Practices:**

- Keep central indices lean (only re-exports, no logic)
- Use dynamic imports for large components:
  ```typescript
  // Heavy chart component loaded on-demand
  const Chart = await import('$lib/components/Chart.svelte');
  ```
- Avoid importing entire icon libraries:
  ```typescript
  // ✅ Good: Import specific icons
  import { User, Settings } from '@lucide/svelte';
  
  // ❌ Bad: Import all icons
  import * as Icons from '@lucide/svelte';
  ```

#### 2. Database Query Optimization

**Use Selective Queries:**
```typescript
// ✅ Good: Only fetch needed columns
const users = await db.select({
  id: profiles.id,
  name: profiles.firstName,
  email: profiles.email
}).from(profiles);

// ❌ Avoid: Fetching all columns when not needed
const users = await db.query.profiles.findMany();
```

**Optimize Relations:**
```typescript
// ✅ Good: Eager load with joins
const projects = await db.query.projects.findMany({
  with: {
    organization: {
      columns: { name: true }
    }
  }
});

// ❌ Avoid: N+1 queries
for (const project of projects) {
  const org = await db.query.organizations.findFirst({
    where: eq(organizations.id, project.organizationId)
  });
}
```

**Use Indexes:**
```typescript
// Add indexes in schema for frequently queried columns
export const profiles = pgTable('profiles', {
  // ...
}, (table) => ({
  emailIdx: index('email_idx').on(table.email),
  orgIdx: index('org_idx').on(table.activeOrganizationId)
}));
```

#### 3. Streaming Data & Progressive Loading

**Use SvelteKit Streaming for Large Datasets:**

```typescript
// +page.server.ts
export const load = async ({ locals }) => {
  // Immediate data (fast)
  const stats = await getStats();
  
  // Streamed data (slower, but page renders immediately)
  return {
    stats, // Available immediately
    streamed: {
      projects: loadProjects(), // Promise, not awaited
      users: loadUsers()         // Promise, not awaited
    }
  };
};
```

**Progressive UI Rendering:**
```svelte
<!-- Page renders immediately with skeleton -->
{#await data.streamed.projects}
  <Skeleton class="h-20 w-full" />
{:then projects}
  {#each projects as project}
    <ProjectCard {project} />
  {/each}
{/await}
```

**Benefits:**
- Time to First Byte (TTFB): < 200ms
- First Contentful Paint (FCP): < 1s
- User sees content immediately, not a blank screen

#### 4. Asset Optimization

**Image Optimization:**
```svelte
<!-- Use modern formats with fallbacks -->
<picture>
  <source srcset="/image.avif" type="image/avif">
  <source srcset="/image.webp" type="image/webp">
  <img src="/image.jpg" alt="Description" loading="lazy">
</picture>
```

**Font Loading:**
```css
/* Preload critical fonts */
<link rel="preload" href="/fonts/Hubot-Sans.woff2" as="font" type="font/woff2" crossorigin>

/* Use font-display: swap to prevent invisible text */
@font-face {
  font-family: 'Hubot Sans';
  src: url('/fonts/Hubot-Sans.woff2') format('woff2');
  font-display: swap;
}
```

**Cloudflare CDN:**
- All static assets served from edge locations
- Automatic compression (Brotli/Gzip)
- Cache headers configured in `static/` folder

#### 5. Edge Caching with Cloudflare Workers

**Cache API Usage:**
```typescript
// Cache expensive computations
export const load: PageServerLoad = async ({ fetch }) => {
  const cacheKey = 'https://example.com/api/data';
  const cache = caches.default;
  
  // Try cache first
  let response = await cache.match(cacheKey);
  
  if (!response) {
    // Fetch from origin
    response = await fetch('/api/data');
    
    // Cache for 5 minutes
    const res = response.clone();
    await cache.put(cacheKey, res, {
      headers: { 'Cache-Control': 'max-age=300' }
    });
  }
  
  return await response.json();
};
```

**Cache Strategy:**
- Static assets: 1 year (`immutable`)
- API responses: 5-15 minutes (with revalidation)
- User-specific data: No cache
- Public pages: CDN cache with stale-while-revalidate

#### 6. JavaScript Optimization

**Reduce Client-Side JavaScript:**

```typescript
// ✅ Good: Server-side processing
export const load: PageServerLoad = async ({ locals }) => {
  // Heavy computation on server
  const processedData = await processData(locals.db);
  return { data: processedData };
};

// ❌ Avoid: Client-side heavy processing
export const load: PageLoad = async ({ fetch }) => {
  const data = await fetch('/api/raw-data');
  // Heavy computation in browser
  return { data: processDataInBrowser(data) };
};
```

**Lazy Load Non-Critical Features:**
```typescript
// Load admin panel only when needed
const loadAdminPanel = async () => {
  const { AdminPanel } = await import('$lib/components/admin/AdminPanel.svelte');
  return AdminPanel;
};
```

#### 7. CSS Optimization

**Tailwind JIT Mode:**
```javascript
// tailwind.config.js
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  // JIT mode automatically enabled in v4
  // Only CSS for used classes is generated
}
```

**Critical CSS:**
- Inline critical styles in `app.html`
- Load non-critical CSS asynchronously
- Use `media="print"` onload trick for deferred loading

#### 8. Connection Pooling Strategy

**Cloudflare Workers Settings:**
```typescript
const client = postgres(DATABASE_URL, {
  max: 1,              // Single connection per Worker instance
  idle_timeout: 20,    // Close idle connections quickly
  connect_timeout: 10, // Fast fail for unresponsive database
  prepare: false       // Required for Supavisor transaction mode
});
```

**Why These Settings:**
- `max: 1`: Workers are stateless, one connection per instance is optimal
- Connection pooling handled by Supabase Supavisor
- Workers scale horizontally (100-1000+ instances)
- Each instance maintains minimal resources

#### 9. Performance Monitoring

**Core Web Vitals Targets:**
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

**Sentry Performance Monitoring:**
```typescript
// hooks.server.ts
const initSentry = initCloudflareSentryHandle({
  dsn: env.PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0, // Adjust based on traffic
  profilesSampleRate: 0.1 // Profile 10% of transactions
});
```

**Measure Custom Metrics:**
```typescript
// Track database query time
const startTime = performance.now();
const result = await db.query.projects.findMany();
const duration = performance.now() - startTime;

if (duration > 1000) {
  console.warn(`Slow query: ${duration}ms`);
}
```

#### 10. Performance Checklist

- [ ] Bundle sizes analyzed and optimized (< 200KB for main bundle)
- [ ] All images optimized and use modern formats (WebP/AVIF)
- [ ] Fonts use `font-display: swap` and are preloaded
- [ ] Critical CSS inlined, non-critical CSS deferred
- [ ] Database queries use indexes and selective columns
- [ ] Large datasets use streaming with skeleton UI
- [ ] Heavy components use dynamic imports
- [ ] No wildcard imports from icon libraries
- [ ] API responses cached appropriately
- [ ] Cloudflare CDN configured for static assets
- [ ] Core Web Vitals measured and meet targets
- [ ] Performance monitoring configured in Sentry

#### 11. Performance Testing

**Local Testing:**
```bash
# Build for production
pnpm build

# Preview production build
pnpm preview

# Test with Lighthouse
npx lighthouse http://localhost:4173 --view
```

**Production Testing:**
```bash
# Test live site
npx lighthouse https://yourdomain.com --view

# Check bundle size
npx bundlesize
```

**Load Testing:**
```bash
# Install k6
brew install k6

# Run load test
k6 run load-test.js
```

**Monitoring Tools:**
- **Lighthouse CI**: Automated performance testing
- **WebPageTest**: Real-world performance metrics
- **Sentry Performance**: Production monitoring
- **Cloudflare Analytics**: Edge performance data

### Security Checklist

- [ ] All tables have RLS enabled (`.enableRLS()`)
- [ ] All API routes validate authentication
- [ ] All webhook handlers verify signatures
- [ ] All user inputs are validated (Zod schemas)
- [ ] All sensitive operations are logged to activity_log
- [ ] All environment variables are properly scoped (public vs private)
- [ ] All redirects use absolute paths to prevent open redirects
- [ ] All database queries use parameterized statements (Drizzle handles this)

### Deployment Checklist

- [ ] Environment variables set in Cloudflare dashboard
- [ ] Supabase project configured with proper RLS policies
- [ ] SMTP credentials verified and tested
- [ ] Payment webhooks configured with correct URLs
- [ ] Cron jobs scheduled (if using recurring billing)
- [ ] Sentry project created and DSN configured
- [ ] Custom domain configured in Cloudflare
- [ ] SSL/TLS certificates active
- [ ] Database backups configured in Supabase

### Troubleshooting Common Issues

See the main [Troubleshooting](#troubleshooting) section for database connection and redirect loop issues.

**Additional common issues:**

#### Email Delivery Failures
- Verify SMTP credentials are correct
- Check Office 365 security settings allow SMTP
- Ensure sender email matches SMTP_USER
- Test with simple email first before complex templates

#### Payment Webhook Not Receiving Events
- Verify webhook URL is publicly accessible (HTTPS)
- Check webhook signature verification logic
- Ensure webhook is registered in payment provider dashboard
- Review logs for failed verification attempts

#### Cron Jobs Not Running
- Verify cron trigger is configured in wrangler.jsonc
- Check Cloudflare dashboard for cron execution logs
- Ensure cron secret header is correctly validated
- Test cron endpoint manually with curl

---

*MostlyWhat Systems' Horizon Architecture - Documentation v3.0*
*Built with SvelteKit, Supabase, and Cloudflare Workers*
*Updated: December 2025*
