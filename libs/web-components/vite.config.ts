import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import replace from "vite-plugin-filter-replace";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "../../dist/libs/web-components",
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: "@abgov/web-components",
      fileName: "web-components",
    },
    sourcemap: true,
    rollupOptions: {},
  },
  plugins: [
    svelte({
      include: /\App.svelte$/ as any,
      compilerOptions: {
        customElement: false,
      },
    }),
    svelte({
      exclude: /\App.svelte$/ as any,
      compilerOptions: {
        customElement: true,
      },
    }),
    replace.default([
      {
        filter: /\.svelte$/,
        replace: [
          {
            from: /@container.*\(--mobile\)/g,
            to: "@container self (max-width: 320px)",
          },
        ],
      },
    ]),
  ],
});
