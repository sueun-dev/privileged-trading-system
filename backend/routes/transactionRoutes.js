// routes/transactionRoutes.js

const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { authenticateUser } = require('../middlewares/authMiddleware');

// 입금 및 출금 요청 제출
router.post('/submit', transactionController.submitTransaction);

// 트랜잭션 상태 조회
router.get('/status', transactionController.getTransactionStatus);

// 출금 요청 제출
router.post('/withdraw', transactionController.submitWithdrawal);

// 출금 상태 조회
router.get('/withdrawals/status', transactionController.getWithdrawalStatus);

// 송금 요청 처리
router.post('/send-funds', authenticateUser, transactionController.sendFunds);

module.exports = router;
