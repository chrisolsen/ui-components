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
            from: "(--mobile)",
            to: "(max-width: 623px)",
          },
          {
            from: "(--not-mobile)",
            to: "@media (min-width: 624px)",
          },
          {
            from: /\(--tablet\)/g,
            to: "@media (min-width: 624px) and (max-width: 1023px)",
          },
          {
            from: "(--not-tablet)",
            to: "@media (max-width: 623px) or (min-width: 1024px)",
          },
          {
            from: "(--desktop)",
            to: "@media (min-width: 1024px)",
          },
          {
            from: "--not-desktop)",
            to: "@media (max-width: 1023px)",
          },

          {
            from: "(--container-mobile)",
            to: "(max-width: 623px)",
          },
          {
            from: "(--container-not-mobile)",
            to: "(min-width: 624px)",
          },
          {
            from: "(--container-tablet)",
            to: "(min-width: 624px) and (max-width: 1023px)",
          },
          {
            from: "(--container-not-tablet)",
            to: "(max-width: 623px) or (min-width: 1024px)",
          },
          {
            from: "(--container-desktop)",
            to: "(min-width: 1024px)",
          },
          {
            from: "(--container-not-desktop)",
            to: "(max-width: 1023px)",
          },
        ],
      },
    ]),
  ],
});
