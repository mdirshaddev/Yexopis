const Webpack = require('webpack')
const path = require('path')
const DotEnv = require('dotenv-webpack')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  mode: 'development',
  output: {
    filename: 'static/js/[fullhash:8].bundle.js'
  },
  devtool: 'eval',
  devServer: {
    contentBase: path.resolve(__dirname, '../public'),
    historyApiFallback: true,
    port: 7000,
    open: true, //for autolaunch of the browser
    hot: true,
    liveReload: true
  },
  plugins: [
    //hot module webpack plugin
    new Webpack.HotModuleReplacementPlugin(),
    //loading .env file in the runtime
    //so that we can access env variables it in react
    new DotEnv({
      path: path.resolve(__dirname, '../.env'), 
      allowEmptyValues: false, // no empty variables will be allowed
      silent: false, // we want every single errors
      systemvars: true // for CI purposes
    }), // we are loading env variables in the runtime of webpack build
    new TerserPlugin({
      terserOptions: {
        keep_classnames: true,
        keep_fnames: true,
      }
    })
  ]
}