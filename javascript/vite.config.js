import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'chrome110',
    rollupOptions: {
      input: 'src/main.js',
      output: {
        entryFileNames: 'main.js',
        format: 'iife'  
      }
    },
    outDir: 'dist'
  }
})