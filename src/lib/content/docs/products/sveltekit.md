---
title: "SvelteKit Apps"
description: "Building full-stack web applications with SvelteKit and our design system."
category: "products"
order: 3
---

# SvelteKit Applications

SvelteKit is our framework of choice for building modern web applications. It provides excellent developer experience, performance, and flexibility.

## Why SvelteKit?

- **Performance** — Smaller bundles, faster load times
- **Developer Experience** — Simple, intuitive API
- **Flexibility** — SSR, SPA, or static generation
- **Full-Stack** — API routes built-in

## Quick Start

```bash
# Create new project
pnpm create svelte@latest my-app

# Install dependencies
cd my-app
pnpm install

# Start development server
pnpm dev
```

## Project Configuration

### svelte.config.js

```javascript
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    alias: {
      '$lib': './src/lib'
    }
  }
};
```

## Best Practices

1. **Use TypeScript** — Better tooling and fewer bugs
2. **Organize by feature** — Group related files together
3. **Server-side first** — Load data on the server when possible
4. **Progressive enhancement** — Works without JavaScript

## Coming Soon

- Complete project templates
- Authentication patterns
- State management guides
- Testing strategies
