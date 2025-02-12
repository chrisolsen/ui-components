import { defineWorkspace } from 'vitest/config'
// export default [
//   "./vitest.config.{unit,browser}.ts",
// ];

export default defineWorkspace([
  // {
  //   extends: "./vitest.config.js",
  //   test: {
  //     alias: [{ find: /^svelte$/, replacement: "svelte/internal" }],
  //     name: "unit",
  //     environment: "jsdom",
  //     globals: true,
  //     setupFiles: ["./vitest.setup.unit.ts"],
  //     exclude: [
  //       "**/*.browser.*.{ts,js,mjs}"
  //     ],
  //   }
  // },
  {
    extends: "./vitest.config.js",
    test: {
      name: "headless",
      setupFiles: [
        'vitest-browser-svelte',
      ],
      browser: {
        provider: 'webdriverio',
        enabled: true,
        headless: false,
        name: 'chrome',
        providerOptions: {},
      },
      include: ['./src/**/*.browser.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    },
  }
]);
