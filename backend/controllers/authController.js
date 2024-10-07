// controllers/authController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { v4: uuidv4 } = require('uuid'); // UUID 생성 패키지

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
      // 추천인 코드를 이용하여 추천인 사용자 조회
      const [referralRows] = await pool.query('SELECT user_id FROM Users WHERE referral_code = ?', [referral_code]);
      if (referralRows.length > 0) {
        referral_id = referralRows[0].user_id;
      } else {
        return res.status(400).json({ message: 'Invalid referral code' });
      }
    }
    // 신규 사용자 생성
    const [result] = await pool.query(
      'INSERT INTO Users (username, password, tron_wallet_address, referral_id) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, tron_wallet_address, referral_id]
    );
    // 자동 생성된 user_id 가져오기
    const user_id = result.insertId;
    // 추천인 코드 생성 (UUID 사용)
    const generatedReferralCode = uuidv4();
    // 사용자 정보 업데이트 (추천인 코드 저장)
    await pool.query('UPDATE Users SET referral_code = ? WHERE user_id = ?', [generatedReferralCode, user_id]);
    res.status(201).json({ message: 'Registration successful', referral_code: generatedReferralCode });
  } catch (error) {
    console.error('Error during registration:', error);
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
    const token = jwt.sign(
      { user_id: user.user_id, is_admin: user.is_admin },
      process.env.JWT_SECRET
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.logout = (req, res) => {
  // Implement logout logic if needed (e.g., token blacklist)
  res.json({ message: 'Logout successful' });
};
