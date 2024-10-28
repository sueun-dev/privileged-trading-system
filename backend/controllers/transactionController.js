// controllers/transactionController.js

const axios = require('axios');
const pool = require('../db');
const { decodeBase58Address } = require('../utils/addressUtils');
const { distributeCommissions, updateUserRank } = require('../utils/commissionUtils');

// 송금 기능 구현
exports.sendFunds = async (req, res) => {
  try {
    const { destinationAddress, amount } = req.body;

    // 송금 금액 확인
    if (!destinationAddress || !amount) {
      return res.status(400).json({ message: '주소와 금액을 입력해주세요.' });
    }

    // TRON 네트워크에 송금
    const tx = await tronWeb.transactionBuilder.sendTrx(destinationAddress, amount * 1e6, process.env.COMPANY_TRON_ADDRESS);
    const signedTx = await tronWeb.trx.sign(tx, process.env.COMPANY_WALLET_PRIVATE_KEY);
    const receipt = await tronWeb.trx.sendRawTransaction(signedTx);

    if (receipt.result) {
      res.json({ message: '송금 성공', transactionId: receipt.txID });
    } else {
      res.status(500).json({ message: '송금 실패' });
    }
  } catch (error) {
    console.error('송금 오류:', error);
    res.status(500).json({ message: '서버 오류' });
  }
};

exports.getTransactionStatus = async (req, res) => {
  const user_id = req.user.user_id;
  try {
    // 트랜잭션과 출금 정보를 모두 가져옵니다
    const [transactions] = await pool.query(`
      SELECT 
        'transaction' as type,
        txid,
        amount,
        status,
        created_at
      FROM Transactions 
      WHERE user_id = ?
      UNION ALL
      SELECT 
        'withdrawal' as type,
        id as txid,
        amount,
        status,
        created_at
      FROM Withdrawals
      WHERE user_id = ?
      ORDER BY created_at DESC
    `, [user_id, user_id]);
    
    res.json(transactions);
  } catch (error) {
    console.error('Error getting transaction status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 출금 상태를 가져오는 함수
exports.getWithdrawalStatus = async (req, res) => {
  const user_id = req.user.user_id;
  try {
    const [withdrawals] = await pool.query(
      'SELECT * FROM Withdrawals WHERE user_id = ? ORDER BY created_at DESC', 
      [user_id]
    );
    res.json(withdrawals);
  } catch (error) {
    console.error('Error getting withdrawal status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 출금 요청을 제출하는 함수
exports.submitWithdrawal = async (req, res) => {
  const { amount, destination_address } = req.body; // destination_address 추가
  const user_id = req.user.user_id;
  try {
    if (!amount || parseFloat(amount) <= 0) {
      return res.status(400).json({ message: 'Invalid withdrawal amount' });
    }

    if (!destination_address || !/^T[a-zA-Z0-9]{33}$/.test(destination_address)) {
      return res.status(400).json({ message: 'Invalid destination address' });
    }

    // Get withdrawal fee from Settings
    const [settings] = await pool.query('SELECT setting_value FROM Settings WHERE setting_key = "withdrawal_fee"');
    const withdrawalFeePercentage = parseFloat(settings[0].setting_value);

    // Calculate fee and net amount
    const fee = (withdrawalFeePercentage / 100) * parseFloat(amount);
    const net_amount = parseFloat(amount) - fee;

    // Get user's available balance
    const [balanceRows] = await pool.query(`
      SELECT 
        (SELECT IFNULL(SUM(amount), 0) FROM Transactions WHERE user_id = ? AND type = 'Deposit' AND status = 'Approved') -
        (SELECT IFNULL(SUM(net_amount), 0) FROM Withdrawals WHERE user_id = ? AND status = 'Approved') AS balance
    `, [user_id, user_id]);
    const availableBalance = parseFloat(balanceRows[0].balance);

    if (parseFloat(amount) > availableBalance) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Insert pending withdrawal
    await pool.query('INSERT INTO Withdrawals (user_id, amount, fee, net_amount, destination_address, status) VALUES (?, ?, ?, ?, ?, ?)', [user_id, amount, fee, net_amount, destination_address, 'Pending']);

    res.json({ message: 'Withdrawal request submitted and pending approval' });
  } catch (error) {
    console.error('Error submitting withdrawal:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// 기존의 submitTransaction 함수는 입금 처리에 사용됩니다.
exports.submitTransaction = async (req, res) => {
  const { txid, type } = req.body;
  const user_id = req.user.user_id;
  try {
    // Validate transaction type
    if (!['Deposit', 'Withdrawal'].includes(type)) {
      return res.status(400).json({ message: 'Invalid transaction type' });
    }

    // Check if TXID already exists
    const [existingTx] = await pool.query('SELECT * FROM Transactions WHERE txid = ?', [txid]);
    if (existingTx.length > 0) {
      return res.status(400).json({ message: 'TXID already submitted' });
    }

    if (type === 'Deposit') {
      // Verify deposit transaction
      const isValid = await verifyTransaction(txid, type);
      if (!isValid) {
        await pool.query('INSERT INTO Transactions (user_id, txid, amount, type, status) VALUES (?, ?, ?, ?, ?)', [user_id, txid, 0, type, 'Rejected']);
        return res.status(400).json({ message: 'Invalid deposit transaction' });
      }

      // Get deposit amount from Settings
      const [settings] = await pool.query('SELECT setting_value FROM Settings WHERE setting_key = "deposit_amount"');
      const depositAmount = parseFloat(settings[0].setting_value);

      // Insert approved deposit transaction
      await pool.query('INSERT INTO Transactions (user_id, txid, amount, type, status) VALUES (?, ?, ?, ?, ?)', [user_id, txid, depositAmount, type, 'Approved']);

      // Update user's active status
      await pool.query('UPDATE Users SET is_active = 1 WHERE user_id = ?', [user_id]);

      // Distribute commissions
      await distributeCommissions(user_id);

      res.json({ message: 'Deposit approved' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

