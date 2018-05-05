/*
 * @Author: wangtao 
 * @Date: 2018-04-19 09:54:35 
 * @Last Modified by: wangtao
 * @Last Modified time: 2018-05-05 17:06:43
 */

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
//环境, 线上(online)or开发(dev)
const ENVIRONMENT = process.env.ENVIRONMENT || 'dev';

//返回一个符合HtmlWebpackPlugin插件所需要的对象
var getHtmlConfig = function (dir, name) {
    if (dir.length > 0)
        dir = dir + '/';
    return {
        template: './src/view/' + dir + '/' + name + '.html',
        filename: 'view/' + dir + name + '.html',
        inject: true,
        hash: false,
        //需要引入的js, 值对应于entry里的属性名
        chunks: ['common', name]
    }
}

const webpackConfig = {
    //入口
    entry: {
        'common': ['./src/page/common/common.js'],
        'index': './src/page/index/index.js',
        'category-list': './src/page/category-list/category-list.js',
        'product-list': './src/page/product-list/product-list.js',
        'product-detail': './src/page/product-detail/product-detail.js',
        'product-edit': './src/page/product-edit/product-edit.js',
        'order-list': './src/page/order-list/order-list.js',
        'order-detail': './src/page/order-detail/order-detail.js',
        'login': './src/page/login/login.js'
    },
    //出口
    output: {
        //输出的公共路径, 打包时文件所在的路径
        path: path.resolve(__dirname, 'dist'),
        //输出的文件名, 支持路径写法
        filename: 'js/[name].js',
        //访问的公共路径, 打包时所有的相对路径都会使用这个路径了
        publicPath: '/dist/'
    },
    //模块
    module: {
        loaders: [
            //加载css, 以css结尾, 配合ExtractTextPlugin插件一起使用
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            //加载字体, 图片 
            {
                test: /\.(gif|png|jpg|woff|svg|eot|ttf)\??.*$/,
                use: 'url-loader?limit=5120&name=resource/[name].[ext]'
            },
            //使用babel-loader, 解决不能使用ES6语法
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            }
        ]
    },
    //插件
    plugins: [
        //提取公共代码
        new webpack.optimize.CommonsChunkPlugin({
            //name对应入口entry里属性名字, 会将对应的文件提取出来
            name: 'common',
            filename: 'js/common.js'
        }),
        //将css文件单独打包插件
        new ExtractTextPlugin("css/[name].css"),
        //处理html
        new HtmlWebpackPlugin(getHtmlConfig('', 'login')),
        new HtmlWebpackPlugin(getHtmlConfig('', 'index')),
        new HtmlWebpackPlugin(getHtmlConfig('', 'category-list')),
        new HtmlWebpackPlugin(getHtmlConfig('', 'product-list')),
        new HtmlWebpackPlugin(getHtmlConfig('', 'product-detail')),
        new HtmlWebpackPlugin(getHtmlConfig('', 'product-edit')),
        new HtmlWebpackPlugin(getHtmlConfig('', 'order-list')),
        new HtmlWebpackPlugin(getHtmlConfig('', 'order-detail'))
    ],
    resolve: {
        alias: {
            node_modules: __dirname + '/node_modules',
            utils: __dirname + '/src/utils',
            page: __dirname + '/src/page',
            image: __dirname + '/src/image'
        }
    }
};
if (ENVIRONMENT === 'DEV') {
    webpackConfig.entry.common.push('webpack-dev-server/client?http://localhost:9000/');
}
module.exports = webpackConfig;