# API Documentation

## Overview

This document provides comprehensive documentation for the MostlyWhat CRM API endpoints. All API endpoints require authentication unless otherwise specified.

## Authentication

API requests use session-based authentication via SvelteKit's `auth()` helper.

```typescript
// Get the authenticated user
import { auth } from '$lib/server/auth';

export async function load(event) {
  const session = await auth(event);
  if (!session?.userId) {
    throw redirect(303, '/auth/login');
  }
}
```

## Base URL

```
https://your-domain.com/api
```

## Common Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## Tickets API

### GET /api/tickets

Get all tickets for the authenticated user's organization.

**Query Parameters:**
- `status` (optional): Filter by status
- `priority` (optional): Filter by priority
- `assignedToId` (optional): Filter by assigned user
- `customerId` (optional): Filter by customer
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Pagination offset

**Response:**
```json
{
  "success": true,
  "data": {
    "tickets": [ ... ],
    "total": 100,
    "limit": 50,
    "offset": 0
  }
}
```

### POST /api/tickets

Create a new ticket.

**Request Body:**
```json
{
  "title": "Website down",
  "description": "The website is not loading",
  "priority": "high",
  "scope": "technical_support",
  "customerId": "uuid",
  "assignedToId": "uuid" (optional)
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ticket": { ... }
  }
}
```

### GET /api/tickets/[id]

Get a specific ticket by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "ticket": { ... },
    "comments": [ ... ],
    "attachments": [ ... ]
  }
}
```

### PATCH /api/tickets/[id]

Update a ticket.

**Request Body:**
```json
{
  "title": "Updated title" (optional),
  "description": "Updated description" (optional),
  "status": "in_progress" (optional),
  "priority": "high" (optional),
  "assignedToId": "uuid" (optional)
}
```

### DELETE /api/tickets/[id]

Delete a ticket.

**Response:**
```json
{
  "success": true
}
```

---

## Projects API

### GET /api/projects

Get all projects.

**Query Parameters:**
- `status` (optional): Filter by status
- `phase` (optional): Filter by phase
- `customerId` (optional): Filter by customer

**Response:**
```json
{
  "success": true,
  "data": {
    "projects": [ ... ]
  }
}
```

### POST /api/projects

Create a new project.

**Request Body:**
```json
{
  "name": "Website Redesign",
  "description": "Complete website overhaul",
  "customerId": "uuid",
  "phase": "planning",
  "estimatedBudget": 50000,
  "startDate": "2024-01-15",
  "endDate": "2024-06-15"
}
```

### GET /api/projects/[id]

Get a specific project.

### PATCH /api/projects/[id]

Update a project.

### DELETE /api/projects/[id]

Delete a project.

---

## Invoices API

### GET /api/invoices

Get all invoices.

**Query Parameters:**
- `status` (optional): paid, pending, overdue, draft
- `customerId` (optional): Filter by customer

### POST /api/invoices

Create a new invoice.

**Request Body:**
```json
{
  "customerId": "uuid",
  "projectId": "uuid" (optional),
  "lineItems": [
    {
      "description": "Website Design",
      "quantity": 1,
      "unitPrice": 5000
    }
  ],
  "dueDate": "2024-02-15",
  "notes": "Payment due within 30 days"
}
```

### GET /api/invoices/[id]

Get a specific invoice.

### PATCH /api/invoices/[id]

Update an invoice.

### POST /api/invoices/[id]/send

Send an invoice to the customer.

---

## Stripe Payment API

### POST /api/stripe/create-payment-intent

Create a Stripe payment intent for an invoice.

**Request Body:**
```json
{
  "invoiceId": "uuid",
  "customerId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_xxx_secret_xxx",
    "paymentIntentId": "pi_xxx"
  }
}
```

### POST /api/stripe/create-checkout-session

Create a hosted checkout session.

**Request Body:**
```json
{
  "invoiceId": "uuid",
  "customerId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "cs_test_xxx",
    "url": "https://checkout.stripe.com/xxx"
  }
}
```

### POST /api/stripe/webhook

Webhook endpoint for Stripe events. Requires valid webhook signature.

**Headers:**
- `stripe-signature`: HMAC signature from Stripe

**Events Handled:**
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `checkout.session.completed`
- `charge.refunded`

---

## Time Tracking API

### POST /api/time-entries/start

Start a new time entry.

**Request Body:**
```json
{
  "ticketId": "uuid" (optional),
  "projectId": "uuid" (optional),
  "description": "Working on bug fix",
  "isBillable": true,
  "hourlyRate": 150
}
```

### POST /api/time-entries/[id]/stop

Stop an active time entry.

**Response:**
```json
{
  "success": true,
  "data": {
    "entry": {
      "id": "uuid",
      "duration": 120,  // minutes
      "totalAmount": "300.00"
    }
  }
}
```

### GET /api/time-entries

Get time entries.

**Query Parameters:**
- `ticketId` (optional): Filter by ticket
- `projectId` (optional): Filter by project
- `userId` (optional): Filter by user
- `startDate` (optional): Filter by date range
- `endDate` (optional): Filter by date range

---

## Webhooks API

### GET /api/webhooks

Get all webhooks for the organization.

### POST /api/webhooks

Create a new webhook subscription.

**Request Body:**
```json
{
  "url": "https://your-app.com/webhook",
  "events": [
    "ticket.created",
    "ticket.updated",
    "invoice.paid"
  ],
  "description": "Notify external system",
  "organizationId": "uuid" (optional - filter by org),
  "projectId": "uuid" (optional - filter by project)
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "webhook": { ... },
    "secret": "whsec_xxx"  // Save this for signature verification
  }
}
```

### DELETE /api/webhooks/[id]

Delete a webhook subscription.

### GET /api/webhooks/[id]/deliveries

Get delivery history for a webhook.

---

## Templates API

### GET /api/templates/tickets

Get ticket templates.

**Query Parameters:**
- `category` (optional): Filter by category
- `isPublic` (optional): Show only public templates

### POST /api/templates/tickets

Create a ticket template.

**Request Body:**
```json
{
  "name": "Bug Report",
  "description": "Standard bug report template",
  "category": "support",
  "isPublic": true,
  "title": "[BUG] {title}",
  "content": "**Steps to reproduce:**\n\n...",
  "priority": "medium",
  "scope": "technical_support"
}
```

### POST /api/templates/tickets/[id]/use

Create a ticket from a template.

**Request Body:**
```json
{
  "customerId": "uuid",
  "assignedToId": "uuid" (optional)
}
```

### GET /api/templates/projects

Get project templates.

### POST /api/templates/projects

Create a project template.

### POST /api/templates/projects/[id]/use

Create a project from a template.

---

## Search API

### GET /api/search

Global search across tickets, projects, and customers.

**Query Parameters:**
- `q`: Search query
- `limit` (optional): Number of results per type (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "tickets": [ ... ],
    "projects": [ ... ],
    "customers": [ ... ],
    "total": 15
  }
}
```

