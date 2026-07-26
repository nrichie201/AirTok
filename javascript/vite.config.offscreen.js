import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'chrome110',
    rollupOptions: {
      input: 'src/offscreen.js',
      output: {
        entryFileNames: 'offscreen.js',
        format: 'iife'
      }
    },
    outDir: 'dist',
    emptyOutDir: false
  }
})