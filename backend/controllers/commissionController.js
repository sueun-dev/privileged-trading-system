// controllers/commissionController.js

const pool = require('../db');

exports.getCommissions = async (req, res) => {
  const user_id = req.user.user_id;
  try {
    const [rows] = await pool.query('SELECT * FROM Commissions WHERE user_id = ?', [user_id]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