### POST /api/search/tickets

Advanced ticket search with filters.

**Request Body:**
```json
{
  "textSearch": "bug",
  "statuses": ["new", "in_progress"],
  "priorities": ["high", "critical"],
  "dateRange": {
    "field": "createdAt",
    "start": "2024-01-01",
    "end": "2024-01-31"
  },
  "sort": {
    "field": "createdAt",
    "direction": "desc"
  },
  "limit": 50,
  "offset": 0
}
```

### POST /api/search/projects

Advanced project search with filters.

---

## Analytics API

### GET /api/analytics/tickets

Get ticket metrics.

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 500,
    "byStatus": {
      "new": 50,
      "in_progress": 100,
      "resolved": 300,
      "closed": 50
    },
    "byPriority": { ... },
    "avgResolutionTime": 24.5,  // hours
    "trend": [ ... ]
  }
}
```

### GET /api/analytics/projects

Get project metrics.

### GET /api/analytics/revenue

Get revenue metrics.

### GET /api/analytics/staff

Get staff performance metrics.

---

## Export API

### GET /api/export/tickets/csv

Export ticket metrics as CSV.

### GET /api/export/projects/csv

Export project metrics as CSV.

### GET /api/export/invoices/csv

Export invoice metrics as CSV.

### GET /api/export/report/pdf

Generate comprehensive PDF report.

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation error |
| 500 | Internal Server Error |

---

## Rate Limiting

API requests are rate-limited to 100 requests per minute per user.

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## Webhook Signature Verification

Verify webhook signatures using HMAC SHA-256:

```typescript
import crypto from 'node:crypto';

function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

---

## SDK Examples

### JavaScript/TypeScript

```typescript
// Create a ticket
const response = await fetch('/api/tickets', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Bug Report',
    description: 'Found a bug',
    priority: 'high',
    customerId: 'customer-uuid'
  })
});

const { data } = await response.json();
```

### Python

```python
import requests

response = requests.post(
    'https://your-domain.com/api/tickets',
    json={
        'title': 'Bug Report',
        'description': 'Found a bug',
        'priority': 'high',
        'customerId': 'customer-uuid'
    }
)

data = response.json()['data']
```

---

## Pagination

Paginated endpoints use `limit` and `offset` parameters:

```
GET /api/tickets?limit=50&offset=100
```

**Response includes pagination metadata:**
```json
{
  "data": { ... },
  "total": 500,
  "limit": 50,
  "offset": 100
}
```

---

## Changelog

### v1.0.0 (2024-01-15)
- Initial API release
- Tickets, Projects, Invoices CRUD
- Stripe payment integration
- Time tracking
- Webhooks
- Templates
- Advanced search
- Analytics
