// routes/commissionRoutes.js

const express = require('express');
const router = express.Router();
const { getCommissions } = require('../controllers/commissionController');

// 수당 조회 라우트
router.get('/', getCommissions);

module.exports = router;