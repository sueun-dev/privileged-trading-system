// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { getUserInfo } = require('../controllers/userController');

// 사용자 정보 조회 엔드포인트
router.get('/info', getUserInfo);

module.exports = router; // 라우터 객체 내보내기
