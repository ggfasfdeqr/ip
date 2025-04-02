import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import type { Plugin } from 'vite'

export default defineConfig({
  plugins: [vue() as Plugin],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/main.ts',
        'src/**/*.d.ts',
        'src/**/types/**',
        'src/**/*.test.ts',
        'src/**/*.spec.ts',
        'src/**/*.test.js',
        'src/**/*.spec.js',
        'coverage/**',
        '**/__tests__/**'
      ],
      all: true,
      clean: true
    },
    testTimeout: 10000,
    hookTimeout: 10000
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
}) 