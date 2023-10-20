const sveltePreprocess = require("svelte-preprocess");
const postcssGlobalData = require("@csstools/postcss-global-data");
const autoprefixer = require("autoprefixer");
const postcssCustomMedia = require("postcss-custom-media");

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
      ],
    },
  }),
  plugins: [
    replaceCodePlugin({
      replacements: [
        {
          from: /:global\(([\[\]\(\)\-\.\:\*\w]+)\)/g,
          to: "$1",
        },
        {
          from: /@container.*(--mobile)/g,
          to: "screen and (max-width: 623px)",
        },
        {
          from: /@container.*(--tablet)/g,
          to: "screen and (min-width: 624px) and (max-width: 1023px)",
        },
        {
          from: /@container.*(--desktop)/g,
          to: "screen and (min-width: 1024px)",
        },
      ],
    }),
  ],
};
