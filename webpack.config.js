const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: process.env.NODE_ENV === "prod" ? "production" : "development",
  devtool: process.env.NODE_ENV === "prod" ? false : "source-map",
  entry: {
    content: path.resolve(__dirname, "./src/content/index.js"),
    background: path.resolve(__dirname, "./src/background/index.js"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              [
                "@babel/plugin-transform-react-jsx",
                {
                  pragma: "h",
                  pragmaFrag: "DocumentFragment",
                },
              ],
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "./src/manifest.json"),
          to: path.resolve(__dirname, "dist"),
        },
      ],
    }),
  ],
};
