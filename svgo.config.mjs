export default {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: { overrides: { removeViewBox: false } },
    },
    'removeDimensions',
    'removeXMLNS',
    { name: 'sortAttrs' },
  ],
};
