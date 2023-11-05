import { replaceCodePlugin } from 'vite-plugin-replace';

module.exports = {
  plugins: [
    replaceCodePlugin({
      replacements: [
        {
          from: /:global\(([\[\]\(\)\-\.\:\*\w]+)\)/g,
          to: "$1",
        },
        {
          from: /@container.*(--container-mobile)/g,
          to: "screen and (max-width: 623px)",
        },
        {
          from: /@container.*(--container-tablet)/g,
          to: "screen and (min-width: 624px) and (max-width: 1023px)",
        },
        {
          from: /@container.*(--container-desktop)/g,
          to: "screen and (min-width: 1024px)",
        },
      ],
    }),
  ],
};
