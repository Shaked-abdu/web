import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'fs';

const privateKey = readFileSync('path/to/key.pem');
const certificate = readFileSync('path/to/cert.pem');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: privateKey,
      cert: certificate,
    },
  },
});