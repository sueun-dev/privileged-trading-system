// controllers/transactionController.js

const axios = require('axios');
const pool = require('../db');
const { COMPANY_TRON_ADDRESS } = require('../config');

exports.submitTransaction = async (req, res) => {
  const { txid } = req.body;
  const user_id = req.user.user_id;
  try {
    const [existingTx] = await pool.query('SELECT * FROM Transactions WHERE txid = ?', [txid]);
    if (existingTx.length > 0) {
      return res.status(400).json({ message: 'TXID already submitted' });
    }
    const isValid = await verifyTransaction(txid);
    if (!isValid) {
      await pool.query('INSERT INTO Transactions (user_id, txid, amount, status) VALUES (?, ?, ?, ?)', [user_id, txid, 0, 'Rejected']);
      return res.status(400).json({ message: 'Invalid transaction' });
    }
    await pool.query('INSERT INTO Transactions (user_id, txid, amount, status) VALUES (?, ?, ?, ?)', [user_id, txid, 150, 'Approved']);
    await pool.query('UPDATE Users SET is_active = 1 WHERE user_id = ?', [user_id]);
    res.json({ message: 'Transaction approved' });
    // Proceed to distribute commissions
    distributeCommissions(user_id);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTransactionStatus = async (req, res) => {
  const user_id = req.user.user_id;
  try {
    const [rows] = await pool.query('SELECT * FROM Transactions WHERE user_id = ? ORDER BY created_at DESC', [user_id]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

async function verifyTransaction(txid) {
  try {
    const response = await axios.get(`https://api.trongrid.io/v1/transactions/${txid}`);
    const transaction = response.data.data[0];
    if (!transaction) return false;
    const toAddress = transaction.raw_data.contract[0].parameter.value.to_address;
    const amount = transaction.raw_data.contract[0].parameter.value.amount;
    const decodedAddress = decodeBase58Address(toAddress);
    if (decodedAddress !== COMPANY_TRON_ADDRESS) return false;
    if (amount !== 150 * 1e6) return false; // Amount in SUN (1 TRX = 1e6 SUN)
    return true;
  } catch (error) {
    return false;
  }
}

function decodeBase58Address(address) {
  // Implement address decoding
  return address;
}

async function distributeCommissions(user_id) {
  try {
    // Level 1 Referral
    const [userRows] = await pool.query('SELECT referral_id FROM Users WHERE user_id = ?', [user_id]);
    const referral_id = userRows[0].referral_id;
    if (referral_id) {
      await pool.query('INSERT INTO Commissions (user_id, amount, type, description) VALUES (?, ?, ?, ?)', [referral_id, 30, 'Referral Level 1', `Referral from user ${user_id}`]);
      // Level 2 Referral
      const [referralRows] = await pool.query('SELECT referral_id FROM Users WHERE user_id = ?', [referral_id]);
      const referral_id_level2 = referralRows[0].referral_id;
      if (referral_id_level2) {
        await pool.query('INSERT INTO Commissions (user_id, amount, type, description) VALUES (?, ?, ?, ?)', [referral_id_level2, 20, 'Referral Level 2', `Referral from user ${user_id}`]);
      }
    }
    // Update Ranks
    await updateUserRank(referral_id);
    if (referral_id_level2) {
      await updateUserRank(referral_id_level2);
    }
  } catch (error) {
    console.error('Error distributing commissions:', error);
  }
}

async function updateUserRank(user_id) {
  try {
    const [referralCountRows] = await pool.query('SELECT COUNT(*) AS count FROM Users WHERE referral_id = ?', [user_id]);
    const referralCount = referralCountRows[0].count;
    let newRankId = 1;
    if (referralCount >= 120) newRankId = 5;
    else if (referralCount >= 80) newRankId = 4;
    else if (referralCount >= 50) newRankId = 3;
    else if (referralCount >= 20) newRankId = 2;
    else if (referralCount >= 10) newRankId = 1;
    await pool.query('UPDATE Users SET rank_id = ? WHERE user_id = ?', [newRankId, user_id]);
  } catch (error) {
    console.error('Error updating user rank:', error);
  }
}
