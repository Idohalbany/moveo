import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@moveo/store': path.resolve(__dirname, '../libs/store/src'),
      '@moveo/types': path.resolve(__dirname, '../libs/types/src'),
    },
  },
})
