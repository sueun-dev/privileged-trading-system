// controllers/adminController.js
// 아래 코드 모두 정상 작동
const pool = require('../db');

// 관리자 관련 기능을 제공하는 컨트롤러 파일입니다. 이 파일에는 사용자와 트랜잭션 정보를 관리하는 함수들이 포함되어 있습니다.

// 사용자 목록을 가져오는 함수입니다.
// 이 함수는 데이터베이스에서 모든 사용자를 조회하고 결과를 JSON 형식으로 반환합니다.
// 만약 오류가 발생하면 상태 코드 500과 함께 '사용자 조회 실패' 메시지를 반환합니다.
exports.getUsers = async (req, res) => {
  try {
    // Users 테이블의 모든 행을 가져옵니다.
    const [rows] = await pool.query('SELECT * FROM Users');
    // 가져온 사용자 데이터를 JSON으로 응답합니다.
    console.log("getUsers [o]");
    res.json(rows);
  } catch (error) {
    // 오류가 발생할 경우 상태 코드 500과 함께 에러 메시지를 반환합니다.
    res.status(500).json({ message: '사용자 조회 실패' });
  }
};

// 사용자의 정보를 업데이트하는 함수입니다.
// 특정 사용자의 활성화 여부와 직급을 업데이트합니다.
// 오류가 발생하면 상태 코드 500과 함께 '사용자 업데이트 실패' 메시지를 반환합니다.
exports.updateUser = async (req, res) => {
  const { id } = req.params; // URL 경로에서 사용자 ID를 가져옵니다.
  const { is_active, rank_id } = req.body; // 요청 본문에서 활성화 여부와 직급 ID를 가져옵니다.
  try {
    // Users 테이블에서 특정 사용자의 활성화 여부와 직급을 업데이트합니다.
    await pool.query('UPDATE Users SET is_active = ?, rank_id = ? WHERE user_id = ?', [is_active, rank_id, id]);
    // 업데이트가 성공적으로 완료되면 성공 메시지를 반환합니다.
    console.log("updateUser [o]");
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    // 오류가 발생할 경우 상태 코드 500과 함께 에러 메시지를 반환합니다.
    res.status(500).json({ message: '사용자 업데이트 실패' });
  }
};

// 모든 트랜잭션 정보를 가져오는 함수입니다.
// 이 함수는 데이터베이스에서 모든 트랜잭션을 조회하고 결과를 JSON 형식으로 반환합니다.
// 오류가 발생하면 상태 코드 500과 함께 '트랜잭션 조회 실패' 메시지를 반환합니다.
exports.getTransactions = async (req, res) => {
  try {
    // Transactions 테이블의 모든 행을 가져옵니다.
    const [rows] = await pool.query('SELECT * FROM Transactions');
    // 가져온 트랜잭션 데이터를 JSON으로 응답합니다.
    console.log("getTransactions [o]");
    res.json(rows);
  } catch (error) {
    // 오류가 발생할 경우 상태 코드 500과 함께 에러 메시지를 반환합니다.
    res.status(500).json({ message: '트랜잭션 조회 실패' });
  }
};

// 트랜잭션 정보를 업데이트하는 함수입니다.
// 특정 트랜잭션의 상태를 업데이트합니다.
// 오류가 발생하면 상태 코드 500과 함께 '트랜잭션 업데이트 실패' 메시지를 반환합니다.
exports.updateTransaction = async (req, res) => {
  const { id } = req.params; // URL 경로에서 트랜잭션 ID를 가져옵니다.
  const { status } = req.body; // 요청 본문에서 새로운 상태를 가져옵니다.
  try {
    // Transactions 테이블에서 특정 트랜잭션의 상태를 업데이트합니다.
    await pool.query('UPDATE Transactions SET status = ? WHERE transaction_id = ?', [status, id]);
    // 업데이트가 성공적으로 완료되면 성공 메시지를 반환합니다.
    console.log("updateTransaction [o]");
    res.json({ message: 'Transaction updated successfully' });
  } catch (error) {
    // 오류가 발생할 경우 상태 코드 500과 함께 에러 메시지를 반환합니다.
    res.status(500).json({ message: '트랜잭션 업데이트 실패' });
  }
};

// 이 파일은 관리자가 사용자와 트랜잭션을 관리할 수 있도록 지원하는 다양한 함수를 제공합니다.
// 각 함수는 데이터베이스와 상호 작용하여 사용자 및 트랜잭션의 상태를 조회하거나 업데이트하는 역할을 합니다.