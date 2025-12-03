---
title: "Contact API"
description: "Submit and manage contact form submissions via the API."
category: "api"
order: 3
---

# Contact API

The Contact API allows you to submit and manage contact form data programmatically.

## Endpoints

### Submit Contact Form

`POST /v1/contact`

Submit a new contact form entry.

#### Request

```bash
curl -X POST https://api.mostlywhat.io/v1/contact \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Acme Inc",
    "message": "I would like to learn more about your services."
  }'
```

#### Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Full name of the contact |
| `email` | string | Yes | Valid email address |
| `company` | string | No | Company or organization name |
| `message` | string | Yes | Contact message (max 5000 chars) |
| `phone` | string | No | Phone number |
| `subject` | string | No | Message subject |

#### Response

```json
{
  "success": true,
  "data": {
    "id": "cnt_abc123",
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Acme Inc",
    "message": "I would like to learn more about your services.",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Get Contact Submissions

`GET /v1/contact`

Retrieve a list of contact submissions (requires admin scope).

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page (max 100) |
| `status` | string | all | Filter by status |

## Error Codes

| Code | Description |
|------|-------------|
| `INVALID_EMAIL` | Email address is invalid |
| `MESSAGE_TOO_LONG` | Message exceeds 5000 characters |
| `RATE_LIMITED` | Too many submissions |
