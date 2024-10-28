// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const {
  getUsers,
  updateUser,
  getTransactions,
  updateTransaction,
  getWithdrawals,
  updateWithdrawal,
  getSettings,
  updateSettings,
  getCompanyWallets,
  updateCompanyWallet
} = require('../controllers/adminController');

// 사용자 관리
router.get('/users', getUsers);
router.put('/users/:id', updateUser);

// 트랜잭션 관리
router.get('/transactions', getTransactions);
router.put('/transactions/:id', updateTransaction);

// 출금 관리
router.get('/withdrawals', getWithdrawals);
router.put('/withdrawals/:id', updateWithdrawal);

// 설정 관리
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

// 회사 지갑 관리
router.get('/wallets', getCompanyWallets);
router.put('/wallets/:wallet_id', updateCompanyWallet);

module.exports = router;
