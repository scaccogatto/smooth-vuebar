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
      // Library sources are pure TS. Without this, unplugin-dts finds
      // demo/App.vue while scanning the root and switches to the Vue
      // processor, which needs @vue/language-core.
      processor: 'ts',
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
