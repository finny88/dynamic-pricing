import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import checker from 'vite-plugin-checker'
import svgr from 'vite-plugin-svgr'

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
