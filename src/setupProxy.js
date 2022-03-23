const proxy = require('http-proxy-middleware')

module.exports = function (app) {
    app.use(
        proxy('/reqApi', {
            target: 'http://localhost:5002',
            changeOrigin: true,
            pathRewrite: { "^/reqApi": "" }
        })
    )
}