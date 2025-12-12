---
title: "Deployment"
description: "Deploying web applications to Cloudflare Pages, Vercel, and other platforms."
category: "products"
order: 4
---

# Deployment

Deploy your applications to the edge for maximum performance and reliability.

## Cloudflare Pages

Our recommended deployment platform for most projects.

### Setup

1. Connect your GitHub repository to Cloudflare Pages
2. Configure build settings:
   - Build command: `pnpm build`
   - Output directory: `.svelte-kit/cloudflare`
3. Add environment variables
4. Deploy!

### Configuration

```jsonc
// wrangler.jsonc
{
  "name": "my-app",
  "compatibility_date": "2024-01-01",
  "pages_build_output_dir": ".svelte-kit/cloudflare"
}
```

## Vercel

Alternative deployment platform with excellent SvelteKit support.

### Setup

```bash
# Install Vercel CLI
pnpm i -g vercel

# Deploy
vercel
```

### Configuration

```json
{
  "framework": "sveltekit",
  "buildCommand": "pnpm build",
  "outputDirectory": ".svelte-kit"
}
```

## Environment Variables

Always use environment variables for sensitive configuration:

```bash
# .env
DATABASE_URL=your-database-url
API_KEY=your-api-key
```

Access in SvelteKit:

```typescript
import { env } from '$env/dynamic/private';

const dbUrl = env.DATABASE_URL;
```

## Coming Soon

- CI/CD pipeline examples
- Preview deployments
- Custom domains
- SSL configuration
