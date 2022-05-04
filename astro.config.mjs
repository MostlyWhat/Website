import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), sitemap()],
  adapter: vercel()
});