import { defineConfig } from "vite";
import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      preprocess: vitePreprocess(),
      include: /\.svelte$/,
      compilerOptions: {
        customElement: true,
      },
    }),
  ],

  test: {
    exclude: [
      "**/node_modules",
    ]
  },
});
