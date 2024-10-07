// index.js 파일: 다양한 라우트를 중앙에서 관리하기 위한 파일

// Express 모듈을 import하여 라우터 객체를 생성
const express = require('express');
const router = express.Router();

// 개별 라우트 파일들을 import
const authRoutes = require('./authRoutes'); // 인증 관련 경로 설정 파일
const transactionRoutes = require('./transactionRoutes'); // 트랜잭션 관련 경로 설정 파일
const commissionRoutes = require('./commissionRoutes'); // 수당 관련 경로 설정 파일
const adminRoutes = require('./adminRoutes'); // 관리자 관련 경로 설정 파일

// 인증 및 권한 부여를 위한 미들웨어 import
const { authenticateUser, authorizeAdmin } = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController'); // 사용자 정보 관련 컨트롤러 import

// 인증 관련 경로를 '/auth' 경로로 설정
router.use('/auth', authRoutes);

// 트랜잭션 관련 경로를 '/transactions' 경로로 설정 (사용자 인증이 필요함)
router.use('/transactions', authenticateUser, transactionRoutes);

// 수당 관련 경로를 '/commissions' 경로로 설정 (사용자 인증이 필요함)
router.use('/commissions', authenticateUser, commissionRoutes);

// 관리자 관련 경로를 '/admin' 경로로 설정 (사용자 인증 및 관리자 권한이 필요함)
router.use('/admin', authenticateUser, authorizeAdmin, adminRoutes);

// 사용자 정보 조회를 위한 경로 추가 (사용자 인증이 필요함)
router.get('/user/info', authenticateUser, userController.getUserInfo);

// 라우터 객체를 모듈로 내보내기 (다른 파일에서 이 라우터를 사용하여 요청을 처리)
module.exports = router;

/*
  이 파일은 다양한 API 요청을 처리하기 위한 경로(route)를 중앙에서 관리합니다. 
  1. '/auth': 인증 관련 경로 (예: 로그인, 회원가입 등)로 authRoutes 파일을 통해 관리됩니다.
  2. '/transactions': 트랜잭션 관련 경로로, authenticateUser 미들웨어를 사용하여 사용자 인증 후 접근할 수 있습니다.
  3. '/commissions': 수당 관련 경로로, authenticateUser 미들웨어를 사용하여 사용자 인증 후 접근할 수 있습니다.
  4. '/admin': 관리자 관련 경로로, authenticateUser 및 authorizeAdmin 미들웨어를 사용하여 인증 및 관리자 권한이 확인된 사용자만 접근할 수 있습니다.
  5. '/user/info': 사용자 정보 조회를 위한 경로로, authenticateUser 미들웨어를 사용하여 인증된 사용자만 접근할 수 있습니다.
  이 설정을 통해 각기 다른 기능을 하는 라우트를 하나의 파일에서 일괄적으로 관리하고, 각 요청에 대해 적절한 인증 및 권한 확인을 수행할 수 있습니다.
*/