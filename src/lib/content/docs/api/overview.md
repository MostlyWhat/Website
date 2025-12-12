---
title: "API Overview"
description: "Complete API documentation for MostlyWhat Systems services and endpoints."
category: "api"
order: 1
---

# API Overview

Welcome to the MostlyWhat Systems API documentation. Our APIs provide programmatic access to various services and functionality.

## Base URL

All API requests should be made to:

```
https://api.mostlywhat.io/v1
```

## Authentication

Most endpoints require authentication via API keys. Include your API key in the `Authorization` header:

```bash
Authorization: Bearer YOUR_API_KEY
```

## Rate Limiting

API requests are rate limited to ensure fair usage:

| Plan | Requests/minute | Requests/day |
|------|-----------------|--------------|
| Free | 60 | 1,000 |
| Pro | 300 | 10,000 |
| Enterprise | Unlimited | Unlimited |

## Response Format

All responses are returned in JSON format:

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

## Error Handling

Errors follow a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request was invalid",
    "details": { ... }
  }
}
```

## Available Endpoints

- **Contact API** — Submit contact form data
- **Search API** — Full-text search functionality

See individual endpoint documentation for details.
