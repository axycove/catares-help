const webpack = require('webpack');

//vue.config.js
module.exports = {
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = "catares-help";
        return args;
      })
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        // allow access to process.env from within the vue app
        'process.env': {
          API_URL: process.env.NODE_ENV == 'production' 
            ? JSON.stringify('http://ec2-3-135-142-102.us-east-2.compute.amazonaws.com:3000/api')
            : JSON.stringify('http://localhost:3000/api')
        }
      })
    ]
  }
}