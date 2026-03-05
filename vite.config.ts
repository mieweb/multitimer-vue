import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	server: {
		proxy: {
			'/api/redmine': {
				target: 'https://pm.mieweb.com',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api\/redmine/, '')
			}
		}
	},
	build: {
		chunkSizeWarningLimit: 800
	},
	define: {
		MULTITIMER_VERSION: JSON.stringify(process.env.npm_package_version)
	}
});
