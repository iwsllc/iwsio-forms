/** @type {import('tailwindcss').Config} */

module.exports = {
	mode: 'jit',
	future: {
		hoverOnlyWhenSupported: true
	},
	content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html', './dist/content/**/*.html', '../forms/src/**/*.{jsx,js,tsx,ts}'],
	plugins: [require('@tailwindcss/typography'), require('daisyui')]
}
