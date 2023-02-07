import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	build: {
		chunkSizeWarningLimit: 800
	},
	define: {
		MULTITIMER_VERSION: JSON.stringify(process.env.npm_package_version)
	}
});
