# Supabase Setup & Cloudflare Workers Deployment Guide

This comprehensive guide covers setting up Supabase for authentication, database, and email, then deploying to Cloudflare Workers.

## Table of Contents

1. [Initial Supabase Setup](#1-initial-supabase-setup)
2. [Database Configuration](#2-database-configuration)
3. [Authentication Setup](#3-authentication-setup)
4. [Email Configuration](#4-email-configuration)
5. [Environment Variables](#5-environment-variables)
6. [Cloudflare Workers Deployment](#6-cloudflare-workers-deployment)
7. [Email Notification System](#7-email-notification-system)
8. [Recurring Payments System](#8-recurring-payments-system)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Initial Supabase Setup

### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: Your project name (e.g., "mostlywhat-crm")
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier works for development

### Get Your API Keys

After project creation, navigate to **Settings > API**:

```
Project URL: https://[project-ref].supabase.co
Anon Key: eyJhbGci... (public, safe for client)
Service Role Key: eyJhbGci... (secret, server-only!)
```

---

## 2. Database Configuration

### Option A: Use Drizzle Migrations (Recommended)

We use Drizzle ORM for type-safe database access. Migrations are in `supabase/migrations/`.

```bash
# Generate migrations from schema changes
pnpm drizzle-kit generate

# Push migrations to Supabase
pnpm drizzle-kit push

# Or use Supabase CLI for migrations
supabase db push
```

### Option B: Direct SQL Setup

Go to **SQL Editor** in Supabase Dashboard and run the migration files manually.

### Enable Row Level Security

All tables have RLS enabled by default. Since we access the database via server-side service role, no policies are needed (service role bypasses RLS).

```sql
-- Example: Enable RLS on a table
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;
```

### Database Connection

For local development with Supabase CLI:

```bash
# Start local Supabase
supabase start

# Reset database (runs migrations + seed)
supabase db reset

# Stop local Supabase
supabase stop
```

---

## 3. Authentication Setup

### Enable OAuth Providers

Go to **Authentication > Providers**:

#### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create new OAuth App:
   - **Application name**: Your app name
   - **Homepage URL**: `https://your-domain.com`
   - **Authorization callback URL**: `https://[project-ref].supabase.co/auth/v1/callback`
3. Copy Client ID and Client Secret to Supabase

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable "Google+ API" and "Google Identity"
4. Create OAuth 2.0 credentials:
   - **Authorized redirect URI**: `https://[project-ref].supabase.co/auth/v1/callback`
5. Copy Client ID and Client Secret to Supabase

### Configure Email Auth

Go to **Authentication > Email Templates**:

#### Confirmation Email
```html
<h2>Confirm your email</h2>
<p>Follow this link to confirm your email:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email address</a></p>
```

#### Password Reset Email
```html
<h2>Reset your password</h2>
<p>Follow this link to reset your password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset password</a></p>
```

### Enable MFA/TOTP (Two-Factor Authentication)

⚠️ **IMPORTANT**: TOTP is disabled by default. To enable:

1. Go to **Authentication > Multi-Factor Authentication**
2. Enable "TOTP" (Time-based One-Time Password)
3. Configure settings:
   - **Issuer Name**: "MostlyWhat Systems"
   - **TOTP verification enabled**: Yes

If you see error: `AuthApiError: MFA enroll is disabled for TOTP`:
- This means MFA is not enabled in your Supabase project settings
- Go to Authentication > MFA and enable it

### Auth Settings

Go to **Authentication > URL Configuration**:

- **Site URL**: `https://your-domain.com`
- **Redirect URLs**: Add all valid redirect URLs:
  ```
  https://your-domain.com/**
  http://localhost:5173/**
  ```

---

## 4. Email Configuration

### Option A: Supabase Built-in SMTP (Development)

Supabase provides built-in email for development (limited to 4 emails/hour on free tier).

### Option B: Custom SMTP (Production Recommended)

Go to **Settings > Auth > SMTP Settings**:

#### Using Resend (Recommended)

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain
3. Get your API key
4. Configure SMTP:
   ```
   Host: smtp.resend.com
   Port: 465
   Username: resend
   Password: re_YOUR_API_KEY
   Sender email: noreply@your-domain.com
   Sender name: MostlyWhat Systems
   ```

#### Using SendGrid

```
Host: smtp.sendgrid.net
Port: 587
Username: apikey
Password: YOUR_SENDGRID_API_KEY
```

#### Using AWS SES

```
Host: email-smtp.us-east-1.amazonaws.com
Port: 587
Username: YOUR_SES_SMTP_USERNAME
Password: YOUR_SES_SMTP_PASSWORD
```

---

## 5. Environment Variables

### Local Development (.env)

Create `.env` file in project root:

```bash
# Supabase
PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...your-service-role-key

# Database (for Drizzle)
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres

# Email (Resend)
RESEND_API_KEY=re_your_api_key

# Site
PUBLIC_SITE_URL=http://localhost:5173
```

### Production (Cloudflare Workers)

Set these as secrets in Cloudflare:

```bash
# Using Wrangler CLI
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
wrangler secret put DATABASE_URL
wrangler secret put RESEND_API_KEY

# Or in Cloudflare Dashboard:
# Workers & Pages > Your Worker > Settings > Variables
```

### Cloudflare Workers Environment Variables

In `wrangler.jsonc`:

```jsonc
{
  "name": "mostlywhat-website",
  "compatibility_date": "2024-01-01",
  "vars": {
    "PUBLIC_SUPABASE_URL": "https://[project-ref].supabase.co",
    "PUBLIC_SUPABASE_ANON_KEY": "eyJhbGci...",
    "PUBLIC_SITE_URL": "https://your-domain.com"
  }
}
```

---

## 6. Cloudflare Workers Deployment

### Prerequisites

1. Cloudflare account
2. Domain configured in Cloudflare (optional but recommended)
3. Wrangler CLI installed: `pnpm add -D wrangler`

### Configure Wrangler

Your `wrangler.jsonc` should look like:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "mostlywhat-website",
  "compatibility_date": "2024-12-01",
  "compatibility_flags": ["nodejs_compat"],
  "main": ".svelte-kit/cloudflare/_worker.js",
  "site": {
    "bucket": ".svelte-kit/cloudflare"
  },
  "vars": {
    "PUBLIC_SUPABASE_URL": "https://your-project.supabase.co",
    "PUBLIC_SUPABASE_ANON_KEY": "your-anon-key",
    "PUBLIC_SITE_URL": "https://your-domain.com"
  },
  "routes": [
    {
      "pattern": "your-domain.com/*",
      "zone_name": "your-domain.com"
    }
  ]
}
```

### Build & Deploy

```bash
# Build the project
pnpm build

# Preview locally with Wrangler
pnpm wrangler dev

# Deploy to Cloudflare
pnpm wrangler deploy
```

### Database Connection from Cloudflare Workers

Since Cloudflare Workers can't use traditional TCP connections, use Supabase's connection pooler:

```bash
# Get the connection string from Supabase Dashboard
# Settings > Database > Connection string > Transaction mode

DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Custom Domain Setup

1. In Cloudflare Dashboard, go to **Workers & Pages**
2. Select your worker
3. Go to **Settings > Triggers > Custom Domains**
4. Add your domain

---

## 7. Email Notification System

### Architecture

```
User Action → Server Action → Email Service → User Inbox
                                  ↓
                           Activity Log
```

### Email Service Implementation

The email service is in `$lib/server/email.ts`:

```typescript
import { Resend } from 'resend';
import { RESEND_API_KEY } from '$env/static/private';
import { PUBLIC_SITE_URL } from '$env/static/public';

const resend = new Resend(RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
  text
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'MostlyWhat Systems <noreply@mostlywhat.com>',
      to,
      subject,
      html,
      text
    });
    
    if (error) {
      console.error('Email send error:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Email service error:', error);
    return { success: false, error };
  }
}
```

### Email Templates

Create professional HTML email templates:

```typescript
// $lib/server/email-templates.ts

export function proposalSentTemplate(data: {
  clientName: string;
  proposalNumber: string;
  projectName: string;
  total: string;
  viewUrl: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Proposal</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e4e4e7;">
          <!-- Header -->
          <tr>
            <td style="padding: 32px; border-bottom: 1px solid #e4e4e7;">
              <table width="100%">
                <tr>
                  <td>
                    <img src="${PUBLIC_SITE_URL}/logo.svg" alt="MostlyWhat" height="32">
                  </td>
                  <td align="right" style="font-family: monospace; font-size: 10px; color: #71717a; letter-spacing: 2px;">
                    PROPOSAL
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 600; color: #18181b;">
                New Proposal Ready
              </h1>
              <p style="margin: 0 0 24px; color: #52525b; line-height: 1.6;">
                Hello ${data.clientName},
              </p>
              <p style="margin: 0 0 24px; color: #52525b; line-height: 1.6;">
                We've prepared a proposal for <strong>${data.projectName}</strong>.
              </p>
              
              <!-- Proposal Details -->
              <table width="100%" style="background-color: #fafafa; border: 1px solid #e4e4e7; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px; border-bottom: 1px solid #e4e4e7;">
                    <span style="font-family: monospace; font-size: 10px; color: #71717a; letter-spacing: 1px;">PROPOSAL NUMBER</span>
                    <div style="font-weight: 600; color: #18181b; margin-top: 4px;">${data.proposalNumber}</div>
                  </td>
                  <td style="padding: 16px; border-bottom: 1px solid #e4e4e7; text-align: right;">
                    <span style="font-family: monospace; font-size: 10px; color: #71717a; letter-spacing: 1px;">TOTAL</span>
                    <div style="font-weight: 600; color: #18181b; margin-top: 4px;">${data.total}</div>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table width="100%">
                <tr>
                  <td align="center" style="padding: 24px 0;">
                    <a href="${data.viewUrl}" style="display: inline-block; background-color: #18181b; color: #ffffff; padding: 16px 32px; text-decoration: none; font-weight: 600; font-size: 14px; letter-spacing: 1px;">
                      VIEW PROPOSAL
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px; background-color: #fafafa; border-top: 1px solid #e4e4e7;">
              <p style="margin: 0; font-size: 12px; color: #71717a; text-align: center;">
                MostlyWhat Systems · <a href="${PUBLIC_SITE_URL}" style="color: #71717a;">mostlywhat.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
```

### Triggering Emails

Emails are sent from server actions:

```typescript
// In +page.server.ts actions
import { sendEmail } from '$lib/server/email';
import { proposalSentTemplate } from '$lib/server/email-templates';

// When sending a proposal:
await sendEmail({
  to: clientEmail,
  subject: `Proposal ${proposalNumber} from MostlyWhat Systems`,
  html: proposalSentTemplate({
    clientName: client.displayName,
    proposalNumber,
    projectName: project.name,
    total: formatCurrency(proposal.total),
    viewUrl: `${PUBLIC_SITE_URL}/app/proposals/${proposal.id}`
  })
});
```

### Email Events to Implement

| Event | Recipient | Template |
|-------|-----------|----------|
| Proposal Sent | Client | `proposalSentTemplate` |
| Proposal Accepted | Admin | `proposalAcceptedTemplate` |
| Proposal Rejected | Admin | `proposalRejectedTemplate` |
| Ticket Created | Assigned Staff | `ticketCreatedTemplate` |
| Ticket Reply | Client/Staff | `ticketReplyTemplate` |
| Invoice Sent | Client | `invoiceSentTemplate` |
| Payment Received | Client | `paymentReceivedTemplate` |
| Project Update | Client | `projectUpdateTemplate` |

---

## 8. Recurring Payments System

### How It Works

The recurring payment system uses invoices with a `recurring` configuration.

### Database Schema

```typescript
// In invoices table
recurring: jsonb, // { interval: 'monthly'|'quarterly'|'yearly', nextDueDate: Date }
```

### Invoice Recurrence Flow

```
1. Create Invoice with recurring config
2. Invoice marked as paid
3. System checks for due recurring invoices (cron job)
4. Auto-generate next invoice
5. Send invoice notification
6. Client pays
7. Repeat from step 3
```

### Where Staff Marks Payment

**Location**: `/admin/invoices/[id]`

Staff can:
1. **Record Payment**: Click "Record Payment" button
2. **Enter Details**:
   - Amount paid
   - Payment method (Bank Transfer, Credit Card, etc.)
   - Payment reference/transaction ID
   - Payment date
3. **Auto-update Status**: Invoice status changes from `sent` to `paid` or `partially_paid`

### Implementing Recurring Invoices

```typescript
// $lib/server/recurring-invoices.ts

export async function processRecurringInvoices() {
  const now = new Date();
  
  // Find invoices due for renewal
  const dueInvoices = await db
    .select()
    .from(invoices)
    .where(
      and(
        eq(invoices.status, 'paid'),
        sql`${invoices.recurring}->>'nextDueDate' <= ${now.toISOString()}`
      )
    );
  
  for (const invoice of dueInvoices) {
    const recurring = invoice.recurring as { interval: string; nextDueDate: string };
    
    // Calculate next due date
    const nextDate = calculateNextDueDate(recurring.interval, new Date(recurring.nextDueDate));
    
    // Create new invoice
    const [newInvoice] = await db
      .insert(invoices)
      .values({
        ...invoice,
        id: undefined,
        invoiceNumber: await generateInvoiceNumber(),
        status: 'draft',
        issueDate: now,
        dueDate: nextDate,
        paidAt: null,
        recurring: { ...recurring, nextDueDate: nextDate.toISOString() }
      })
      .returning();
    
    // Send notification
    await sendInvoiceNotification(newInvoice);
  }
}

function calculateNextDueDate(interval: string, from: Date): Date {
  const date = new Date(from);
  switch (interval) {
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'quarterly':
      date.setMonth(date.getMonth() + 3);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
  }
  return date;
}
```

### Setting Up Cron Jobs

For Cloudflare Workers, use Cron Triggers:

```jsonc
// wrangler.jsonc
{
  "triggers": {
    "crons": ["0 0 * * *"] // Daily at midnight UTC
  }
}
```

```typescript
// src/worker.ts (add scheduled handler)
export default {
  async scheduled(event, env, ctx) {
    // Process recurring invoices
    await processRecurringInvoices();
    
    // Send payment reminders
    await sendPaymentReminders();
  }
};
```

---

## 9. Troubleshooting

### Common Errors

#### "MFA enroll is disabled for TOTP"
- **Solution**: Enable MFA in Supabase Dashboard → Authentication → MFA

#### "Failed query: where = $1" (missing column)
- **Cause**: Query missing column reference in WHERE clause
- **Solution**: Check your Drizzle queries use proper column references

#### "relation does not exist"
- **Cause**: Table not created in database
- **Solution**: Run migrations: `supabase db push` or `pnpm drizzle-kit push`

#### "invalid input value for enum"
- **Cause**: Using value not in the enum definition
- **Solution**: Check schema.ts for valid enum values

#### Redirect error in form actions
- **Cause**: `redirect()` thrown inside try-catch
- **Solution**: Return redirect or re-throw in catch block:
```typescript
try {
  // ... code
  return redirect(303, '/destination');
} catch (error) {
  if (error && typeof error === 'object' && 'status' in error) {
    error; // Re-redirects
  }
  return fail(500, { error: 'Failed' });
}
```

#### "Using user object from getSession() could be insecure"
- **Cause**: Using `getSession()` which doesn't verify the token
- **Solution**: Use `getUser()` for authenticated requests:
```typescript
const { data: { user } } = await supabase.auth.getUser();
```

### Database Issues

#### Reset Local Database
```bash
supabase db reset
```

#### Check Migration Status
```bash
supabase migration list
```

#### Generate New Migration
```bash
pnpm drizzle-kit generate
```

### Deployment Issues

#### Check Worker Logs
```bash
wrangler tail
```

#### Test Build Locally
```bash
pnpm build && pnpm wrangler dev
```

---

## Quick Reference

### Development Commands

```bash
# Start dev server
pnpm dev

# Start Supabase locally
supabase start

# Reset database
supabase db reset

# Generate Drizzle migrations
pnpm drizzle-kit generate

# Push schema changes
pnpm drizzle-kit push

# Deploy to Cloudflare
pnpm build && wrangler deploy
```

### Environment Variables Checklist

- [ ] `PUBLIC_SUPABASE_URL`
- [ ] `PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `DATABASE_URL`
- [ ] `RESEND_API_KEY`
- [ ] `PUBLIC_SITE_URL`

### Supabase Dashboard Checklist

- [ ] OAuth providers configured (GitHub, Google)
- [ ] Email templates customized
- [ ] MFA/TOTP enabled
- [ ] SMTP configured for production
- [ ] Redirect URLs added
- [ ] Site URL set

---

*Last updated: December 2024*
