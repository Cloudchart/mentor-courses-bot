var path = require('path')

module.exports = {

  context: __dirname + "/frontend",

  entry: './index',

  output: {
    path: __dirname + '/public',
    filename: 'app.js'
  },


  module: {

    loaders: [
      {
        test    : /\.js$/,
        include : [path.resolve(__dirname, 'frontend')],
        loader  : 'babel-loader',
        // query   : {
        //   presets : ['es2015', 'stage-0', 'react']
        // }
      }
    ]

  },




}
