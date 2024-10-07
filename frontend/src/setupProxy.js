// frontend/src/setupProxy.js

// http-proxy-middleware 라이브러리에서 createProxyMiddleware 함수를 가져옵니다.
// 이 함수는 프록시 미들웨어를 생성하는 역할을 합니다.
const { createProxyMiddleware } = require('http-proxy-middleware');

// 모듈을 내보내는 함수입니다. 프론트엔드 애플리케이션에서 프록시를 설정하는 부분입니다.
module.exports = function(app) {
  // '/api'로 시작하는 모든 요청에 대해 프록시 미들웨어를 적용합니다.
  app.use(
    '/api',
    createProxyMiddleware({
      // target은 요청을 전달할 백엔드 서버의 주소를 나타냅니다.
      // 여기서는 localhost:3000이 백엔드 서버입니다.
      target: 'http://localhost:3000',

      // changeOrigin 옵션은 요청 헤더의 Origin을 target에 맞게 변경해주는 역할을 합니다.
      // 이를 통해 CORS 문제를 방지할 수 있습니다.
      changeOrigin: true,
    })
  );
};
