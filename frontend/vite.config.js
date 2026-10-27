import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { createMockApi } from './server/mock-api.js';

// API fake servida por HTTP dentro do Vite (dev e preview).
function mockApiPlugin() {
  return {
    name: 'chat-mock-api',
    configureServer(server) {
      server.middlewares.use('/api', createMockApi());
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api', createMockApi());
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), mockApiPlugin()],
});
