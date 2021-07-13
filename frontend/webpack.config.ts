import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import {InjectManifest} from 'workbox-webpack-plugin';
import InterpolateHTMLPlugin from 'interpolate-html-plugin';
import DotEnv from 'dotenv-webpack';
import chalk from 'chalk';

/**
 * Extending the webpack Configuration for devServer which is config for Webpack-dev-server
 */
interface extendConfiguration extends webpack.Configuration {
  devServer: {
    port: number,
    historyApiFallback: boolean
  }
}
/**
 * Webpack configuration
 * @param options {String} - mode of webpack we wants `development` or `production`
 * @returns 
 */
function webpackConfig(options: { env:string }):extendConfiguration{
  console.log(chalk.bgGreen(`Webpack Configuration with ${options.env} mode`));
  return {
    entry: {
      index: path.resolve(__dirname, './src/index.tsx')
    },
    stats: 'verbose', //we want to see every logs in the console
    ...(options.env === 'production' ? { mode: 'production' } : { mode: 'development' }),
    ...(options.env === 'production' ? {} : { devtool: 'eval-source-map' }),
    // when webpack is running in development then this config will be used by webpack-dev-server
    devServer: {
      port: 8000,
      historyApiFallback: true
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
      fallback: { "crypto": false },
      alias: {
        'react-dom$': 'react-dom/profiling',
        'scheduler/tracing': 'scheduler/tracing-profiling',
        'react-dom': '@hot-loader/react-dom',
        '@components': path.resolve(__dirname, './src/components'),
        '@constants': path.resolve(__dirname, './src/constants'),
        '@containers': path.resolve(__dirname, './src/containers'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@serviceWorker': path.resolve(__dirname, './src/service/serviceWorkerWorkbox.ts'),
        '@css': path.resolve(__dirname, './src/static/css'),
        '@utilities': path.resolve(__dirname, './src/utilities'),
        '@actions': path.resolve(__dirname, './src/utilities/actions'),
        '@reducers': path.resolve(__dirname, './src/utilities/reducers'),
        '@store': path.resolve(__dirname, './src/utilities/store.tsx'),
      }
    },
    output: {
      path: path.resolve(__dirname, './build'),
      filename: 'static/js/[name].[fullhash:4].chunk.js',
      chunkFilename: 'chunk-[name].[fullhash:4].js',
      publicPath: '/'
    },
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx$/,
	        loader: 'ts-loader',
          options: {
            transpileOnly: true
          },
          exclude: /build/,
        },
        {
          enforce: 'pre',
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'source-map-loader'
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: true
              }
            }
          ],
          include: /\.module\.css$/
        },
        // css support
        {
          test: /\.(css)$/,
          use: [
            MiniCSSExtractPlugin.loader, // extracting to a file with .css
            "css-loader" // loading css files to browser dom
          ],
          exclude: /\.module\.css$/
        },
        // images, icons, svgs, gifs support
        {
          test: /\.(png|jpe?g|gif|svg|ico|webp)$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'static/media/images',
            esModule: false
          }
        },
        // audios, mp3 support
        {
          test: /\.(aac|mp3)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'static/media/audio',
              esModule: false
            }
          }
        }
      ],
    },
    plugins: [
      // Adding Hot module replacement plugin for HMR
      new webpack.HotModuleReplacementPlugin(),
      //for copying the assets
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'public',
            globOptions: {
              ignore: ["**/index.html"]
            },
            to: '[name][ext]'
          }
        ]
      }),
      // index.html where we will render everything
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.resolve(__dirname, './public/index.html'),
        minify: {
          removeAttributeQuotes: true,
          collapseWhitespace: true,
          removeComments: true
        }
      }),
      new InterpolateHTMLPlugin({
        'PUBLIC_URL': ''
      }),
      new ForkTsCheckerWebpackPlugin({
        // Speeds up TypeScript type checking and ESLint linting (by moving each to a separate process)
        eslint: {
          files: './src/**/*.tsx',
        },
      }),
      // for extracting css to a file
      new MiniCSSExtractPlugin({
        filename: 'static/css/[name].css',
        chunkFilename: 'static/css/[name].css'
      }),
      new DotEnv({
        path: path.join(__dirname, './.env'), 
        allowEmptyValues: false, // no empty variables will be allowed
        silent: false, // we want every single errors
        systemvars: true // for CI purposes
      }), // we are loading env variables in the runtime of webpack build
      (options.env === 'production' ?  new CleanWebpackPlugin() : function(){console.log('In development')}),
      (options.env === 'production' ? new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        logLevel: 'info',
        reportFilename: path.resolve(__dirname, './report/index.html'),
        reportTitle: 'Yexopis | Analysis'
      }) : function(){console.log('In development')}),
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true
        }
      }),
      (options.env === 'production' ? new InjectManifest({
        swSrc: path.resolve(__dirname, './src/service/serviceWorkerWorkbox.ts'),
        swDest: 'service-worker.js'
      }) : function(){console.log('In development')})
    ],
    // 6. Our target is an web please 
    target: 'web',
    // 7. Performance
    performance: {
      maxAssetSize: 2500000,
      maxEntrypointSize: 2500000
    }
  }
};

export default webpackConfig;