// transactionRoutes.js 파일: 트랜잭션 관련 요청을 처리하기 위한 라우트 설정 파일

// Express 모듈을 import하여 라우터 객체를 생성
const express = require('express');
const router = express.Router();

// 트랜잭션 관련 컨트롤러 함수들을 import
const { submitTransaction, getTransactionStatus } = require('../controllers/transactionController');

// POST 요청으로 '/submit' 경로에 트랜잭션 제출을 처리하는 라우트 설정
router.post('/submit', submitTransaction);
// GET 요청으로 '/status' 경로에 트랜잭션 상태 조회를 처리하는 라우트 설정
router.get('/status', getTransactionStatus);

// 라우터 객체를 모듈로 내보내기 (다른 파일에서 이 라우터를 사용하여 요청을 처리)
module.exports = router;

/*
  이 파일은 트랜잭션과 관련된 API 요청을 처리하기 위한 경로(route)를 정의합니다. 
  1. '/submit': 클라이언트가 트랜잭션을 제출할 때 사용합니다. 해당 경로는 POST 요청을 통해 처리되며, submitTransaction 함수가 호출됩니다.
  2. '/status': 클라이언트가 트랜잭션의 상태를 조회할 때 사용합니다. 해당 경로는 GET 요청을 통해 처리되며, getTransactionStatus 함수가 호출됩니다.
  이 라우트 설정을 통해 서버가 클라이언트로부터 트랜잭션 관련 요청을 받아 처리할 수 있게 됩니다.
*/