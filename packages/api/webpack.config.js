const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: {
    app: "./app.js",
    server: "./server.js",
  },
  mode: process.env.NODE_ENV,
  target: "node",
  externals: [nodeExternals()],
  output: {
    libraryTarget: "commonjs",
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [["env", { targets: { node: "12.17" } }]],
            },
          },
        ],
      },
    ],
  },
};
