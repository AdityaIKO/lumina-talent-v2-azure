import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import spa from 'vite-plugin-spa';

export default defineConfig({
  plugins: [
    react(),
    spa({
      sourcemap: true,
      fallback: 'index.html',
    }),
  ],
  server: { port: 3000 },
});
