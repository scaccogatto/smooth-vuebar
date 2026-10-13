import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['src/**/*.ts'],
      // ESM consumers get .d.ts (package is "type": "module"), CJS consumers
      // get .d.cts so `require` resolves CJS-format declarations.
      outDirs: ['dist', { dir: 'dist', moduleFormat: 'cjs' }],
      // Library sources are pure TS. Without this, unplugin-dts finds
      // demo/App.vue while scanning the root and switches to the Vue
      // processor, which needs @vue/language-core.
      processor: 'ts',
    }),
  ],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'SmoothVuebar',
      formats: ['es', 'cjs'],
      fileName: (format) => `smooth-vuebar.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['vue', 'smooth-scrollbar'],
      output: {
        exports: 'named',
      },
    },
  },
})
