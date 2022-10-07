/* eslint-disable import/no-extraneous-dependencies */
import path from "path";
import { Configuration } from "webpack";
import TerserPlugin from "terser-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CompressionPlugin from "compression-webpack-plugin";
import { presetAttributify, presetUno } from "unocss";

const UnoCSS = require("@unocss/webpack").default;
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const MonacoLocalesPlugin = require("monaco-editor-locales-plugin");

const src = `${__dirname}/src`;
const dist = `${__dirname}/dist`;
const assets = `${__dirname}/build/assets`;
const template = `${assets}/template`;

const config: Configuration = {
  entry: {
    options: `${src}/pages/options/main.tsx`,
    install: `${src}/pages/install/main.tsx`,
    background: `${src}/background.ts`,
    sandbox: `${src}/sandbox.ts`,
    popup: `${src}/pages/popup/main.tsx`,
    confirm: `${src}/pages/confirm/main.tsx`,
    content: `${src}/content.ts`,
    inject: `${src}/inject.ts`,
    "editor.worker": "monaco-editor/esm/vs/editor/editor.worker.js",
    "ts.worker": "monaco-editor/esm/vs/language/typescript/ts.worker",
  },
  output: {
    path: `${dist}/ext/src`,
    filename: "[name].js",
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: `${dist}/ext/src/options.html`,
      template: `${template}/options.html`,
      inject: "head",
      title: "Home - ScriptCat",
      minify: {
        removeComments: true,
      },
      chunks: ["options"],
    }),
    new HtmlWebpackPlugin({
      filename: `${dist}/ext/src/install.html`,
      template: `${template}/install.html`,
      inject: "head",
      title: "Install - ScriptCat",
      minify: {
        removeComments: true,
      },
      chunks: ["install"],
    }),
    new HtmlWebpackPlugin({
      filename: `${dist}/ext/src/sandbox.html`,
      template: `${template}/sandbox.html`,
      inject: "head",
      title: "ScriptCat",
      minify: {
        removeComments: true,
      },
      chunks: ["sandbox"],
    }),
    new HtmlWebpackPlugin({
      filename: `${dist}/ext/src/popup.html`,
      template: `${template}/popup.html`,
      inject: "head",
      title: "ScriptCat",
      minify: {
        removeComments: true,
      },
      chunks: ["popup"],
    }),
    new HtmlWebpackPlugin({
      filename: `${dist}/ext/src/background.html`,
      template: `${template}/background.html`,
      inject: "head",
      title: "ScriptCat",
      minify: {
        removeComments: true,
      },
      chunks: ["background"],
    }),
    new HtmlWebpackPlugin({
      filename: `${dist}/ext/src/confirm.html`,
      template: `${template}/confirm.html`,
      inject: "head",
      title: "Confirm - ScriptCat",
      minify: {
        removeComments: true,
      },
      chunks: ["confirm"],
    }),
    new ESLintPlugin({
      extensions: [".ts", ".tsx"],
    }),
    new CopyPlugin({
      patterns: [
        { from: `${src}/manifest.json`, to: `${dist}/ext` },
        { from: `${assets}/_locales`, to: `${dist}/ext/_locales` },
        { from: `${assets}/logo.png`, to: `${dist}/ext/assets` },
      ],
    }),
    new CleanWebpackPlugin(),
    new ProgressBarPlugin({}),
    new CompressionPlugin({
      test: /ts.worker.js/,
      deleteOriginalAssets: true,
    }),
    new MonacoLocalesPlugin({
      languages: ["es", "zh-cn"],
      defaultLanguage: "zh-cn",
      logUnmatched: false,
    }),
    UnoCSS({
      presets: [presetUno(), presetAttributify()],
    }),
  ],
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".d.ts", ".tpl"],
    alias: {
      "@App": path.resolve(__dirname, "src/"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        use: ["babel-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.d\.ts$/,
        use: ["raw-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.tpl$/,
        use: ["raw-loader"],
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
    splitChunks: {
      chunks: "all",
      minSize: 307200,
      maxSize: 4194304,
      cacheGroups: {
        monaco: {
          test: /[\\/]node_modules[\\/]monaco-editor/,
          minSize: 307200,
          maxSize: 4194304,
          name: "monaco",
          chunks: "all",
          priority: 1,
          reuseExistingChunk: true,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          minSize: 307200,
          maxSize: 4194304,
          name: "vendor",
          chunks: "all",
          priority: 0,
          reuseExistingChunk: true,
        },
      },
    },
  },
};

export default config;