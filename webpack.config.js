const path = require('path');

module.exports = {
    entry: {
        './app/bundle': './app/index.js',
        './app/screens/main/dist/bundle': './app/screens/main/main.jsx',
        './app/screens/workplace-area/dist/bundle': './app/screens/workplace-area/workplace-area.jsx',
        './app/screens/workplace-text/dist/bundle': './app/screens/workplace-text/workplace-text.jsx'
    },
    output: {
        filename: '[name].js',
        path: __dirname
    },
    target: 'electron-main',
    node: {
        __dirname: true,
        __filename: true,
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        'react', 
                        ['env', {
                            'targets': {
                                'electron': '2.0.0'
                            }
                        }]
                    ],
                    plugins: ['transform-object-rest-spread', 'transform-class-properties']
                }
            }
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }]
    }
};