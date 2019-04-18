const path = require("path");
const webpack = require("webpack");
const resolve = require("resolve");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const safePostCssParser = require("postcss-safe-parser");
const PnpWebpackPlugin = require("pnp-webpack-plugin");
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");
const getCacheIdentifier = require("react-dev-utils/getCacheIdentifier");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const getCSSModuleLocalIdent = require("react-dev-utils/getCSSModuleLocalIdent");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");
const ModuleNotFoundPlugin = require("react-dev-utils/ModuleNotFoundPlugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

function getClientEnvironment() {
  const REACT_APP = /^REACT_APP_/i;
  const raw = Object.keys(process.env)
    .filter(key => REACT_APP.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        NODE_ENV: "production",
        PUBLIC_URL: "/"
      }
    );
  const stringified = {
    "process.env": Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {})
  };
  return { raw, stringified };
}
const env = getClientEnvironment();

const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    require.resolve("style-loader"),
    {
      loader: MiniCssExtractPlugin.loader,
      options: Object.assign({}, undefined)
    },
    {
      loader: require.resolve("css-loader"),
      options: cssOptions
    },
    {
      loader: require.resolve("postcss-loader"),
      options: {
        ident: "postcss",
        plugins: () => [
          require("postcss-flexbugs-fixes"),
          require("postcss-preset-env")({
            autoprefixer: {
              flexbox: "no-2009"
            },
            stage: 3
          })
        ],
        sourceMap: false
      }
    }
  ].filter(Boolean);
  if (preProcessor) {
    loaders.push({
      loader: require.resolve(preProcessor),
      options: { sourceMap: false }
    });
  }
  return loaders;
};

