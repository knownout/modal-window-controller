const TerserPlugin = require("terser-webpack-plugin");

const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const packageConfig = {
    mode: "production",
    output: {
        path: path.resolve(__dirname, "package", "dist"),
        filename: "[name].js",
        library: {
            name: "modal-window-controller",
            type: "umd"
        },
        clean: true
    },

    target: "web",

    resolve: {
        extensions: [ ".tsx", ".jsx", ".js", ".ts" ]
    },

    stats: "minimal",

    entry: {
        "modal-window-controller": path.resolve(__dirname, "package", "modal-window-controller")
    },

    plugins: [],

    module: {
        rules: [
            {
                test: /\.jsx?$/i,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.tsx?$/i,
                exclude: /node_modules/,
                use: {
                    loader: "ts-loader",
                    options: {
                        configFile: "tsconfig.json"
                    }
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [ MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader" ]
            }
        ]
    },

    externals: {
        "mobx": {
            commonjs: "mobx",
            commonjs2: "mobx",
            amd: "mobx"
        }
    },

    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    format: {
                        comments: false
                    }
                }
            })
        ]
    }
};

packageConfig.module.rules[1].use.options.configFile = "tsconfig.package.json";
module.exports = packageConfig;
