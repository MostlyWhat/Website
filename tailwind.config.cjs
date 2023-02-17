const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				primary: {
					50: '#f2f9ff',
					100: '#e6f4ff',
					200: '#cfeaff',
					300: '#b5e0ff',
					400: '#8fd6ff',
					500: '#00A3FF',
					600: '#0088D8',
					700: '#006EB3',
					800: '#00538D',
					900: '#003966',
				},
				secondary: {
					50: '#f9f9f9',
					100: '#f3f3f3',
					200: '#e6e6e6',
					300: '#d9d9d9',
					400: '#bfbfbf',
					500: '#FFD500',
					600: '#d8b800',
					700: '#b39900',
					800: '#8d7a00',
					900: '#665c00',
				},
				tertiary: {
					50: '#f9f9f9',
					100: '#f3f3f3',
					200: '#e6e6e6',
					300: '#d9d9d9',
					400: '#bfbfbf',
					500: '#EF4444',
					600: '#d83a3a',
					700: '#b32d2d',
					800: '#8d2121',
					900: '#661616',
				},
				accent: {
					yellow: '#FFD500',
					blue: '#00A3FF',
					red: '#EF4444',
				},
				success: '#A5BE00',
				warning: '#FF6700',
				danger: '#DD1C1A',
				background: '#000814',
			},
		},
	},
	plugins: [require('@tailwindcss/typography')],
	darkMode: 'class',
};