// server.js 파일: Node.js와 Express.js를 사용한 서버 초기화 및 설정

// Express 모듈을 import하여 서버 애플리케이션 생성
const express = require('express');
const app = express();

// HTTP 요청의 본문을 파싱하기 위한 body-parser 모듈 import
const bodyParser = require('body-parser');

// 애플리케이션 라우트를 관리하는 파일 import
const routes = require('./routes');

// 스케줄 작업을 위해 node-cron 모듈 import
const cron = require('node-cron');

// 사용자 관련 작업을 수행하는 컨트롤러에서 deactivateAllUsers 함수 import
const { deactivateAllUsers } = require('./controllers/userController');

// body-parser를 사용하여 JSON 요청 본문을 파싱하도록 설정
app.use(bodyParser.json());

// '/api' 경로로 시작하는 요청에 대해 routes 파일에서 정의한 라우트를 사용
app.use('/api', routes);

// 서버가 실행될 포트를 설정 (환경 변수 PORT가 정의되어 있지 않으면 기본값 3000 사용)
const PORT = process.env.PORT || 3000;

// 서버 실행 및 특정 포트에서 대기
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // 서버가 성공적으로 실행되었음을 콘솔에 출력
});

// 매월 1일 00:00에 모든 사용자를 비활성화하는 작업을 스케줄링
cron.schedule('0 0 1 * *', () => {
  deactivateAllUsers(); // 사용자 비활성화 함수 호출
});