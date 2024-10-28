// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');

console.log('authRoutes loaded'); // 디버깅용 로그

// 회원가입 라우트
router.post('/register', register);

// 로그인 라우트
router.post('/login', login);

// 로그아웃 라우트
router.post('/logout', logout);

module.exports = router;
