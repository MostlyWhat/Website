const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--trajectory-color-primary)',
        secondary: 'var(--trajectory-color-secondary)',
        accent: 'var(--trajectory-color-accent)',
        default: 'var(--trajectory-color-text-default)',
        muted: 'var(--trajectory-color-text-muted)',
      },
      fontFamily: {
        sans: ['var(--trajectory-font-sans)', ...defaultTheme.fontFamily.sans],
        serif: ['var(--trajectory-font-serif)', ...defaultTheme.fontFamily.serif],
        heading: ['var(--trajectory-font-heading)', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
  darkMode: 'class',
};
