const webpack = require("webpack");

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      STABLE_FEATURE: JSON.stringify(true),
      EXPERIMENTAL_FEATURE: JSON.stringify(false),
    }),
  ],
  resolve: {
    fallback: {
      stream: require.resolve("stream-browserify"),
      crypto: require.resolve("crypto-browserify"),
      "process": require.resolve("process/browser"),
      "https": require.resolve("https-browserify") ,
      "querystring": require.resolve("querystring-es3"),
      "url": require.resolve("url/") ,
      "os": require.resolve("os-browserify/browser"),
      "path": require.resolve("path-browserify"),
      "http": require.resolve("stream-http")
    },
  },
  //   resolve: {
  //     fallback: {
  //       "tls": false,
  //       "net": false,
  //       "fs": false,
  //     //   "url": require.resolve("url/"),
  //       "child_process": false,
  //     //   path: require.resolve("path-browserify"),
  //     //   process:require.resolve('process/browser'),
  //     }

  // }
};
