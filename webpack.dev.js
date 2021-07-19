const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/app.js",
    mode: "development",
    output: {
        filename: "[name].bundle.js",
        clean: true
    },
    resolve: {
        fallback: {
            "crypto" : false,
            "os" : false,
            "zlib" : false,
            "http" : false
        }
    },
    plugins: [
        new HtmlWebpackPlugin({template: "./public/template.html"})
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
    },
    devtool: "source-map"
}