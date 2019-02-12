const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  "mode": "development",
  "entry": "./src/main.ts",
  "output": {
      "path": __dirname+'/dist',
      "filename": "[name].js"
  },
  "module": {
      "rules": [
          {
            "test": /\.vue$/,
            "exclude": /node_modules/,
            "loader": "vue-loader",
            options: {
                  esModule: true
            }
          },
          {
            "test": /\.ts$/,
            loader: 'ts-loader',
            "exclude": /node_modules/,
            options: {
              appendTsSuffixTo: [/\.vue$/],
            }
          },
          {
            test: /\.css$/,
            use: [ 'style-loader', 'css-loader' ]
          }
      ]
  },
  resolve: {
    extensions: [ '.vue', '.ts', '.js' ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}