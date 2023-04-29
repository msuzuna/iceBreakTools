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

  entry: './src/ts/index.ts',

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
      {
        // 拡張子 .ts の場合
        test: /\.ts$/,
        // TypeScript をコンパイルする
        use: 'ts-loader',
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
  // import 文で .ts ファイルを解決するため
  // これを定義しないと import 文で拡張子を書く必要が生まれる。
  // フロントエンドの開発では拡張子を省略することが多いので、
  // 記載したほうがトラブルに巻き込まれにくい。
  resolve: {
    // 拡張子を配列で指定
    extensions: ['.ts', '.js'],
  },
};
