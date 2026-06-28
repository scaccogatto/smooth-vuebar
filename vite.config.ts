import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['src/**/*.ts'],
      outDir: 'dist',
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SmoothVuebar',
      formats: ['es', 'cjs'],
      fileName: (format) => `smooth-vuebar.${format === 'es' ? 'js' : 'cjs'}`,
      cssFileName: 'default',
    },
    rollupOptions: {
      external: ['vue', 'smooth-scrollbar'],
      output: {
        exports: 'named',
      },
    },
  },
})
