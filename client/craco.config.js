module.exports = {
  webpack: {
    configure: {
      output: {
        filename: '[name].js'
      },
      optimization: {
        runtimeChunk: false,
        splitChunks: {
          chunks(chunk) {
            return false
          },
        },
      },
    },
  },
  plugins: [
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => {
          webpackConfig.plugins[5].options.filename = '[name].css';
          return webpackConfig;
        },
      },
      options: {}
    }
  ],
}