const sveltePreprocess = require("svelte-preprocess");
const postcssGlobalData = require("@csstools/postcss-global-data");
const autoprefixer = require("autoprefixer");
const postcssCustomMedia = require("postcss-custom-media");
const postcssReplace = require("postcss-replace");

module.exports = {
  settings: {
    "svelte3/compiler-options": {
      generate: false,
      customElement: true,
    },
  },
  compilerOptions: {
    customElement: true,
  },
  preprocess: sveltePreprocess({
    postcss: {
      plugins: [
        postcssGlobalData({
          files: ["libs/web-components/src/assets/css/breakpoints.css"],
        }),
        postcssCustomMedia(),
        autoprefixer(),
        postcssReplace([
          {
            pattern: /@container.*(--container-mobile)/g,
            data: "screen and (max-width: 623px)",
          },
          {
            pattern: /@container.*(--container-tablet)/g,
            data: "screen and (min-width: 624px) and (max-width: 1023px)",
          },
          {
            pattern: /@container.*(--container-desktop)/g,
            data: "screen and (min-width: 1024px)",
          },
        ])
      ],
    },
  }),
  plugins: [
  ],
};
