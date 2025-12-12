# Caching Implementation Guide

This document explains the caching strategy implemented in the application for optimal performance.

## Overview

The application uses a multi-layer caching strategy:

1. **Browser Cache** - Client-side caching via Cache-Control headers
2. **CDN/Edge Cache** - Cloudflare caching at the edge
3. **Database Connection Pooling** - Connection reuse for database queries

## Cache Utility (`src/lib/server/utils/cache.ts`)

### Predefined Cache Presets

The application provides several cache presets for common use cases:

#### `CachePresets.STATIC_LONG`
- **Max-Age**: 10 minutes (600s)
- **Stale-While-Revalidate**: 1 hour (3600s)
- **Use For**: Support articles, documentation, legal pages
- **Example**: [support/articles/+page.server.ts](../../src/routes/(marketing)/support/articles/+page.server.ts)

#### `CachePresets.DYNAMIC_MEDIUM`
- **Max-Age**: 5 minutes (300s)
- **Stale-While-Revalidate**: 30 minutes (1800s)
- **Use For**: Blog posts, projects, careers
- **Example**: [blog/+page.server.ts](../../src/routes/(marketing)/blog/+page.server.ts)

#### `CachePresets.REALTIME_SHORT`
- **Max-Age**: 1 minute (60s)
- **Stale-While-Revalidate**: 5 minutes (300s)
- **Use For**: Status pages, notifications, live data
- **Example**: [status/+page.server.ts](../../src/routes/(marketing)/status/+page.server.ts)

#### `CachePresets.API_RESPONSE`
- **Max-Age**: 5 minutes (300s)
- **Stale-While-Revalidate**: 10 minutes (600s)
- **Use For**: API responses with relatively static data
- **Example**: [api/search/+server.ts](../../src/routes/api/search/+server.ts)

#### `CachePresets.PRIVATE`
- **Max-Age**: 5 minutes (300s)
- **Visibility**: private (browser only)
- **Use For**: Authenticated/personalized content
- **Example**: User dashboard, notifications

#### `CachePresets.NO_CACHE`
- **Max-Age**: 0
- **Use For**: Forms, authentication, sensitive data

#### `CachePresets.IMMUTABLE`
- **Max-Age**: 1 year (31536000s)
- **Immutable**: true
- **Use For**: Hashed static assets (CSS, JS, images)

## Implementation

### In SvelteKit Page Load Functions

```typescript
import type { PageServerLoad } from './$types';
import { CachePresets, setCacheHeaders } from '$lib/server/utils/cache';

export const load: PageServerLoad = async ({ setHeaders }) => {
    // Set cache headers using preset
    setCacheHeaders(setHeaders, CachePresets.DYNAMIC_MEDIUM);
    
    // ... load data
    return { data };
};
```

### In API Endpoints

```typescript
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { CachePresets, setCacheHeaders } from '$lib/server/utils/cache';

export const GET: RequestHandler = async ({ setHeaders }) => {
    const data = await fetchData();
    
    // Cache API response
    setCacheHeaders(setHeaders, CachePresets.API_RESPONSE);
    
    return json(data);
};
```

### Custom Cache Configuration

```typescript
import { setCacheHeaders } from '$lib/server/utils/cache';

export const load: PageServerLoad = async ({ setHeaders }) => {
    // Custom cache configuration
    setCacheHeaders(setHeaders, {
        maxAge: 600,              // 10 minutes
        staleWhileRevalidate: 3600, // 1 hour SWR
        visibility: 'public'
    });
    
    return { data };
};
```

## Current Implementation

### Cached Pages

✅ **Blog Page** ([src/routes/(marketing)/blog/+page.server.ts](../../src/routes/(marketing)/blog/+page.server.ts))
- Preset: `DYNAMIC_MEDIUM`
- Cache: 5 minutes
- SWR: 30 minutes

✅ **Projects Page** ([src/routes/(marketing)/projects/+page.server.ts](../../src/routes/(marketing)/projects/+page.server.ts))
- Preset: `DYNAMIC_MEDIUM`
- Cache: 5 minutes
- SWR: 30 minutes

✅ **Status Page** ([src/routes/(marketing)/status/+page.server.ts](../../src/routes/(marketing)/status/+page.server.ts))
- Preset: `REALTIME_SHORT`
- Cache: 1 minute
- SWR: 5 minutes

✅ **Careers Page** ([src/routes/(marketing)/careers/+page.server.ts](../../src/routes/(marketing)/careers/+page.server.ts))
- Preset: `DYNAMIC_MEDIUM`
- Cache: 5 minutes
- SWR: 30 minutes

✅ **Support Articles** ([src/routes/(marketing)/support/articles/+page.server.ts](../../src/routes/(marketing)/support/articles/+page.server.ts))
- Preset: `STATIC_LONG`
- Cache: 10 minutes
- SWR: 1 hour

