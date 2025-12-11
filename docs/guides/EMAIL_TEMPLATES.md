# Email Templates Documentation

> This document provides comprehensive email templates for MostlyWhat Systems.  
> All transactional emails use Resend API with consistent branding.

---

## Table of Contents

1. [Overview](#overview)
2. [Configuration](#configuration)
3. [Base Template](#base-template)
4. [Transactional Emails](#transactional-emails)
   - [Proposal Emails](#proposal-emails)
   - [Ticket Emails](#ticket-emails)
   - [Organization Emails](#organization-emails)
   - [Project Emails](#project-emails)
   - [Invoice Emails](#invoice-emails)
5. [Authentication Emails (Supabase)](#authentication-emails-supabase)
6. [Marketing Emails](#marketing-emails)
7. [System Notification Emails](#system-notification-emails)
8. [Implementation Guide](#implementation-guide)

---

## Overview

### Email Categories

| Category | Provider | Purpose |
|----------|----------|---------|
| Transactional | Resend | Business operations (invoices, tickets, proposals) |
| Authentication | Supabase Auth | Login, signup, password reset |
| Marketing | Resend | Newsletters, announcements |
| System | Resend | Alerts, notifications |

### Design Principles

- **Consistent Branding**: All emails use MostlyWhat Systems design language
- **Mobile-First**: Responsive design for all screen sizes
- **Accessibility**: High contrast, readable fonts
- **Clear CTAs**: Single primary action per email
- **Plain Text Fallback**: All emails include plain text versions

---

## Configuration

### Environment Variables

```bash
# .env
RESEND_API_KEY="re_your-api-key"
PUBLIC_SITE_URL="https://mostlywhat.com"
```

### Resend Setup

1. Create account at [resend.com](https://resend.com)
2. Verify your domain (mostlywhat.com)
3. Generate API key
4. Configure DNS records:
   - SPF
   - DKIM
   - DMARC

---

## Base Template

All emails use this consistent HTML structure:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MostlyWhat Systems</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
            line-height: 1.6; 
            color: #171717; 
            margin: 0; 
            padding: 0; 
            background-color: #f5f5f5; 
        }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .card { background: #ffffff; border: 1px solid #e5e5e5; padding: 32px; }
        .header { 
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace; 
            font-size: 10px; 
            letter-spacing: 0.1em; 
            color: #737373; 
            margin-bottom: 24px; 
        }
        .logo { 
            font-family: 'SF Mono', Monaco, monospace; 
            font-size: 14px; 
            font-weight: 600; 
            letter-spacing: 0.1em; 
            color: #171717; 
            margin-bottom: 8px; 
        }
        h1 { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
            font-size: 24px; 
            font-weight: 700; 
            margin: 0 0 16px 0; 
            text-transform: uppercase; 
            letter-spacing: 0.05em; 
        }
        p { margin: 0 0 16px 0; color: #525252; }
        .button { 
            display: inline-block; 
            background: #171717; 
            color: #ffffff !important; 
            padding: 12px 24px; 
            text-decoration: none; 
            font-family: 'Inter', sans-serif; 
            font-size: 12px; 
            font-weight: 500; 
            letter-spacing: 0.1em; 
            text-transform: uppercase; 
            border: none; 
        }
        .highlight { 
            background: #f5f5f5; 
            padding: 16px; 
            border-left: 2px solid #171717; 
            margin: 16px 0; 
        }
        .detail-row { 
            display: flex; 
            justify-content: space-between; 
            padding: 8px 0; 
            border-bottom: 1px solid #f5f5f5; 
        }
        .detail-label { 
            font-family: 'SF Mono', Monaco, monospace; 
            font-size: 10px; 
            letter-spacing: 0.1em; 
            color: #737373; 
            text-transform: uppercase; 
        }
        .detail-value { font-weight: 500; }
        .meta { 
            font-family: 'SF Mono', Monaco, monospace; 
            font-size: 12px; 
            color: #737373; 
            padding: 16px 0; 
            border-top: 1px solid #e5e5e5; 
            margin-top: 24px; 
        }
        .footer { 
            text-align: center; 
            padding: 24px 0; 
            font-size: 12px; 
            color: #a3a3a3; 
        }
        .footer a { color: #737373; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="logo">MOSTLYWHAT SYSTEMS</div>
            <div class="header">// NOTIFICATION</div>
            <!-- Content goes here -->
        </div>
        <div class="footer">
            <p>&copy; 2025 MostlyWhat Systems. All rights reserved.</p>
            <p>
                <a href="https://mostlywhat.com">mostlywhat.com</a> · 
                <a href="https://mostlywhat.com/legal/privacy">Privacy</a> · 
                <a href="https://mostlywhat.com/legal/terms">Terms</a>
            </p>
        </div>
    </div>
</body>
</html>
```

---

## Transactional Emails

### Proposal Emails

#### 1. New Proposal

**Subject**: `Proposal {PROPOSAL_NUMBER}: {PROPOSAL_TITLE}`

**Trigger**: When a proposal is sent to client

**Template**:

```html
<h1>NEW PROPOSAL</h1>
<p>Hello {RECIPIENT_NAME},</p>
<p>A new proposal has been prepared for <strong>{ORGANIZATION_NAME}</strong>.</p>

<div class="highlight">
    <div class="detail-row">
        <span class="detail-label">Proposal</span>
        <span class="detail-value">{PROPOSAL_NUMBER}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Title</span>
        <span class="detail-value">{PROPOSAL_TITLE}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Total</span>
        <span class="detail-value">{CURRENCY} {TOTAL}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Valid Until</span>
        <span class="detail-value">{VALID_UNTIL_DATE}</span>
    </div>
</div>

<p>Please review the proposal and let us know if you have any questions.</p>

<p style="text-align: center; margin: 32px 0;">
    <a href="{PROPOSAL_URL}" class="button">VIEW PROPOSAL</a>
</p>

<div class="meta">
    If you have questions, reply to this email or contact us at support@mostlywhat.com
</div>
```

**Plain Text**:
```
New Proposal: {PROPOSAL_TITLE}

A proposal has been prepared for {ORGANIZATION_NAME}.

Proposal: {PROPOSAL_NUMBER}
Total: {CURRENCY} {TOTAL}

View: {PROPOSAL_URL}
```

---

#### 2. Proposal Accepted

**Subject**: `✓ Proposal {PROPOSAL_NUMBER} Accepted`

**Trigger**: When client accepts a proposal

**Template**:

```html
<h1>PROPOSAL ACCEPTED</h1>
<p>Great news! The proposal <strong>{PROPOSAL_NUMBER}</strong> has been accepted.</p>

<div class="highlight">
    <div class="detail-row">
        <span class="detail-label">Proposal</span>
        <span class="detail-value">{PROPOSAL_NUMBER}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Title</span>
        <span class="detail-value">{PROPOSAL_TITLE}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Organization</span>
        <span class="detail-value">{ORGANIZATION_NAME}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Accepted By</span>
        <span class="detail-value">{ACCEPTED_BY}</span>
    </div>
</div>

<p>The project will be created and you will be notified when it's ready to start.</p>

<p style="text-align: center; margin: 32px 0;">
    <a href="{PROPOSAL_URL}" class="button">VIEW DETAILS</a>
</p>
```

---

#### 3. Proposal Declined

**Subject**: `Proposal {PROPOSAL_NUMBER} Declined`

**Trigger**: When client rejects a proposal

**Template**:

```html
<h1>PROPOSAL DECLINED</h1>
<p>The proposal <strong>{PROPOSAL_NUMBER}</strong> has been declined.</p>

<div class="highlight">
    <div class="detail-row">
        <span class="detail-label">Proposal</span>
        <span class="detail-value">{PROPOSAL_NUMBER}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Title</span>
        <span class="detail-value">{PROPOSAL_TITLE}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Organization</span>
        <span class="detail-value">{ORGANIZATION_NAME}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Declined By</span>
        <span class="detail-value">{REJECTED_BY}</span>
    </div>
</div>

<!-- Optional reason -->
<p><strong>Reason:</strong> {REJECTION_REASON}</p>

<p>If you have questions about this decision, please contact us.</p>

<p style="text-align: center; margin: 32px 0;">
    <a href="{PROPOSAL_URL}" class="button">VIEW DETAILS</a>
</p>
```

---

### Ticket Emails

#### 1. Ticket Created

**Subject**: `[{TICKET_NUMBER}] {SUBJECT}`

**Trigger**: When a support ticket is created

**Template**:

```html
<h1>TICKET CREATED</h1>
<p>Hello {RECIPIENT_NAME},</p>
<p>Your support ticket has been created and our team will respond shortly.</p>

<div class="highlight">
    <div class="detail-row">
        <span class="detail-label">Ticket</span>
        <span class="detail-value">{TICKET_NUMBER}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Subject</span>
        <span class="detail-value">{SUBJECT}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Priority</span>
        <span class="detail-value">{PRIORITY}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Status</span>
        <span class="detail-value">{STATUS}</span>
    </div>
</div>

<p style="text-align: center; margin: 32px 0;">
    <a href="{TICKET_URL}" class="button">VIEW TICKET</a>
</p>

<div class="meta">
    You can track your ticket status and add comments at any time.
</div>
```

---

#### 2. Ticket Reply

**Subject**: `Re: [{TICKET_NUMBER}] {SUBJECT}`

**Trigger**: When a reply is added to a ticket

**Template**:

```html
<h1>NEW REPLY</h1>
<p>Hello {RECIPIENT_NAME},</p>
<p>There's a new reply on your support ticket.</p>

<div class="highlight">
    <div class="detail-row">
        <span class="detail-label">Ticket</span>
        <span class="detail-value">{TICKET_NUMBER}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Subject</span>
        <span class="detail-value">{SUBJECT}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">From</span>
        <span class="detail-value">{REPLY_FROM}</span>
    </div>
</div>

<div style="background: #fafafa; padding: 16px; margin: 16px 0; border: 1px solid #e5e5e5;">
    {REPLY_CONTENT}
</div>

<p style="text-align: center; margin: 32px 0;">
    <a href="{TICKET_URL}" class="button">VIEW & REPLY</a>
</p>
```

---

#### 3. Ticket Status Change

**Subject**: `[{TICKET_NUMBER}] Status: {NEW_STATUS}`

**Trigger**: When ticket status is updated

**Template**:

```html
<h1>TICKET UPDATE</h1>
<p>Hello {RECIPIENT_NAME},</p>
<p>The status of your ticket has been updated.</p>

<div class="highlight">
    <div class="detail-row">
        <span class="detail-label">Ticket</span>
        <span class="detail-value">{TICKET_NUMBER}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Subject</span>
        <span class="detail-value">{SUBJECT}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Previous Status</span>
        <span class="detail-value">{OLD_STATUS}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">New Status</span>
        <span class="detail-value" style="color: #16a34a; font-weight: 600;">{NEW_STATUS}</span>
    </div>
</div>

<p style="text-align: center; margin: 32px 0;">
    <a href="{TICKET_URL}" class="button">VIEW TICKET</a>
</p>
```

---

### Organization Emails

#### 1. Organization Invite

**Subject**: `Invitation to join {ORGANIZATION_NAME}`

**Trigger**: When inviting a user to an organization

**Template**:

```html
<h1>YOU'RE INVITED</h1>
<p>You've been invited to join <strong>{ORGANIZATION_NAME}</strong> on MostlyWhat Systems.</p>

<div class="highlight">
    <div class="detail-row">
        <span class="detail-label">Organization</span>
        <span class="detail-value">{ORGANIZATION_NAME}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Invited By</span>
        <span class="detail-value">{INVITER_NAME}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Role</span>
        <span class="detail-value">{ROLE}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Expires</span>
        <span class="detail-value">{EXPIRES_DATE}</span>
    </div>
</div>

<p>Click the button below to accept this invitation. You may need to create an account if you don't have one.</p>

<p style="text-align: center; margin: 32px 0;">
    <a href="{INVITE_URL}" class="button">ACCEPT INVITATION</a>
</p>

<div class="meta">
    If you weren't expecting this invitation, you can ignore this email.
</div>
```

---

#### 2. Role Changed

**Subject**: `Your role in {ORGANIZATION_NAME} has changed`

**Trigger**: When user's role in organization changes

**Template**:

```html
<h1>ROLE UPDATED</h1>
<p>Hello {RECIPIENT_NAME},</p>
<p>Your role in <strong>{ORGANIZATION_NAME}</strong> has been updated.</p>

<div class="highlight">
    <div class="detail-row">
        <span class="detail-label">Organization</span>
        <span class="detail-value">{ORGANIZATION_NAME}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Previous Role</span>
        <span class="detail-value">{OLD_ROLE}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">New Role</span>
        <span class="detail-value">{NEW_ROLE}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Changed By</span>
        <span class="detail-value">{CHANGED_BY}</span>
    </div>
</div>

<p style="text-align: center; margin: 32px 0;">
    <a href="{ORGANIZATION_URL}" class="button">VIEW ORGANIZATION</a>
</p>
```

---

#### 3. Removed from Organization

**Subject**: `You've been removed from {ORGANIZATION_NAME}`

**Trigger**: When user is removed from organization

**Template**:

```html
<h1>MEMBERSHIP ENDED</h1>
<p>Hello {RECIPIENT_NAME},</p>
<p>You have been removed from <strong>{ORGANIZATION_NAME}</strong>.</p>

<div class="highlight">
    <div class="detail-row">
        <span class="detail-label">Organization</span>
        <span class="detail-value">{ORGANIZATION_NAME}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Removed By</span>
        <span class="detail-value">{REMOVED_BY}</span>
    </div>
</div>

<p>If you believe this was a mistake, please contact the organization administrator.</p>

<div class="meta">
    Your access to organization resources has been revoked.
</div>
```

---

### Project Emails

#### 1. Project Created

**Subject**: `Project Created: {PROJECT_NAME}`

**Trigger**: When a new project is created

**Template**:

```html
<h1>PROJECT CREATED</h1>
<p>Hello {RECIPIENT_NAME},</p>
<p>A new project has been created for <strong>{ORGANIZATION_NAME}</strong>.</p>

<div class="highlight">
    <div class="detail-row">
        <span class="detail-label">Project</span>
        <span class="detail-value">{PROJECT_NUMBER}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Name</span>
        <span class="detail-value">{PROJECT_NAME}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Status</span>
        <span class="detail-value">{STATUS}</span>
    </div>
</div>

<p>You can now track the progress of this project in your portal.</p>

<p style="text-align: center; margin: 32px 0;">
    <a href="{PROJECT_URL}" class="button">VIEW PROJECT</a>
</p>
```

---

#### 2. Project Status Update

**Subject**: `[{PROJECT_NUMBER}] Status: {NEW_STATUS}`

**Trigger**: When project status changes

**Template**:

```html
<h1>PROJECT UPDATE</h1>
<p>Hello {RECIPIENT_NAME},</p>
<p>The status of your project has been updated.</p>

<div class="highlight">
    <div class="detail-row">
        <span class="detail-label">Project</span>
        <span class="detail-value">{PROJECT_NUMBER}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Name</span>
        <span class="detail-value">{PROJECT_NAME}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Previous Status</span>
        <span class="detail-value">{OLD_STATUS}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">New Status</span>
        <span class="detail-value" style="color: #16a34a; font-weight: 600;">{NEW_STATUS}</span>
    </div>
</div>

<p style="text-align: center; margin: 32px 0;">
    <a href="{PROJECT_URL}" class="button">VIEW PROJECT</a>
</p>
```

---

#### 3. Project Milestone Reached

**Subject**: `Milestone Reached: {MILESTONE_NAME}`

**Trigger**: When a project milestone is completed

**Template**:

```html
<h1>MILESTONE COMPLETED</h1>
<p>Hello {RECIPIENT_NAME},</p>
<p>A milestone has been completed on project <strong>{PROJECT_NAME}</strong>.</p>

<div class="highlight">
    <div class="detail-row">
        <span class="detail-label">Project</span>
        <span class="detail-value">{PROJECT_NUMBER}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Milestone</span>
        <span class="detail-value">{MILESTONE_NAME}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Completed</span>
        <span class="detail-value">{COMPLETION_DATE}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Progress</span>
        <span class="detail-value">{PROGRESS_PERCENTAGE}%</span>
    </div>
</div>

<p style="text-align: center; margin: 32px 0;">
    <a href="{PROJECT_URL}" class="button">VIEW PROJECT</a>
</p>
```

---

### Invoice Emails

#### 1. New Invoice

**Subject**: `Invoice {INVOICE_NUMBER} - {CURRENCY} {TOTAL}`

**Trigger**: When an invoice is created/sent

**Template**:

```html
<h1>NEW INVOICE</h1>
<p>Hello {RECIPIENT_NAME},</p>
<p>An invoice has been generated for <strong>{ORGANIZATION_NAME}</strong>.</p>

<div class="highlight">
    <div class="detail-row">
        <span class="detail-label">Invoice</span>
        <span class="detail-value">{INVOICE_NUMBER}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Amount</span>
        <span class="detail-value" style="font-size: 18px; font-weight: 600;">{CURRENCY} {TOTAL}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Due Date</span>
        <span class="detail-value">{DUE_DATE}</span>
    </div>
</div>

<p>Please review and process payment at your earliest convenience.</p>

<p style="text-align: center; margin: 32px 0;">
    <a href="{INVOICE_URL}" class="button">VIEW INVOICE</a>
</p>

<div class="meta">
    If you have questions about this invoice, reply to this email or contact billing@mostlywhat.com
</div>
```

---

#### 2. Payment Reminder

**Subject**: `Payment Reminder: Invoice {INVOICE_NUMBER} ({DAYS_OVERDUE} days overdue)`

**Trigger**: When invoice is past due

**Template**:

```html
<h1>PAYMENT REMINDER</h1>
<p>Hello {RECIPIENT_NAME},</p>
<p>This is a friendly reminder about an outstanding invoice for <strong>{ORGANIZATION_NAME}</strong>.</p>

<div class="highlight" style="border-left-color: #dc2626;">
    <div class="detail-row">
        <span class="detail-label">Invoice</span>
        <span class="detail-value">{INVOICE_NUMBER}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Amount Due</span>
        <span class="detail-value" style="font-size: 18px; font-weight: 600;">{CURRENCY} {TOTAL}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Due Date</span>
        <span class="detail-value">{DUE_DATE}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Days Overdue</span>
        <span class="detail-value" style="color: #dc2626; font-weight: 600;">{DAYS_OVERDUE} days</span>
    </div>
</div>

<p>Please process payment at your earliest convenience to avoid any service interruptions.</p>

<p style="text-align: center; margin: 32px 0;">
    <a href="{INVOICE_URL}" class="button">PAY NOW</a>
</p>

<div class="meta">
    If payment has already been made, please disregard this notice.
</div>
```

---

#### 3. Payment Received

**Subject**: `Payment Received - Invoice {INVOICE_NUMBER}`

**Trigger**: When payment is confirmed

**Template**:

```html
<h1>PAYMENT RECEIVED</h1>
<p>Hello {RECIPIENT_NAME},</p>
<p>Thank you! We've received your payment.</p>

<div class="highlight" style="border-left-color: #16a34a;">
    <div class="detail-row">
        <span class="detail-label">Invoice</span>
        <span class="detail-value">{INVOICE_NUMBER}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Amount Paid</span>
        <span class="detail-value" style="font-size: 18px; font-weight: 600;">{CURRENCY} {AMOUNT_PAID}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Payment Date</span>
        <span class="detail-value">{PAYMENT_DATE}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Payment Method</span>
        <span class="detail-value">{PAYMENT_METHOD}</span>
    </div>
</div>

<p>A receipt has been generated for your records.</p>

<p style="text-align: center; margin: 32px 0;">
    <a href="{RECEIPT_URL}" class="button">VIEW RECEIPT</a>
</p>
```

---

## Authentication Emails (Supabase)

These emails are managed by Supabase Auth. To customize, update `supabase/config.toml`:

### 1. Confirm Email / Signup

**Subject**: `Confirm your MostlyWhat account`

**Supabase Config**:
```toml
[auth.email.template.confirmation]
subject = "Confirm your MostlyWhat account"
content_path = "./supabase/templates/confirmation.html"
```

**Template** (`supabase/templates/confirmation.html`):

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        /* Same base styles as transactional emails */
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="logo">MOSTLYWHAT SYSTEMS</div>
            <div class="header">// VERIFY EMAIL</div>
            
            <h1>CONFIRM YOUR EMAIL</h1>
            <p>Thanks for signing up! Please confirm your email address to activate your account.</p>
            
            <div class="highlight">
                <div class="detail-row">
                    <span class="detail-label">Email</span>
                    <span class="detail-value">{{ .Email }}</span>
                </div>
            </div>
            
            <p style="text-align: center; margin: 32px 0;">
                <a href="{{ .ConfirmationURL }}" class="button">CONFIRM EMAIL</a>
            </p>
            
            <div class="meta">
                This link expires in 24 hours. If you didn't create an account, you can ignore this email.
            </div>
        </div>
        <div class="footer">
            <p>&copy; 2025 MostlyWhat Systems. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

---

### 2. Password Reset

**Subject**: `Reset your MostlyWhat password`

**Supabase Config**:
```toml
[auth.email.template.recovery]
subject = "Reset your MostlyWhat password"
content_path = "./supabase/templates/recovery.html"
```

**Template** (`supabase/templates/recovery.html`):

```html
<h1>RESET PASSWORD</h1>
<p>We received a request to reset your password for your MostlyWhat account.</p>

<div class="highlight">
    <div class="detail-row">
        <span class="detail-label">Account</span>
        <span class="detail-value">{{ .Email }}</span>
    </div>
</div>

<p>Click the button below to set a new password. This link expires in 1 hour.</p>

<p style="text-align: center; margin: 32px 0;">
    <a href="{{ .ConfirmationURL }}" class="button">RESET PASSWORD</a>
</p>

<div class="meta">
    If you didn't request this, you can safely ignore this email. Your password won't change.
</div>
```

---

### 3. Magic Link

**Subject**: `Your MostlyWhat login link`

**Supabase Config**:
```toml
[auth.email.template.magic_link]
subject = "Your MostlyWhat login link"
content_path = "./supabase/templates/magic_link.html"
```

**Template** (`supabase/templates/magic_link.html`):

```html
<h1>MAGIC LINK</h1>
<p>Click the button below to sign in to your MostlyWhat account.</p>

<div class="highlight">
    <div class="detail-row">
        <span class="detail-label">Account</span>
        <span class="detail-value">{{ .Email }}</span>
    </div>
</div>

<p style="text-align: center; margin: 32px 0;">
    <a href="{{ .ConfirmationURL }}" class="button">SIGN IN</a>
</p>

<div class="meta">
    This link expires in 1 hour and can only be used once.
</div>
```

---

### 4. Email Change

**Subject**: `Confirm your new email address`

**Supabase Config**:
```toml
[auth.email.template.email_change]
subject = "Confirm your new email address"
content_path = "./supabase/templates/email_change.html"
```

**Template** (`supabase/templates/email_change.html`):

```html
<h1>CONFIRM NEW EMAIL</h1>
<p>You've requested to change your email address on MostlyWhat.</p>

<div class="highlight">
    <div class="detail-row">
        <span class="detail-label">Old Email</span>
        <span class="detail-value">{{ .Email }}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">New Email</span>
        <span class="detail-value">{{ .NewEmail }}</span>
    </div>
</div>

<p>Click the button below to confirm this change.</p>

<p style="text-align: center; margin: 32px 0;">
    <a href="{{ .ConfirmationURL }}" class="button">CONFIRM CHANGE</a>
</p>

<div class="meta">
    If you didn't request this change, please contact support immediately.
</div>
```

---

### 5. Invite User

**Subject**: `You've been invited to MostlyWhat`

**Supabase Config**:
```toml
[auth.email.template.invite]
subject = "You've been invited to MostlyWhat"
content_path = "./supabase/templates/invite.html"
```

**Template** (`supabase/templates/invite.html`):

```html
<h1>YOU'RE INVITED</h1>
<p>You've been invited to join MostlyWhat Systems.</p>

<p>Click the button below to create your account and get started.</p>

<p style="text-align: center; margin: 32px 0;">
    <a href="{{ .ConfirmationURL }}" class="button">ACCEPT INVITATION</a>
</p>

<div class="meta">
    This invitation expires in 7 days.
</div>
```

---

## Marketing Emails

### 1. Welcome Email

**Subject**: `Welcome to MostlyWhat Systems`

**Trigger**: After email confirmation

```html
<h1>WELCOME</h1>
<p>Hello {USER_NAME},</p>
<p>Welcome to MostlyWhat Systems! We're excited to have you on board.</p>

<p>Here's what you can do next:</p>

<div class="highlight">
    <ul style="margin: 0; padding-left: 20px;">
        <li>Complete your profile</li>
        <li>Create or join an organization</li>
        <li>Explore our services</li>
        <li>Contact support if you need help</li>
    </ul>
</div>

<p style="text-align: center; margin: 32px 0;">
    <a href="{DASHBOARD_URL}" class="button">GET STARTED</a>
</p>

<div class="meta">
    Need help? Contact us at support@mostlywhat.com
</div>
```

---

### 2. Newsletter

**Subject**: `MostlyWhat Updates - {MONTH} {YEAR}`

**Trigger**: Monthly newsletter

```html
<h1>MONTHLY UPDATE</h1>
<p>Hello {RECIPIENT_NAME},</p>
<p>Here's what's new at MostlyWhat Systems this month.</p>

<div class="divider"></div>

<h2 style="font-size: 16px; text-transform: uppercase; letter-spacing: 0.1em;">NEW FEATURES</h2>
{FEATURES_LIST}

<div class="divider"></div>

<h2 style="font-size: 16px; text-transform: uppercase; letter-spacing: 0.1em;">RECENT BLOG POSTS</h2>
{BLOG_POSTS}

<div class="divider"></div>

<p style="text-align: center; margin: 32px 0;">
    <a href="{SITE_URL}" class="button">VISIT OUR SITE</a>
</p>

<div class="meta">
    <a href="{UNSUBSCRIBE_URL}">Unsubscribe from this newsletter</a>
</div>
```

---

## System Notification Emails

### 1. Security Alert

**Subject**: `Security Alert: New login to your account`

**Trigger**: Login from new device/location

```html
<h1>SECURITY ALERT</h1>
<p>Hello {USER_NAME},</p>
<p>We detected a new login to your MostlyWhat account.</p>

<div class="highlight" style="border-left-color: #f59e0b;">
    <div class="detail-row">
        <span class="detail-label">Time</span>
        <span class="detail-value">{LOGIN_TIME}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Location</span>
        <span class="detail-value">{LOCATION}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Device</span>
        <span class="detail-value">{DEVICE}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">IP Address</span>
        <span class="detail-value">{IP_ADDRESS}</span>
    </div>
</div>

<p>If this was you, no action is needed. If you don't recognize this activity, please secure your account immediately.</p>

<p style="text-align: center; margin: 32px 0;">
    <a href="{SECURITY_URL}" class="button">SECURE ACCOUNT</a>
</p>
```

---

### 2. Account Deactivation Warning

**Subject**: `Action Required: Your account will be deactivated`

**Trigger**: Account inactive for extended period

```html
<h1>ACCOUNT NOTICE</h1>
<p>Hello {USER_NAME},</p>
<p>Your MostlyWhat account has been inactive for {DAYS_INACTIVE} days and is scheduled for deactivation.</p>

<div class="highlight" style="border-left-color: #dc2626;">
    <div class="detail-row">
        <span class="detail-label">Deactivation Date</span>
        <span class="detail-value">{DEACTIVATION_DATE}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Last Active</span>
        <span class="detail-value">{LAST_ACTIVE_DATE}</span>
    </div>
</div>

<p>To keep your account active, simply log in before the deactivation date.</p>

<p style="text-align: center; margin: 32px 0;">
    <a href="{LOGIN_URL}" class="button">LOG IN NOW</a>
</p>
```

---

### 3. Service Update

**Subject**: `Service Update: Scheduled Maintenance`

**Trigger**: Planned maintenance

```html
<h1>SERVICE UPDATE</h1>
<p>Hello {USER_NAME},</p>
<p>We'll be performing scheduled maintenance on MostlyWhat Systems.</p>

<div class="highlight">
    <div class="detail-row">
        <span class="detail-label">Date</span>
        <span class="detail-value">{MAINTENANCE_DATE}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Time</span>
        <span class="detail-value">{MAINTENANCE_TIME} (UTC)</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Duration</span>
        <span class="detail-value">{ESTIMATED_DURATION}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Impact</span>
        <span class="detail-value">{IMPACT_DESCRIPTION}</span>
    </div>
</div>

<p>During this time, some services may be temporarily unavailable.</p>

<p style="text-align: center; margin: 32px 0;">
    <a href="{STATUS_URL}" class="button">VIEW STATUS</a>
</p>
```

---

## Implementation Guide

### Using Email Functions

```typescript
import { 
    sendEmail,
    sendProposalEmail,
    sendTicketCreatedEmail,
    sendInvoiceEmail,
    sendInviteEmail
} from '$lib/server/email';

// Send custom email
await sendEmail({
    to: 'user@example.com',
    subject: 'Custom Subject',
    html: '<h1>Hello</h1>',
    text: 'Hello (plain text)',
    replyTo: 'support@mostlywhat.com'
});

// Send proposal email
await sendProposalEmail({
    recipientName: 'John Doe',
    recipientEmail: 'john@example.com',
    proposalNumber: 'PROP-2025-001',
    proposalTitle: 'Website Development',
    organizationName: 'Acme Corp',
    total: '15,000.00',
    currency: 'USD',
    validUntil: new Date('2025-02-15'),
    proposalUrl: 'https://mostlywhat.com/app/proposals/123'
});

// Send ticket email
await sendTicketCreatedEmail({
    recipientName: 'Jane Smith',
    recipientEmail: 'jane@example.com',
    ticketNumber: 'TKT-2025-042',
    subject: 'Login Issue',
    status: 'Open',
    priority: 'High',
    ticketUrl: 'https://mostlywhat.com/app/tickets/42'
});

// Send invoice email
await sendInvoiceEmail({
    recipientName: 'Bob Wilson',
    recipientEmail: 'bob@example.com',
    invoiceNumber: 'INV-2025-015',
    organizationName: 'Tech Corp',
    total: '5,000.00',
    currency: 'USD',
    dueDate: new Date('2025-02-01'),
    invoiceUrl: 'https://mostlywhat.com/app/invoices/15'
});
```

### Testing Emails

1. **Local Development**: Emails are logged to console when `RESEND_API_KEY` is not set
2. **Resend Test Mode**: Use test API key for sandbox testing
3. **Email Preview**: Use Resend's email preview feature

### Best Practices

1. **Always include plain text**: Ensure accessibility for email clients that don't support HTML
2. **Test on multiple clients**: Gmail, Outlook, Apple Mail, mobile clients
3. **Keep subjects concise**: Under 50 characters when possible
4. **Single CTA**: One primary action per email
5. **Unsubscribe links**: Required for marketing emails
6. **Reply-to addresses**: Use appropriate addresses (support@, billing@, noreply@)

---

## Variable Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `{RECIPIENT_NAME}` | User's full name | John Doe |
| `{RECIPIENT_EMAIL}` | User's email | john@example.com |
| `{ORGANIZATION_NAME}` | Organization name | Acme Corp |
| `{INVOICE_NUMBER}` | Invoice ID | INV-2025-001 |
| `{PROPOSAL_NUMBER}` | Proposal ID | PROP-2025-001 |
| `{TICKET_NUMBER}` | Ticket ID | TKT-2025-001 |
| `{PROJECT_NUMBER}` | Project ID | PRJ-2025-001 |
| `{CURRENCY}` | Currency code | USD, THB |
| `{TOTAL}` | Formatted amount | 15,000.00 |
| `{STATUS}` | Status label | Open, Closed |
| `{*_URL}` | Deep link URLs | https://... |
| `{*_DATE}` | Formatted dates | January 15, 2025 |

---

*Last updated: January 2025*
