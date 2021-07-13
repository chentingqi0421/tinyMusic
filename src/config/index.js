const path = require('path')
module.exports = {
	dev: {
		// Paths
		assetsSubDirectory: 'static',
		assetsPublicPath: '/',
		proxyTable: {
			'/api': {
				target: 'http://musicapi.leanapp.cn/', //后端接口地址
				changeOrigin: true, //是否允许跨越
				pathRewrite: {
					'^/api': '/api', //重写,
				}
			}
		},
		host: 'http://localhost',
		port: 8080,
		autoOpenBrowser: false,
		errorOverlay: true,
		notifyOnErrors: true,
		poll: false,
		useEslint: true,
		showEslintErrorsInOverlay: false,
		devtool: 'eval-source-map',
		cacheBusting: true,
		cssSourceMap: false,
	},
}
