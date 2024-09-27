// controllers/adminController.js

const pool = require('../db');

exports.getUsers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { is_active, rank_id } = req.body;
  try {
    await pool.query('UPDATE Users SET is_active = ?, rank_id = ? WHERE user_id = ?', [is_active, rank_id, id]);
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Transactions');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await pool.query('UPDATE Transactions SET status = ? WHERE transaction_id = ?', [status, id]);
    res.json({ message: 'Transaction updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
