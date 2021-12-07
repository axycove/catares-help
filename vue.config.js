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
          API_URL: JSON.stringify('http://localhost:3000/api')
        }
      })
    ]
  }
}