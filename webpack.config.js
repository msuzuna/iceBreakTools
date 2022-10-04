const isDev = process.env.NODE_ENV === 'development';
const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');

const getFileName = function (path) {
  return path.replace(/\.[^/.]+$/, '');
};

const templates = [];
const srcPugDir = './src/pug';
glob
  .sync('**/*.pug', {
    ignore: '**/_*.pug',
    cwd: srcPugDir,
  })
  .map(function (file) {
    templates.push(
      new HtmlWebpackPlugin({
        template: path.resolve(srcPugDir, file),
        filename: getFileName(file) + '.html',
      })
    );
  });

module.exports = {
  mode: isDev ? 'development' : 'production',
  // mode: "development",

  entry: './src/js/index.js',

  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'main.js',
    assetModuleFilename: 'assets/[hash][ext][query]',
  },

  devServer: {
    static: 'dist',
    open: true,
  },

  module: {
    rules: [
      {
        test: /\.s?css/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              url: true,
              sourceMap: isDev,
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: isDev,
              postcssOptions: {
                plugins: [['autoprefixer', { grid: true }]],
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDev,
            },
          },
        ],
      },
      {
        test: /\.(gif|png|jpg|svg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 100 * 1024,
          },
        },
      },
      {
        test: /\.pug$/,
        use: 'pug-loader',
      },
    ],
  },
  plugins: [
    // CSSファイルを外だしにするプラグイン
    new MiniCssExtractPlugin({
      // ファイル名を設定します
      filename: 'style.css',
    }),
    ...templates,
    new HtmlWebpackPlugin({
      template: 'src/pug/index.pug',
      filename: 'index.html',
    }),
    new HtmlWebpackPugPlugin(),
  ],
};
