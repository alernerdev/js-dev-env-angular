import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackMd5Hash from 'webpack-md5-hash';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const extractCSS = new ExtractTextPlugin('[name].[contenthash].css');

export default {
    // controls if the source map gets created
    devtool: 'source-map',
    entry: {
        vendor: path.resolve(__dirname, 'src/vendor'),
        main: path.resolve(__dirname, 'src/index')
    },
    target: 'web',
    // the file bundle name is generated from the name in the entry point
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: '[name].[chunkhash].js',
        // use map extension on the css map filenames
        sourceMapFilename: '[name].[contenthash].css.map'
    },
    plugins: [
        // external CSS file
        extractCSS,
        //new ExtractTextPlugin('[name].[contenthash].css'),

        // Cache Busting: the filename changes when the file contents change --
        // and as long as the files are the same, they can stay cached
        new WebpackMd5Hash(),

        // Use CommonsChunkPlugin to create a separate bundle
        // of vendor libraries so they are cached separately.
        // the name here must match the entry point name higher up
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),

        // create HTML file that creates a reference to bundled JS
        new HtmlWebpackPlugin({
            template: "src/index.html",
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
            },
            // I want script references to be injected into the head element
            inject: 'head',
            trackJSToken: '21981c7d5c924151bc538a66e95cfc22'
        }),

        // minify JS
        new webpack.optimize.UglifyJsPlugin()
    ],
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loaders: ['babel-loader'] },
            { 
                test: /\.css$/, 
                use: extractCSS.extract({
                    use : [
                        {
                        loader: 'css-loader',
                        // sourceMap setting is ignored when devtool is configured higher up
                        /*
                        options: {
                            sourceMap: true,
                        }*/
                    }]
                })
            }
        ]
    }
}