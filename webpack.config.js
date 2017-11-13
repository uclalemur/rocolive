var path = require("path")
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')

module.exports = {
  context: __dirname,

  entry: './assets/js/index',// entry point of our app. assets/js/index.js should require other js modules and dependencies it needs

  output: {
      path: path.resolve('./assets/bundles/'),
      filename: "[name]-[hash].js",
      // publicPath: './assets/bundles/',
  },

  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
    // new webpack.NoEmitOnErrorsPlugin(), // don't reload if there is an error
    new BundleTracker({filename: './webpack-stats.json'}),
  ],

  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader'}, // to transform JSX into JS
    ],
  },
  // module: {
  //   loaders: [
  //       {
  //         test: /\.js$/,
  //         exclude: /node_modules/,
  //         loader: 'babel-loader',
  //         query: {
  //           presets:['es2015', 'stage-0', 'react']
  //         }
  //       }
  //   ]
  // },

  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx']
  },
  watch: true,
}
