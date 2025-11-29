---
title: "Why We Chose SvelteKit Over Next.js"
slug: "sveltekit-over-nextjs"
category: "Engineering"
date: "2024-10-20"
excerpt: "Our experience migrating to SvelteKit and why it's our framework of choice."
readTime: "6 MIN"
author: "Prem (MostlyWhat)"
featured: true
tags: ["SvelteKit", "Next.js", "Framework Comparison", "Performance"]
---

# Why We Chose SvelteKit Over Next.js

After building dozens of projects with React and Next.js, we made the switch to SvelteKit. Here's why—and what we learned along the way.

## The Performance Argument

Let's start with the numbers. For a typical marketing page:

| Metric | Next.js | SvelteKit |
|--------|---------|-----------|
| Bundle Size | ~85KB | ~15KB |
| TTI | 1.8s | 0.9s |
| LCP | 2.2s | 1.1s |

SvelteKit's compiler approach means no virtual DOM and minimal runtime overhead. The result? Faster sites with less JavaScript shipped to the client.

## Developer Experience

React's mental model of "UI as a function of state" is powerful but comes with complexity:

```jsx
// React: Hooks, effects, dependencies
const [count, setCount] = useState(0);
useEffect(() => {
  document.title = `Count: ${count}`;
}, [count]);
```

Compare with Svelte's intuitive approach:

```svelte
<script>
  let count = 0;
  $: document.title = `Count: ${count}`;
</script>
```

Svelte's reactivity just works. No hooks rules to memorize, no dependency arrays to manage.

## Full-Stack Simplicity

SvelteKit's approach to full-stack development feels natural:

```typescript
// +page.server.ts
export async function load({ params }) {
  const post = await db.posts.findUnique({
    where: { slug: params.slug }
  });
  return { post };
}
```

Form actions, API routes, and server-side rendering are all first-class citizens with a unified mental model.

## The Transition Experience

### What Went Well
- **Faster builds**: HMR is nearly instant
- **Simpler code**: Components are more readable
- **Better performance**: Out of the box, with less effort

### Challenges
- **Smaller ecosystem**: Fewer UI libraries, but growing
- **Learning curve**: Different patterns take time to internalize
- **Hiring**: Fewer Svelte developers (but they're passionate!)

## When to Choose What

**Choose SvelteKit when:**
- Performance is critical
- You want minimal boilerplate
- Building marketing sites or content-heavy apps
- Your team is open to learning

**Consider Next.js when:**
- You need extensive React ecosystem support
- Team is deeply invested in React
- Hiring React developers is a priority

## Conclusion

We haven't looked back since switching to SvelteKit. The combination of excellent DX, superior performance, and elegant API design makes it our default choice for new projects.

---

*Curious about SvelteKit for your project? [Let's talk](/contact).*
