const { mode } = require("webpack-nano/argv");
const { merge } = require("webpack-merge");
const parts = require("./webpack.parts");
const path = require("path");

const commonConfig = merge([
  { entry: ["./src"] },
  {
    output: {
      publicPath: "/",
      path: path.resolve(process.cwd(), "dist"),
      filename: "js/bundle.[name].[contenthash].js",
      chunkFilename: "js/chunk.[name].[contenthash].js",
      assetModuleFilename: "[name].[ext][query]",
    },
  },
  {
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
  },
  parts.page(),
  parts.clean(),
  parts.loadJavaScript(),
  parts.loadTypeScript(),
  parts.loadFonts(),
  parts.loadSvg(),
  parts.loadImages({ limit: 15000 }),
]);

const productionConfig = merge([
  parts.minifyJavaScript(),
  parts.loadProdCss(),
  parts.generateSourceMaps({ type: "source-map" }),
  {
    optimization: {
      splitChunks: {
        chunks: "all",
        minSize: { javascript: 2000, "styles/mini-extra": 10000 },
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            chunks: "initial",
          },
        },
      },
      runtimeChunk: { name: "runtime" },
    },
  },
]);

const developmentConfig = merge([
  {
    devtool: "inline-source-map",
    entry: ["webpack-plugin-serve/client"],
  },
  parts.devServer(),
  parts.loadDevCss(),
]);

const getConfig = (mode) => {
  process.env.NODE_ENV = mode;
  switch (mode) {
    case "production":
      return merge(commonConfig, productionConfig, { mode });
    case "development":
      return merge(commonConfig, developmentConfig, { mode });
    default:
      throw new Error(`Trying to use an anknown mode, ${mode}`);
  }
};

module.exports = getConfig(mode);
