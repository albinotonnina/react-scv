'use strict';

const overrides = require('../src/overrides');

const deepmerge = require('deepmerge');
const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

const CWD = process.cwd();
const PACKAGE = require(path.join(CWD, 'package.json'));
const SRC_FILE = path.join(CWD, PACKAGE["react-scv"].appBuildEntry);
const DEV_SERVER = PACKAGE["react-scv"].devServer || {};
const SRC = path.dirname(SRC_FILE);
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');

const applyCoreConfig = require('./webpack.core');
const applyAssetsConfig = require('./webpack.assets');

module.exports = function (config, cursors) {

  config = applyCoreConfig(config, cursors);
  config = applyAssetsConfig(config, cursors, {inline: false});

  return merge(config, {
    entry: ['babel-polyfill', 'whatwg-fetch', SRC_FILE],
    devtool: 'source-map',
    plugins: [
      cursors.push('html-webpack-plugin',
        new HtmlWebpackPlugin(merge({
          template: path.join(__dirname, '../src/template.ejs'),
          hash: true,
          xhtml: true
        }, PACKAGE["react-scv"].html || {}))
      ),
      cursors.push('add-asset-html-webpack-plugin',
        new AddAssetHtmlWebpackPlugin({
          filepath: path.join(CWD, 'build/dev/app-dll.js'),
          includeSourcemap: false,
          hash: true,
        })
      ),
      cursors.push('commons-chunk-plugin',
        new webpack.optimize.CommonsChunkPlugin({
          name: 'vendor',
          minChunks: Infinity,
          filename: 'vendor.bundle.js'
        })
      ),
      cursors.push('named-modules-plugin',
        new webpack.NamedModulesPlugin()
      ),
      cursors.push('hot-module-replacement-plugin',
        new webpack.HotModuleReplacementPlugin()
      ),
      cursors.push('no-emit-on-errors-plugin',
        // https://github.com/MoOx/eslint-loader#noerrorsplugin
        new webpack.NoEmitOnErrorsPlugin()
      ),
      cursors.push('dll-reference-plugin',
        new webpack.DllReferencePlugin({
          context: '.',
          manifest: require(path.join(CWD, 'build/dev/app-dll-manifest.json'))
        })
      )
    ],
    module: {
      rules: [
        cursors.push('eslint-rule', {
          test: /\.jsx?$/,
          enforce: "pre",
          include: [SRC],
          loader: 'eslint-loader',
          options: {
            configFile: overrides.filePath(path.join(__dirname, 'eslint.dev.js')),
            useEslintrc: false
          }
        }),
      ]
    },
    devServer: deepmerge({
      contentBase: [path.join(process.cwd(), 'src'), path.join(process.cwd(), 'build/dev')],

      // Enable history API fallback so HTML5 History API based
      // routing works. This is a good default that will come
      // in handy in more complicated setups.
      historyApiFallback: true,

      hot: true,

      // Display only errors to reduce the amount of output.
      stats: 'errors-only',
      //stats: { colors: true, maxModules: 1000 }

      disableHostCheck: true

    }, DEV_SERVER)
  });

}
