const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: process.env.NODE_ENV === "prod" ? "production" : "development",
  devtool: process.env.NODE_ENV === "prod" ? false : "source-map",
  entry: {
    content: path.resolve(__dirname, "./src/content/index.js"),
    background: path.resolve(__dirname, "./src/background/index.js"),
    popup: path.resolve(__dirname, "./src/popup/popup.tsx"),
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
        exclude: [/node_modules/],
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
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        include: [/popup/, path.resolve(__dirname, "./src/shared/")],
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
              plugins: ["styled-jsx/babel"],
            },
          },
          {
            loader: "ts-loader",
          },
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "./src/manifest.json"),
          to: path.resolve(__dirname, "dist"),
        },
        {
          from: path.resolve(__dirname, "./src/icons/"),
          to: path.resolve(__dirname, "dist/icons"),
        },
        {
          from: path.resolve(__dirname, "./src/popup/popup.html"),
          to: path.resolve(__dirname, "dist/popup.html"),
        },
      ],
    }),
  ],
};
