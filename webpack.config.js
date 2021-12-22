const { resolve } = require('path');

module.exports = {
    mode: 'production',
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        path: resolve(__dirname, 'umd'),
        filename: 'table-selection.min.js',
        library: {
            name: 'TableSelection',
            type: 'umd',
            export: 'default',
        },
    },
};
