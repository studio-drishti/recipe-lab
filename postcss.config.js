module.exports = {
  plugins: {
    'postcss-preset-env': {
      importFrom: 'client/styles/variables.css',
      stage: 0
    },
    'postcss-calc': {}
  }
};
