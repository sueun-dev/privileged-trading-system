// controllers/authController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

exports.register = async (req, res) => {
  const { username, password, tron_wallet_address, referral_code } = req.body;
  try {
    const [rows] = await pool.query('SELECT user_id FROM Users WHERE username = ?', [username]);
    if (rows.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    let referral_id = null;
    if (referral_code) {
      const [referralRows] = await pool.query('SELECT user_id FROM Users WHERE user_id = ?', [referral_code]);
      if (referralRows.length > 0) {
        referral_id = referralRows[0].user_id;
      } else {
        return res.status(400).json({ message: 'Invalid referral code' });
      }
    }
    await pool.query('INSERT INTO Users (username, password, tron_wallet_address, referral_id) VALUES (?, ?, ?, ?)', [username, hashedPassword, tron_wallet_address, referral_id]);
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM Users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ user_id: user.user_id, is_admin: user.is_admin }, 'your_jwt_secret');
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.logout = (req, res) => {
  // Implement logout logic if needed (e.g., token blacklist)
  res.json({ message: 'Logout successful' });
};
