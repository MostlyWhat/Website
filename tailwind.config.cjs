module.exports = {
    content: [
        './public/**/*.html',
        './src/**/*.{astro,js,jsx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {},
    },
    plugins: [
        require('tailwind-scrollbar-hide'),
    ],
}