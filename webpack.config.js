// @ts-check
var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ForkTsCheckWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = function(env) {
  let cfg = {
    context: __dirname,
    entry: {
      main: './src/main.ts',
    },
    output: {
      filename: '[name].[chunkhash].js', // [name].[chunkhash].js
      path: path.resolve(__dirname, 'dist'),
      publicPath: ''
    },
    resolve: {
      /*alias: {
        'vue$': 'vue/dist/vue.esm.runtime.js'
      },*/
      extensions: [ '.vue', '.ts', '.js']
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            use: 'css-loader'
          })
        },
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            use: [ { loader: 'css-loader' }, { loader: 'sass-loader' } ]
          })
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            sourceMap: true,
            loaders: {
              'scss': 'vue-style-loader!css-loader!sass-loader',
              'css': 'vue-style-loader!css-loader!sass-loader',
              'ts': 'ts-loader',
              'js': 'ts-loader'
            },
            cssSourceMap: true,
          }
        },
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          }
        }
      ],
      loaders: [
        {
          test: /.html$/,
          loader: 'html-loader'
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(env)
        }
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: (module) => {
          return module.context && module.context.indexOf('node_modules') !== -1;
        }
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest'
      }),
      new ExtractTextPlugin({
        filename: '[name].css',
        allChunks: true
      }), // [name].[chunkhash].css
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        chunksSortMode: 'dependency'
      }),
      new ForkTsCheckWebpackPlugin(),
    ],
    devServer: {
      historyApiFallback: true,
      noInfo: true
    },
    performance: {
      hints: false
    },
    /** @type { '#eval-source-map' | '#source-map' } */
    devtool: '#eval-source-map'
  };
  if(env === 'production') { console.log('Webpack: Production!');
    cfg.devtool = '#source-map';
    cfg.plugins = cfg.plugins.concat([
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: {
          warnings: false
        }
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true
      })
    ]);
    const vueLoader = cfg.module.rules.find(a => a.loader === 'vue-loader');
    vueLoader.options.extractCSS = true;
    vueLoader.options.esModule = true;
  }
  return cfg;
};
