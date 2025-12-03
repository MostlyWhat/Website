---
title: "Search API"
description: "Full-text search functionality for content and data."
category: "api"
order: 4
---

# Search API

The Search API provides full-text search capabilities across your content.

## Endpoints

### Search

`GET /v1/search`

Perform a full-text search query.

#### Request

```bash
curl -X GET "https://api.mostlywhat.io/v1/search?q=sveltekit&type=docs" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | Yes | Search query |
| `type` | string | No | Content type filter |
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Results per page (default: 10, max: 50) |

#### Response

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "doc_123",
        "type": "docs",
        "title": "Getting Started with SvelteKit",
        "excerpt": "Learn how to build modern web applications...",
        "url": "/docs/products/sveltekit",
        "score": 0.95
      }
    ],
    "total": 42,
    "page": 1,
    "totalPages": 5
  }
}
```

## Search Syntax

### Basic Search

```
sveltekit tutorial
```

Finds documents containing both "sveltekit" and "tutorial".

### Phrase Search

```
"getting started"
```

Finds exact phrase matches.

### Boolean Operators

```
sveltekit AND typescript
sveltekit OR nextjs
sveltekit NOT react
```

### Field-Specific Search

```
title:components
category:products
```

## Content Types

| Type | Description |
|------|-------------|
| `docs` | Documentation pages |
| `blog` | Blog posts |
| `services` | Service pages |
| `projects` | Project showcases |

## Response Codes

| Code | Description |
|------|-------------|
| `200` | Successful search |
| `400` | Invalid query syntax |
| `429` | Rate limit exceeded |
