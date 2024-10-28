// server.js

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes'); // routes/index.js 불러오기
const cron = require('node-cron');
const { deactivateAllUsers } = require('./controllers/userController');
const { distributeMonthlyRankBonuses } = require('./utils/commissionUtils');

// 환경 변수 설정
const dotenv = require('dotenv');
dotenv.config();

// body-parser 설정
app.use(bodyParser.json());

// 라우트 설정
app.use('/api', routes);

// 서버 포트 설정
const PORT = process.env.PORT || 3000;

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// 매월 1일 00:00에 모든 사용자 비활성화 및 월별 수당 분배
cron.schedule('0 0 1 * *', async () => {
  console.log('Running monthly tasks...');
  await deactivateAllUsers();
  await distributeMonthlyRankBonuses();
});
