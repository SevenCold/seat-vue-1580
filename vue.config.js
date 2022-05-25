module.exports = {
  publicPath: '',
  lintOnSave: false,
  configureWebpack:{
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: "javascript/auto"
        },
      ]
    }
  }

}