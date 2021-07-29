/* eslint-disable no-undef */
// const path = require("path");
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import {WebpackManifestPlugin} from "webpack-manifest-plugin";
// const HtmlWebpackPlugin = require("html-webpack-plugin");
// const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = {
    mode: "development",
    entry: "./src/app.js",
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
        // clean: true,
        publicPath: "/"
    },
    devServer: {
        contentBase: "./dist"
    },
    resolve: {
        fallback: {
            "crypto" : false,
            "os" : false,
            "zlib" : false,
            "http" : false,
            "fs" : false,
            "net" : false,
            "dns" : false,
            "tls" : false,
            "mongodb-client-encryption" : false
        }
    },
    plugins: [
        new HtmlWebpackPlugin({template: "./public/template.html"}),
        new WebpackManifestPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.html$/,
                use: ["html-loader"]
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader"
                ]
            },
        ]
    }
    //add optimization.splitChunks
};

export default config;