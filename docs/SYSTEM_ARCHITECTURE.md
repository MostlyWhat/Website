# MostlyWhat Systems - Complete Architecture Documentation

> **Purpose**: This document provides a comprehensive guide to building a full-stack SaaS application with SvelteKit, Supabase, and Cloudflare Workers. It is designed to be consumed by an LLM to replicate or extend this architecture,
but also as a reference to developers for building based on the architecture.

---

## Table of Contents

1. [Technology Stack](#1-technology-stack)
2. [Project Structure](#2-project-structure)
3. [Authentication System](#3-authentication-system)
4. [Authorization & Route Protection](#4-authorization--route-protection)
5. [Database Architecture](#5-database-architecture)
6. [Design System](#6-design-system)
7. [Internationalization (i18n)](#7-internationalization-i18n)
8. [Error Monitoring](#8-error-monitoring)
9. [API Design](#9-api-design)
10. [Security Principles](#10-security-principles)
11. [Deployment Architecture](#11-deployment-architecture)
12. [Common Patterns](#12-common-patterns)

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
│   │   ├── layout/             # Layout components (headers, sidebars)
│   │   └── ui/                 # UI components (buttons, forms, etc.)
│   ├── config/
│   │   └── site.ts             # Site configuration
│   ├── server/
│   │   ├── auth.ts             # Auth helper functions
│   │   ├── db/
│   │   │   ├── index.ts        # Database client
│   │   │   └── schema.ts       # Drizzle schema definitions
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
    throw redirect(303, '/auth/login?redirectTo=/app');
  }
  if (!locals.profile) {
    throw redirect(303, '/onboarding');
  }
  if (!locals.profile.onboardingCompleted) {
    throw redirect(303, '/onboarding');
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
2. **Onboarding Form**: Collects name, preferences, organization choice
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

### ORM: Drizzle
```typescript
// src/lib/server/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const client = postgres(DATABASE_URL);
export const db = drizzle(client, { schema });
```

### Schema Pattern
```typescript
// src/lib/server/db/schema.ts

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

### Key Tables
```
profiles              - User profile data (extends Supabase auth.users)
organizations         - Companies/clients
organization_members  - M:N relationship between profiles and orgs
projects              - Project management
proposals             - Project proposals
invoices              - Billing
tickets               - Support tickets
activity_log          - Audit trail
announcements         - System announcements
```

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

## 7. Internationalization (i18n)

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

## 8. Error Monitoring

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

## 9. API Design

### API Route Pattern
```typescript
// src/routes/api/[resource]/+server.ts
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, url }) => {
  // 1. Auth check
  if (!locals.user || !locals.profile) {
    throw error(401, 'Authentication required');
  }

  // 2. Onboarding check
  if (!locals.profile.onboardingCompleted) {
    throw error(403, 'Please complete onboarding');
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
    throw error(400, 'Invalid file type');
  }
  if (file.size > MAX_FILE_SIZE) {
    throw error(400, 'File too large');
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

## 10. Security Principles

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
Enable RLS on all tables and create appropriate policies:
```sql
-- Example: Users can only see their own profiles
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);
```

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

---

## 11. Deployment Architecture

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

## 12. Common Patterns

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

---

## Quick Start Checklist

When building a new application with this architecture:

### 1. Initial Setup
- [ ] Create SvelteKit project with `npx sv create`
- [ ] Install dependencies (Tailwind, Drizzle, Supabase, etc.)
- [ ] Configure Cloudflare adapter
- [ ] Set up Supabase project

### 2. Authentication
- [ ] Create `hooks.server.ts` with Supabase middleware
- [ ] Implement `getOrCreateProfile()` helper
- [ ] Create auth routes (login, register, callback)
- [ ] Add route protection middleware

### 3. Database
- [ ] Define Drizzle schema with RLS enabled
- [ ] Create profiles table linked to auth.users
- [ ] Set up migrations
- [ ] Configure RLS policies

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

### 7. Deployment
- [ ] Configure wrangler.jsonc
- [ ] Set environment variables
- [ ] Deploy to Cloudflare

---

## File Templates

### `app.d.ts`
```typescript
declare global {
  namespace App {
    interface Locals {
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

*This documentation was generated for LLM consumption. Follow the patterns exactly as described for consistent results.*
