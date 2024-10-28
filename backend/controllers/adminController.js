// controllers/adminController.js
const pool = require('../db');
const { TronWeb } = require('tronweb'); // TronWeb을 named export로 불러옵니다.
const dotenv = require('dotenv');
dotenv.config();

// TRON 네트워크 설정
const tronWeb = new TronWeb({
  fullHost: 'https://api.trongrid.io',
  privateKey: process.env.COMPANY_WALLET_PRIVATE_KEY
});

// 사용자 목록을 가져오는 함수
exports.getUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT u.user_id, u.username, u.tron_wallet_address, u.referral_id, u.rank_id, r.rank_name, 
             u.is_active, u.is_admin, u.referral_code, u.created_at
      FROM Users u
      JOIN Ranks r ON u.rank_id = r.rank_id
    `);
    console.log("getUsers [o]");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: '사용자 조회 실패' });
  }
};

// 사용자의 정보를 업데이트하는 함수
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { is_active, rank_id, is_admin } = req.body;
  try {
    await pool.query('UPDATE Users SET is_active = ?, rank_id = ?, is_admin = ? WHERE user_id = ?', [is_active, rank_id, is_admin, id]);
    console.log("updateUser [o]");
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ message: '사용자 업데이트 실패' });
  }
};

// 모든 트랜잭션 정보를 가져오는 함수
exports.getTransactions = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.transaction_id, t.user_id, u.username, t.txid, t.amount, t.type, t.status, t.created_at, t.updated_at
      FROM Transactions t
      JOIN Users u ON t.user_id = u.user_id
      ORDER BY t.created_at DESC
    `);
    console.log("getTransactions [o]");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: '트랜잭션 조회 실패' });
  }
};

// 트랜잭션 정보를 업데이트하는 함수
exports.updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { status, txid } = req.body;
  try {
    // 트랜잭션 상태 업데이트
    await pool.query('UPDATE Transactions SET status = ?, txid = ?, updated_at = NOW() WHERE transaction_id = ?', [status, txid, id]);

    // 만약 출금 승인이라면 회사 지갑에서 해당 금액을 차감
    const [transactionRows] = await pool.query('SELECT * FROM Transactions WHERE transaction_id = ?', [id]);
    const transaction = transactionRows[0];
    if (transaction.type === 'Withdrawal' && status === 'Approved') {
      // 회사 지갑에서 금액 차감
      await pool.query('UPDATE CompanyWallets SET balance = balance - ? WHERE wallet_id = 1', [transaction.net_amount]);
    }

    console.log("updateTransaction [o]");
    res.json({ message: 'Transaction updated successfully' });
  } catch (error) {
    res.status(500).json({ message: '트랜잭션 업데이트 실패' });
  }
};

// 모든 출금 요청을 가져오는 함수
exports.getWithdrawals = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT w.withdrawal_id, w.user_id, u.username, w.amount, w.fee, w.net_amount, w.destination_address, w.status, w.txid, w.created_at, w.updated_at
      FROM Withdrawals w
      JOIN Users u ON w.user_id = u.user_id
      ORDER BY w.created_at DESC
    `);
    console.log("getWithdrawals [o]");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: '출금 요청 조회 실패' });
  }
};

// 출금 요청을 업데이트하는 함수 (승인/거절)
exports.updateWithdrawal = async (req, res) => {
  const { id } = req.params;
  const { status, txid } = req.body;
  try {
    // 출금 상태 업데이트
    await pool.query('UPDATE Withdrawals SET status = ?, txid = ?, updated_at = NOW() WHERE withdrawal_id = ?', [status, txid, id]);

    // 만약 출금 승인이라면 TRON 네트워크로 토큰 송금
    const [withdrawalRows] = await pool.query('SELECT * FROM Withdrawals WHERE withdrawal_id = ?', [id]);
    const withdrawal = withdrawalRows[0];
    if (withdrawal.status === 'Approved') {
      const destination = withdrawal.destination_address;
      const amount = withdrawal.net_amount;

      // TRON 네트워크에 송금
      const tx = await tronWeb.transactionBuilder.sendTrx(destination, amount * 1e6, process.env.COMPANY_TRON_ADDRESS);
      const signedTx = await tronWeb.trx.sign(tx, process.env.COMPANY_WALLET_PRIVATE_KEY);
      const receipt = await tronWeb.trx.sendRawTransaction(signedTx);

      if (receipt.result) {
        // 송금 성공 시 TXID 업데이트
        await pool.query('UPDATE Withdrawals SET txid = ? WHERE withdrawal_id = ?', [receipt.transaction.txID, id]);
        console.log("Withdrawal transaction sent successfully");
      } else {
        // 송금 실패 시 상태를 Rejected로 변경
        await pool.query('UPDATE Withdrawals SET status = ? WHERE withdrawal_id = ?', ['Rejected', id]);
        console.error("Failed to send withdrawal transaction");
        return res.status(500).json({ message: '출금 송금 실패' });
      }
    }

    res.json({ message: 'Withdrawal updated successfully' });
  } catch (error) {
    console.error('Error updating withdrawal:', error);
    res.status(500).json({ message: '출금 요청 업데이트 실패' });
  }
};

// 설정을 가져오는 함수
exports.getSettings = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT setting_key, setting_value FROM Settings');
    const settings = {};
    rows.forEach(row => {
      settings[row.setting_key] = row.setting_value;
    });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: '설정 조회 실패' });
  }
};

// 설정을 업데이트하는 함수
exports.updateSettings = async (req, res) => {
  const { deposit_amount, withdrawal_fee } = req.body;
  try {
    if (deposit_amount !== undefined) {
      await pool.query('UPDATE Settings SET setting_value = ? WHERE setting_key = "deposit_amount"', [deposit_amount]);
    }
    if (withdrawal_fee !== undefined) {
      await pool.query('UPDATE Settings SET setting_value = ? WHERE setting_key = "withdrawal_fee"', [withdrawal_fee]);
    }
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ message: '설정 업데이트 실패' });
  }
};

// 회사 지갑 정보를 가져오는 함수
exports.getCompanyWallets = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM CompanyWallets');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: '지갑 조회 실패' });
  }
};

// 회사 지갑 정보를 업데이트하는 함수
exports.updateCompanyWallet = async (req, res) => {
  const { wallet_id } = req.params;
  const { address, balance } = req.body;
  try {
    await pool.query('UPDATE CompanyWallets SET address = ?, balance = ?, updated_at = NOW() WHERE wallet_id = ?', [address, balance, wallet_id]);
    res.json({ message: 'Company wallet updated successfully' });
  } catch (error) {
    res.status(500).json({ message: '지갑 업데이트 실패' });
  }
};
