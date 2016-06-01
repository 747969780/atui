var webpack = require('webpack')
var ExtractTextPlugin = require("extract-text-webpack-plugin")
var extractAlidayu = new ExtractTextPlugin('alidayu.css')
var extractTmallwt = new ExtractTextPlugin('tmallwt.css')
var extractAlitx = new ExtractTextPlugin('alitx.css')
// var extractDoc = new ExtractTextPlugin('docs.css')
var path = require('path')
var precss       = require('precss')
var autoprefixer = require('autoprefixer')
var version = process.env.VERSION || require('./package.json').version

var banner =
  '/*!\n' +
  ' * atui v' + version + '\n' +
  ' * (c) ' + new Date().getFullYear() + ' alibaba\n' +
  ' * Released under the MIT License.\n' +
  ' */'

module.exports = {
    entry: {
      'components-docs': ['./docs/components.js'],
      'widgets-docs': ['./docs/widgets.js'],
      'filters-docs': ['./docs/filters.js']
    },

    output: {
        path: './build',
        publicPath: '/build/',
        filename: '[name].js'
    },
    plugins: [
        extractAlidayu,
        extractTmallwt,
        extractAlitx
    ],
    resolve: {
      root: path.resolve('./'),
      extensions: ['', '.js', '.vue'],
      alias: {
        'src': path.resolve(__dirname, './src')
      }
    },
    resolveLoader: {
      root: path.join(__dirname, 'node_modules')
    },
    module: {
        loaders: [{
            test: /\.vue$/,
            loader: 'vue'
        },{
            test: /\.js$/,
            exclude: /node_modules|vue\/src|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
            loader: 'babel'
        },{   test: /\.(png)$/,
            loader: 'url-loader?limit=100000'
        },{
            test: /alidayu\.less$/,
            loader: extractAlidayu.extract(['css','postcss','less'])
        },{
            test: /tmallwt\.less$/,
            loader: extractTmallwt.extract(['css','postcss','less'])
        },{
            test: /alitx\.less$/,
            loader: extractAlitx.extract(['css','postcss','less'])
        }],
        noParse:[/addr.js/,/^vue$/]
    },
    vue: {
        loaders: {
            less: ExtractTextPlugin.extract(
                    // activate source maps via loader query
                    'css?sourceMap!' +
                    'less?sourceMap'
                    ),
        }
    },
    babel: {
        presets: ['es2015'],
        plugins: ['transform-runtime']
    },
    postcss: function () {
        return {
            defaults: [precss, autoprefixer],
            cleaner:  [autoprefixer({ browsers: ['ie >= 9'] })]
        }
    },
    devtool: 'source-map'
}


if (process.env.NODE_ENV === 'production') {
  delete module.exports.devtool
  // remove vue依赖的环境判断
  module.exports.plugins = module.exports.plugins.concat([
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: '"production"'
        }
    }),
    new webpack.optimize.UglifyJsPlugin({
        sourceMap:false,
        compress: {
            warnings: true
        },
        output: {
            "ascii_only": true
        }
    }),
    new webpack.BannerPlugin(banner, {raw:true,entryOnly:true}),
    new webpack.optimize.OccurenceOrderPlugin()
  ])
}
