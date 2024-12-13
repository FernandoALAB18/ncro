// frontend/src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/coingecko',
    createProxyMiddleware({
      target: 'https://api.coingecko.com',
      changeOrigin: true,
      pathRewrite: {
        '^/coingecko': '', // remove /coingecko from the request URL
      },
    })
  );
};
