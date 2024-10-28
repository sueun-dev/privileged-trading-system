// routes/index.js

const express = require('express');
const router = express.Router();

// 라우트 파일들을 import
const authRoutes = require('./authRoutes');
const transactionRoutes = require('./transactionRoutes');
const commissionRoutes = require('./commissionRoutes');
const adminRoutes = require('./adminRoutes');
const userRoutes = require('./userRoutes');

// 인증 및 권한 부여를 위한 미들웨어 import
const { authenticateUser, authorizeAdmin } = require('../middlewares/authMiddleware');

// 인증 관련 라우트
router.use('/auth', authRoutes);

// 트랜잭션 관련 라우트 (인증 필요)
router.use('/transactions', authenticateUser, transactionRoutes);

// 수당 관련 라우트 (인증 필요)
router.use('/commissions', authenticateUser, commissionRoutes);

// 관리자 관련 라우트 (인증 및 관리자 권한 필요)
router.use('/admin', authenticateUser, authorizeAdmin, adminRoutes);

// 사용자 관련 라우트 (인증 필요)
router.use('/user', authenticateUser, userRoutes);

module.exports = router; // 라우터 객체 내보내기
