module.exports = {
  typescript: true,
  svgo: true,
  svgoConfig: {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false,
          },
        },
      },
      // IDs must be unique across the document; otherwise clipPath url(#a) from
      // one SVG resolves to another icon's defs and artwork looks clipped.
      {
        name: 'prefixIds',
        params: {
          delim: '__',
        },
      },
    ],
  },
  replaceAttrValues: {
    '#000': 'currentColor',
    '#000000': 'currentColor',
  },
  icon: true,
  dimensions: false,
};
