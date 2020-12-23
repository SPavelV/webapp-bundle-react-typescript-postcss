const path = require("path");
const { WebpackPluginServe: Serve } = require("webpack-plugin-serve");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const cssnano = require("cssnano");
const env = require("postcss-preset-env");
const APP_SOURCE = path.join(__dirname, "src");

exports.devServer = () => ({
  watch: true,
  plugins: [
    new Serve({
      port: process.env.PORT || 8080,
      static: "./dist",
      liveReload: true,
      waitForBuild: true,
      open: true,
      host: "127.0.0.1",
    }),
  ],
});

exports.page = () => ({
  plugins: [
    new HtmlWebpackPlugin({
      template: "./static/template.html",
      title: "Hello React🚀",
      favicon: "./static/favicon.ico",
    }),
  ],
});

const loadPostcss = (
  { sourceMap = false, minify = false } = { sourceMap: false, minify: false }
) => {
  const plugins = [
    env({
      stage: 0,
    }),
  ];

  if (minify) {
    plugins.push(cssnano);
  }

  return {
    loader: "postcss-loader",
    options: {
      sourceMap,
      postcssOptions: {
        plugins,
      },
    },
  };
};

const loadCss = ({ sourceMap = false } = { sourceMap: false }) => ({
  loader: "css-loader",
  options: {
    modules: true,
    sourceMap,
    modules: {
      localIdentName: "[local]--[hash:base64:5]",
    },
  },
});

exports.loadDevCss = () => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader",
          loadCss({ sourceMap: true }),
          loadPostcss({ sourceMap: true, minify: false }),
        ],
      },
    ],
  },
});

exports.loadProdCss = () => {
  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            { loader: MiniCssExtractPlugin.loader },
            loadCss({ sourceMap: false }),
            loadPostcss({ sourceMap: false, minify: true }),
          ],
          sideEffects: true,
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "styles/[name].[contenthash].css",
      }),
    ],
  };
};

exports.loadImages = ({ limit } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        type: "asset",
        parser: { dataUrlCondition: { maxSize: limit } },
        generator: {
          filename: "images/[hash][ext][query]",
        },
      },
    ],
  },
});

exports.loadSvg = () => ({
  module: {
    rules: [
      {
        test: /\.svg$/,
        issuer: /\.ts(x?)$/,
        use: [
          "@svgr/webpack",
          {
            loader: "file-loader",
            options: {
              name: "images/[name].[hash].[ext]",
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        issuer: /\.css$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "images/[name].[hash].[ext]",
            },
          },
        ],
      },
    ],
  },
});

exports.loadFonts = () => ({
  module: {
    rules: [
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name].[hash].[ext]",
        },
      },
    ],
  },
});

exports.loadJavaScript = () => ({
  module: {
    rules: [{ test: /\.js$/, include: APP_SOURCE, use: "babel-loader" }],
  },
});

exports.loadTypeScript = () => ({
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        include: APP_SOURCE,
        use: ["babel-loader", "ts-loader"],
      },
    ],
  },
});

exports.generateSourceMaps = ({ type }) => ({ devtool: type });

exports.clean = () => ({ plugins: [new CleanWebpackPlugin()] });

exports.minifyJavaScript = () => ({
  optimization: { minimizer: [new TerserPlugin()] },
});
