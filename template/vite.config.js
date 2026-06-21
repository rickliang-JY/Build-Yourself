import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base is set for GitHub Pages project sites (https://<user>.github.io/<repo>/).
// Change or remove if you deploy at a domain root.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: { outDir: 'dist' },
});
