const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,

  
  configureWebpack: {
    resolve: {
      fallback: {
        "https": require.resolve('https-browserify'),
        "http": require.resolve("stream-http"),
        //http: false,        
      },
    },
  },

  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  },
  
  devServer: {
    port: 8080, // ポート番号を指定する
    open: true, // ブラウザを自動で開く
    allowedHosts: 'all', // すべてのホストからの接続を許可
    
    proxy: {
      // プロキシの設定
      '/api': {
        target: 'http://localhost:3000/api', // プロキシ先のURL（開発環境）
        //target: 'https://go:3000/api', // プロキシ先のURL（本番環境）
        changeOrigin: true,
        pathRewrite: {
          '^/api': '' // URLに含まれる /api を消す
        }
      }
    }
  }
})








