const path = require('path')
const root = process.cwd()
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    entry: './components/index.js',
    output: {
        path: path.resolve(root, 'dist'),
        filename: 'index.js',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            'vue': 'vue/dist/vue.common.js',
            'talebase-ui': path.resolve(root)
        }
    },
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.vue$/,
                exclude: /node_modules/,
                loader: "eslint-loader",
                options: {
                    configFile: path.resolve(root, './.eslint.js')
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.s(a|c)ss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
                exclude: /favicon\.png$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000
                    }
                }]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new CopyWebpackPlugin([{
            from: './locale/lang',
            to: 'lang'
        }])
    ],
    externals: {
        vue: 'vue'
    }
}