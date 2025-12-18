import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'RAW',
      fileName: 'raw',
      formats: ['es', 'umd']
    }
  }
});

