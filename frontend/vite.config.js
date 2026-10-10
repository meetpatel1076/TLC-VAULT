import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [tailwindcss(), react()],
  
  build: {
    rollupOptions: {
      input: {
        main: resolve(projectRoot, 'index.html'),
        features: resolve(projectRoot, 'features.html'),
      },
    },
  },
});
