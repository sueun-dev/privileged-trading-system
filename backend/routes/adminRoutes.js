// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const { getUsers, updateUser, getTransactions, updateTransaction } = require('../controllers/adminController');

router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.get('/transactions', getTransactions);
router.put('/transactions/:id', updateTransaction);

module.exports = router;