module.exports = {
  mode: "production",
  bail: true,
  devtool: false,
  entry: ["./src/ssd.js"].filter(Boolean),
  output: {
    path: "./build",
    pathinfo: false,
    filename: "static/js/[name].[contenthash:8].js",
    chunkFilename: "static/js/[name].[contenthash:8].chunk.js",
    publicPath: "./public",
    devtoolModuleFilenameTemplate: info =>
      path.relative("./src", info.absoluteResourcePath).replace(/\\/g, "/")
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: { ecma: 8 },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2
          },
          mangle: {
            safari10: true
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true
          }
        },
        parallel: true,
        cache: true,
        sourceMap: false
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          parser: safePostCssParser,
          map: false
        }
      })
    ],
    splitChunks: {
      chunks: "all",
      name: false,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const name = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )[1];
            if (name.includes("material-ui")) return "material-ui";
            else if (name.includes("echarts")) return "echarts";
            else return name.replace("@", "").substr(0, 1);
          },
          chunks: "initial"
        }
      }
    },
    runtimeChunk: true
  },
  resolve: {
    modules: ["node_modules"].concat(
      (process.env.NODE_PATH || "").split(path.delimiter).filter(Boolean)
    ),
    extensions: [
      "web.mjs",
      "mjs",
      "web.js",
      "js",
      "web.ts",
      "ts",
      "web.tsx",
      "tsx",
      "json",
      "web.jsx",
      "jsx"
    ]
      .map(ext => `.${ext}`)
      .filter(ext => !ext.includes("ts")),
    alias: {
      "react-native": "react-native-web"
    },
    plugins: [
      PnpWebpackPlugin,
      new ModuleScopePlugin("./src", ["./package.json"])
    ]
  },
  resolveLoader: {
    plugins: [PnpWebpackPlugin.moduleLoader(module)]
  },
  module: {
    strictExportPresence: true,
    rules: [
      { parser: { requireEnsure: false } },
      {
        test: /\.(js|mjs|jsx)$/,
        enforce: "pre",
        use: [
          {
            options: {
              formatter: require.resolve("react-dev-utils/eslintFormatter"),
              eslintPath: require.resolve("eslint"),
              baseConfig: {
                extends: [require.resolve("eslint-config-react-app")]
              },
              ignore: false,
              useEslintrc: false
            },
            loader: require.resolve("eslint-loader")
          }
        ],
        include: "./src"
      },
      {
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve("url-loader"),
            options: {
              limit: 10000,
              name: "static/media/[name].[hash:8].[ext]"
            }
          },
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            include: "./src",
            loader: require.resolve("babel-loader"),
            options: {
              customize: require.resolve(
                "babel-preset-react-app/webpack-overrides"
              ),
              babelrc: false,
              configFile: false,
              presets: [require.resolve("babel-preset-react-app")],
              cacheIdentifier: getCacheIdentifier("production", [
                "babel-plugin-named-asset-import",
                "babel-preset-react-app",
                "react-dev-utils",
                "react-scripts"
              ]),
              plugins: [
                [
                  require.resolve("babel-plugin-named-asset-import"),
                  {
                    loaderMap: {
                      svg: {
                        ReactComponent: "@svgr/webpack?-svgo,+ref![path]"
                      }
                    }
                  }
                ]
              ],
              cacheDirectory: true,
              cacheCompression: true,
              compact: true
            }
          },
          {
            test: /\.(js|mjs)$/,
            exclude: /@babel(?:\/|\\{1,2})runtime/,
            loader: require.resolve("babel-loader"),
            options: {
              babelrc: false,
              configFile: false,
              compact: false,
              presets: [
                [
                  require.resolve("babel-preset-react-app/dependencies"),
                  { helpers: true }
                ]
              ],
              cacheDirectory: true,
              cacheCompression: true,
              cacheIdentifier: getCacheIdentifier("production", [
                "babel-plugin-named-asset-import",
                "babel-preset-react-app",
                "react-dev-utils",
                "react-scripts"
              ]),
              sourceMaps: false
            }
          },
          {
            test: cssRegex,
            exclude: cssModuleRegex,
            use: getStyleLoaders({
              importLoaders: 1,
              sourceMap: false
            }),
            sideEffects: true
          },
          {
            test: cssModuleRegex,
            use: getStyleLoaders({
              importLoaders: 1,
              sourceMap: false,
              modules: true,
              getLocalIdent: getCSSModuleLocalIdent
            })
          },
          {
            test: sassRegex,
            exclude: sassModuleRegex,
            use: getStyleLoaders(
              {
                importLoaders: 2,
                sourceMap: false
              },
              "sass-loader"
            ),
            sideEffects: true
          },
          {
            test: sassModuleRegex,
            use: getStyleLoaders(
              {
                importLoaders: 2,
                sourceMap: false,
                modules: true,
                getLocalIdent: getCSSModuleLocalIdent
              },
              "sass-loader"
            )
          },
          {
            loader: require.resolve("file-loader"),
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              name: "static/media/[name].[hash:8].[ext]"
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin(
      Object.assign(
        {},
        {
          inject: true,
          template: "./public/index.html",
          minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true
          }
        }
      )
    ),
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
    new ModuleNotFoundPlugin("."),
    new webpack.DefinePlugin(env.stringified),
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash:8].css",
      chunkFilename: "static/css/[name].[contenthash:8].chunk.css"
    }),
    new ManifestPlugin({
      fileName: "asset-manifest.json",
      publicPath: "/"
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new WorkboxWebpackPlugin.GenerateSW({
      clientsClaim: true,
      exclude: [/\.map$/, /asset-manifest\.json$/],
      importWorkboxFrom: "cdn",
      navigateFallback: "/index.html",
      navigateFallbackBlacklist: [
        new RegExp("^/_"),
        new RegExp("/[^/]+\\.[^/]+$")
      ]
    })
  ].filter(Boolean),
  node: {
    module: "empty",
    dgram: "empty",
    dns: "mock",
    fs: "empty",
    net: "empty",
    tls: "empty",
    child_process: "empty"
  },
  performance: false
};