### Cached API Endpoints

✅ **Search API** ([src/routes/api/search/+server.ts](../../src/routes/api/search/+server.ts))
- Preset: `API_RESPONSE`
- Cache: 5 minutes
- SWR: 10 minutes

## App Pages (Authenticated Users)

✅ **App Dashboard** ([src/routes/(app)/app/+page.server.ts](../../src/routes/(app)/app/+page.server.ts))
- Preset: `PRIVATE`
- Cache: 5 minutes (browser only)
- Note: No CDN caching for personalized data

✅ **App Projects** ([src/routes/(app)/app/projects/+page.server.ts](../../src/routes/(app)/app/projects/+page.server.ts))
- Preset: `PRIVATE`
- Cache: 5 minutes (browser only)
- Note: No CDN caching for personalized data

✅ **App Tickets** ([src/routes/(app)/app/tickets/+page.server.ts](../../src/routes/(app)/app/tickets/+page.server.ts))
- Preset: `PRIVATE`
- Cache: 5 minutes (browser only)
- Note: No CDN caching for personalized data

## Admin Pages

✅ **Admin Dashboard** ([src/routes/(admin)/admin/+page.server.ts](../../src/routes/(admin)/admin/+page.server.ts))
- Preset: `NO_CACHE`
- Cache: None
- Note: Sensitive admin data requires fresh fetch every time

## Cache Invalidation

### Automatic Invalidation

Browser and CDN caches will automatically expire based on the Cache-Control headers. Stale-While-Revalidate (SWR) ensures users get fast responses even when cache is expired.

### Manual Invalidation (Future)

For immediate cache invalidation when content is updated (e.g., publishing a blog post), implement cache purging:

```typescript
// Example: Clear blog cache after publishing
export const actions = {
    publish: async ({ request }) => {
        // ... publish blog post
        
        // Purge Cloudflare cache
        await fetch(`https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${CF_API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                files: [
                    'https://yoursite.com/blog',
                    `https://yoursite.com/blog/${slug}`
                ]
            })
        });
        
        return { success: true };
    }
};
```

## Performance Benefits

### Expected Improvements

**Without Caching:**
- Page load: 200-500ms (database query + rendering)
- API calls: 100-300ms per request
- Server load: High (every request hits database)

**With Caching:**
- Cached page load: 20-50ms (served from edge)
- SWR page load: 30-80ms (stale content, revalidate in background)
- Cached API: 10-30ms (served from edge)
- Server load: 80-95% reduction during cache hits

### Cache Hit Ratio Targets

- **Public pages**: 70-90% cache hit ratio
- **API endpoints**: 60-80% cache hit ratio
- **Static assets**: 95%+ cache hit ratio

## Monitoring

### Key Metrics to Track

1. **Cache Hit Ratio**: Percentage of requests served from cache
2. **Response Time**: P50, P95, P99 latency
3. **Server Load**: Database query count reduction
4. **TTFB**: Time to First Byte improvement

### Cloudflare Analytics

View cache performance in Cloudflare dashboard:
- Caching > Overview
- Analytics > Performance

## Best Practices

### DO ✅

- Use appropriate cache presets for content type
- Set longer cache times for rarely-changing content
- Use stale-while-revalidate for better UX
- Cache public pages and API responses
- Use `private` for authenticated content

### DON'T ❌

- Cache authenticated/personalized data with `public`
- Set very long cache times on frequently-changing content
- Forget to implement cache invalidation for admin actions
- Cache form submission responses
- Use same cache duration for all content types

## Troubleshooting

### Cache Not Working

1. Check Cache-Control headers in browser DevTools (Network tab)
2. Verify Cloudflare caching rules don't override headers
3. Check for `Set-Cookie` headers (may prevent caching)
4. Ensure `public` visibility for CDN caching

### Stale Content Showing

1. Reduce `max-age` value for more frequent updates
2. Implement cache invalidation on content updates
3. Use shorter SWR window for time-sensitive content

### Too Many Database Queries

1. Verify cache headers are actually set
2. Check cache hit ratio in Cloudflare
3. Ensure no cache-busting parameters in URLs
4. Review page for client-side API calls without caching

## Future Enhancements

- [ ] Add Cloudflare Cache API for programmatic cache control
- [ ] Implement cache warming on deployment
- [ ] Add cache invalidation to admin actions
- [ ] Set up cache analytics dashboard
- [ ] Add Redis/KV cache layer for expensive computations
- [ ] Implement fragment caching for partial page updates

## Related Documentation

- [System Architecture](../architecture/SYSTEM_ARCHITECTURE.md#performance-optimization)
- [Performance Optimization](../architecture/SYSTEM_ARCHITECTURE.md#135-caching-strategy)
- [SvelteKit Caching](https://kit.svelte.dev/docs/page-options#cache)
- [Cloudflare Cache](https://developers.cloudflare.com/cache/)
