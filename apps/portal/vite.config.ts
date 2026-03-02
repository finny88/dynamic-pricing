import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
	base: command === 'build' ? '/dynamic-pricing/' : '/',
	server: {
		host: '127.0.0.1', // Explicitly set the host to 127.0.0.1
	},
	plugins: [
		checker({
			typescript: {
				tsconfigPath: './tsconfig.app.json', // Adjust path as needed
			},
		}),
		react(),
		tsconfigPaths(),
		svgr()
	],
}))
