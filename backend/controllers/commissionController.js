// controllers/commissionController.js

const pool = require('../db');

exports.getCommissions = async (req, res) => {
  const user_id = req.user.user_id;
  try {
    const [rows] = await pool.query(`
      SELECT c.commission_id, c.amount, c.type, c.description, c.created_at
      FROM Commissions c
      WHERE c.user_id = ?
      ORDER BY c.created_at DESC
    `, [user_id]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
