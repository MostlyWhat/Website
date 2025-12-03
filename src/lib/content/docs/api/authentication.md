---
title: "Authentication"
description: "API authentication methods, API keys, and security best practices."
category: "api"
order: 2
---

# Authentication

Secure your API requests with proper authentication.

## API Keys

API keys are the primary authentication method for our APIs.

### Obtaining an API Key

1. Log in to your dashboard
2. Navigate to Settings → API Keys
3. Click "Generate New Key"
4. Copy and securely store your key

### Using API Keys

Include your API key in the `Authorization` header:

```bash
curl -X GET https://api.mostlywhat.io/v1/status \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Security Best Practices

### Do's

- ✅ Store API keys in environment variables
- ✅ Rotate keys periodically
- ✅ Use different keys for development and production
- ✅ Monitor API usage for anomalies

### Don'ts

- ❌ Commit API keys to version control
- ❌ Share keys between applications
- ❌ Expose keys in client-side code
- ❌ Use the same key across environments

## Key Scopes

API keys can have different permission scopes:

| Scope | Description |
|-------|-------------|
| `read` | Read-only access |
| `write` | Create and update access |
| `delete` | Delete access |
| `admin` | Full administrative access |

## Rate Limit Headers

Every response includes rate limit information:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1704067200
```

## Coming Soon

- OAuth 2.0 support
- JWT authentication
- Webhook signatures
