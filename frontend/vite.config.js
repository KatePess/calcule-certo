import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Tudo que comeca com /api e repassado para a API em Node/Express.
    // Assim o navegador enxerga uma origem so e nao ha problema de CORS.
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
