const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const browser_suffix =
  (process.env.BROWSER === "chrome" && "chrome") ||
  (process.env.BROWSER === "firefox" && "firefox");

module.exports = {
  mode: process.env.NODE_ENV === "prod" ? "production" : "development",
  devtool: process.env.NODE_ENV === "prod" ? false : "source-map",
  entry: {
    content: path.resolve(__dirname, "./src/content/index.ts"),
    background: path.resolve(__dirname, "./src/background/index.ts"),
    popup: path.resolve(__dirname, "./src/popup/popup.tsx"),
  },
  output: {
    path: path.resolve(__dirname, `dist_${browser_suffix}`),
    filename: "[name].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: [/node_modules/, /popup/],
        use: [
          {
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
          {
            loader: "ts-loader",
          },
        ],
      },
      {
        test: /\.(ts|tsx)$/,
        include: [/popup/],
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                ["@babel/preset-react", { runtime: "automatic" }],
              ],
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
          from: path.resolve(
            __dirname,
            `./src/manifest_${browser_suffix}.json`
          ),
          to: path.resolve(__dirname, `dist_${browser_suffix}/manifest.json`),
        },
        {
          from: path.resolve(__dirname, "./src/assets/"),
          to: path.resolve(__dirname, `dist_${browser_suffix}/assets`),
        },
        {
          from: path.resolve(__dirname, "./src/popup/popup.html"),
          to: path.resolve(__dirname, `dist_${browser_suffix}/popup.html`),
        },
      ],
    }),
  ],
};
