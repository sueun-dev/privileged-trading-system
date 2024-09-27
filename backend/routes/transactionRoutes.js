// routes/transactionRoutes.js

const express = require('express');
const router = express.Router();
const { submitTransaction, getTransactionStatus } = require('../controllers/transactionController');

router.post('/submit', submitTransaction);
router.get('/status', getTransactionStatus);

module.exports = router;
