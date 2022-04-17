import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  devOptions: {
    tailwindConfig: './tailwind.config.js',
  },
  buildOptions: {
    site: 'http://www.mostlywhat.cf',
    sitemap: true,
  },
  devOptions: {
    // hostname: 'localhost',  // The hostname to run the dev server on.
    // port: 3000,             // The port to run the dev server on.
  },
  renderers: [],
  adapter: vercel(),
});