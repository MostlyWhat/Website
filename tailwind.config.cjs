module.exports = {
    content: [
        './public/**/*.html',
        './node_modules/flowbite/**/*.js',
        './src/**/*.{astro,js,jsx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {},
    },
    plugins: [
        require('tailwind-scrollbar-hide'),
        require('flowbite/plugin'),
    ],
}