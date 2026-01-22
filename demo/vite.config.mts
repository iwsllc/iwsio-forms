/// <reference types="vitest" />

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ mode }) => ({
	plugins: [tailwindcss(), react()],
	build: {
		assetsDir: 'res',
		minify: mode === 'production',
		sourcemap: mode !== 'production',
		emptyOutDir: true,
		outDir: './dist'

		// when using multiple entry points
		// rollupOptions: {
		// 	input: {
		// 		'main': resolve(__dirname, 'index.html'),
		// 		'json-csv-core': resolve(__dirname, 'src/examples/json-csv-core/index.tsx'),
		// 		'snippets': resolve(__dirname, 'src/examples/snippets/index.tsx'),
		// 		'watcher': resolve(__dirname, 'src/examples/watcher/index.tsx')
		// 	}
		// }
	},
	server: {
		host: '0.0.0.0',
		port: 3000,
		strictPort: true,
		allowedHosts: ['client', 'server', 'proxy', 'localhost']
	},
	test: {
		globals: true,
		mockReset: true,
		environment: 'jsdom',
		setupFiles: ['./setupTests.cts']
	}
}))
