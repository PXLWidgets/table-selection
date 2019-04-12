const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const {resolve} = require("path");

module.exports = {
    entry: {
        "package-name": "./src/index.ts",
        "package-name.min": "./src/index.ts",
    },
    mode: "production",
    output: {
        filename: "table-selection.js",
        library: "TableSelection",
        libraryTarget: "umd",
        path: resolve(__dirname, "umd"),
    },

    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                sourceMap: true,
                test: /\.min\.js$/,
            }),
        ],
    },

    devtool: "source-map",
    resolve: {
        extensions: [".ts", ".js"]
    },

    module: {
        rules: [
            {
                exclude: /node_modules/,
                loaders: ["ts-loader"],
                test: /\.ts$/,
            },
        ],
    },
};
