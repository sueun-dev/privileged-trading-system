// controllers/userController.js

const pool = require('../db');
const { updateUserRank } = require('../utils/commissionUtils'); // 커미션 관련 유틸리티 추가

exports.getUserInfo = async (req, res) => {
  const user_id = req.user.user_id;
  try {
    const [rows] = await pool.query(`
      SELECT u.username, u.is_active, u.rank_id, r.rank_name, u.referral_code, u.created_at
      FROM Users u
      JOIN Ranks r ON u.rank_id = r.rank_id
      WHERE u.user_id = ?
    `, [user_id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deactivateAllUsers = async () => {
  try {
    await pool.query('UPDATE Users SET is_active = 0');
    console.log('All users have been deactivated');
  } catch (error) {
    console.error('Error deactivating users:', error);
  }
};
