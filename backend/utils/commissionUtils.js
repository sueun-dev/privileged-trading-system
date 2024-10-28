// utils/commissionUtils.js

const pool = require('../db');

// 커미션 분배 함수
exports.distributeCommissions = async (user_id) => {
  try {
    // Level 1 Referral
    const [userRows] = await pool.query('SELECT referral_id FROM Users WHERE user_id = ?', [user_id]);
    const referral_id = userRows[0].referral_id;
    if (referral_id) {
      // 1대 추천 수당
      await pool.query('INSERT INTO Commissions (user_id, amount, type, description) VALUES (?, ?, ?, ?)', [referral_id, 30, 'Referral Level 1', `Referral from user ${user_id}`]);
      
      // Level 2 Referral
      const [referralRows] = await pool.query('SELECT referral_id FROM Users WHERE user_id = ?', [referral_id]);
      const referral_id_level2 = referralRows[0].referral_id;
      if (referral_id_level2) {
        // 2대 추천 수당
        await pool.query('INSERT INTO Commissions (user_id, amount, type, description) VALUES (?, ?, ?, ?)', [referral_id_level2, 20, 'Referral Level 2', `Referral from user ${user_id}`]);
      }
      
      // Update ranks for referral levels
      await updateUserRank(referral_id);
      if (referral_id_level2) {
        await updateUserRank(referral_id_level2);
      }
    }
  } catch (error) {
    console.error('Error distributing commissions:', error);
  }
};

// 사용자 직급 업데이트 함수
exports.updateUserRank = async (user_id) => {
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

  exports.distributeMonthlyRankBonuses = async () => {
    try {
      // 모든 활성화된 사용자 조회
      const [users] = await pool.query(`
        SELECT user_id, rank_id 
        FROM Users 
        WHERE is_active = 1
      `);
  
      for (const user of users) {
        const { user_id, rank_id } = user;
  
        // 각 직급에 따른 수당 계산
        let bonus = 0;
        switch (rank_id) {
          case 1:
            bonus = 16;
            break;
          case 2:
            bonus = 8;
            break;
          case 3:
            bonus = 8;
            break;
          case 4:
            bonus = 4;
            break;
          case 5:
            bonus = 4;
            break;
          default:
            bonus = 0;
        }
  
        if (bonus > 0) {
          // 수당을 Commissions 테이블에 추가
          await pool.query(`
            INSERT INTO Commissions (user_id, amount, type, description) 
            VALUES (?, ?, 'Rank Bonus', 'Monthly rank bonus')
          `, [user_id, bonus]);
  
          // 회사 지갑의 잔액을 증가시킵니다 (지급되지 않은 수당 누적)
          await pool.query('UPDATE CompanyWallets SET balance = balance + ? WHERE wallet_id = 3', [bonus]);
        }
      }
  
      console.log('Monthly rank bonuses distributed successfully');
    } catch (error) {
      console.error('Error distributing monthly rank bonuses:', error);
    }
  };
};
