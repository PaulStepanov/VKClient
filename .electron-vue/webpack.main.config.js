'use strict'

process.env.BABEL_ENV = 'main'

const path = require('path')
const {
    dependencies
} = require('../package.json')
const webpack = require('webpack')

const BabiliWebpackPlugin = require('babili-webpack-plugin')

let mainConfig = {
    devtool: 'inline-source-map',
    entry: {
        main: path.join(__dirname, '../src/main/index.ts')
    },
    externals: [
        ...Object.keys(dependencies || {})
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: [/test/],
                loader: 'ts-loader'
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: [/node_modules/]
            },
            {
                test: /\.node$/,
                use: 'node-loader'
            }
        ]
    },
    node: {
        __dirname: process.env.NODE_ENV !== 'production',
        __filename: process.env.NODE_ENV !== 'production'
    },
    output: {
        filename: '[name].js',
        libraryTarget: 'commonjs2',
        path: path.join(__dirname, '../dist/electron')
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin()
    ],
    resolve: {
        extensions: ['.js', '.json', '.node','.ts','.tsx']
    },
    target: 'electron-main'
}

/**
 * Adjust mainConfig for development settings
 */
if (process.env.NODE_ENV !== 'production') {
    mainConfig.plugins.push(
        new webpack.DefinePlugin({
            '__static': `"${path.join(__dirname, '../static').replace(/\\/g, '\\\\')}"`
        })
    )
}

/**
 * Adjust mainConfig for production settings
 */
if (process.env.NODE_ENV === 'production') {
    mainConfig.plugins.push(
        new BabiliWebpackPlugin({
            removeConsole: true,
            removeDebugger: true
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        })
    )
}



module.exports = mainConfig