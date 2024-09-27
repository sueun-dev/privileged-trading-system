// routes/index.js

const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const transactionRoutes = require('./transactionRoutes');
const commissionRoutes = require('./commissionRoutes');
const adminRoutes = require('./adminRoutes');
const { authenticateUser, authorizeAdmin } = require('../middlewares/authMiddleware');

router.use('/auth', authRoutes);
router.use('/transactions', authenticateUser, transactionRoutes);
router.use('/commissions', authenticateUser, commissionRoutes);
router.use('/admin', authenticateUser, authorizeAdmin, adminRoutes);

module.exports = router;
