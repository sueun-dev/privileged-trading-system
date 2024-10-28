import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/App.css';
import '../styles/Dashboard.css';
import { FaUser, FaMoneyCheckAlt, FaWallet, FaPaperPlane } from 'react-icons/fa';

function Dashboard() {
  const [userInfo, setUserInfo] = useState({});
  const [referralCount, setReferralCount] = useState(0);
  const [depositTxId, setDepositTxId] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [destinationAddress, setDestinationAddress] = useState('');
  const [sendAmount, setSendAmount] = useState(0);
  const [tronAddress, setTronAddress] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/user/info', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserInfo(res.data);

        // 추천인 수 조회
        const referralsRes = await axios.get('/api/referrals', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReferralCount(referralsRes.data.length);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  // 입금 요청 처리 함수
  const handleDeposit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/transactions/deposit',
        { txid: depositTxId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('입금 요청이 성공적으로 제출되었습니다.');
    } catch (error) {
      console.error(error);
      alert('입금 요청 중 오류가 발생했습니다.');
    }
  };

  // 출금 요청 처리 함수
  const handleWithdraw = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/transactions/withdraw',
        { amount: withdrawAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('출금 요청이 성공적으로 제출되었습니다.');
    } catch (error) {
      console.error(error);
      alert('출금 요청 중 오류가 발생했습니다.');
    }
  };

  // 송금 요청 처리 함수
  const handleSendFunds = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/transactions/send-funds',
        { destinationAddress, sendAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('송금 요청이 성공적으로 제출되었습니다.');
    } catch (error) {
      console.error(error);
      alert('송금 요청 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>대시보드 <FaUser /></h2>
        <p>안녕하세요, <span className="username">{userInfo.username}</span>님!</p>
        <p>상태: <span className={`status ${userInfo.is_active ? 'active' : 'inactive'}`}>{userInfo.is_active ? '활성화됨' : '비활성화됨'}</span></p>
        <p>직급: <span className="rank">{userInfo.rank_name || '1 Star'}</span></p>
        <p>내 추천인 코드: <span className="referral-code">{userInfo.referral_code}</span></p>
        <p>추천인 수: <span className="referral-count">{referralCount}</span></p>
      </div>

      <div className="transaction-section deposit">
        <h3><FaMoneyCheckAlt /> 입금 요청</h3>
        <input
          type="text"
          placeholder="TXID 입력"
          value={depositTxId}
          onChange={(e) => setDepositTxId(e.target.value)}
          className="input-field"
        />
        <button className="primary-button" onClick={handleDeposit}>입금 요청 제출</button>
      </div>

      <div className="transaction-section withdraw">
        <h3><FaWallet /> 출금 요청</h3>
        <input
          type="number"
          placeholder="출금 금액 입력"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
          className="input-field"
        />
        <button className="primary-button" onClick={handleWithdraw}>출금 요청 제출</button>
      </div>

      <div className="transaction-section send">
        <h3><FaPaperPlane /> 송금</h3>
        <input
          type="text"
          placeholder="목적지 주소 입력"
          value={destinationAddress}
          onChange={(e) => setDestinationAddress(e.target.value)}
          className="input-field"
        />
        <input
          type="number"
          placeholder="송금 금액 입력"
          value={sendAmount}
          onChange={(e) => setSendAmount(e.target.value)}
          className="input-field"
        />
        <input
          type="text"
          placeholder="TRON 주소 입력"
          value={tronAddress}
          onChange={(e) => setTronAddress(e.target.value)}
          className="input-field"
        />
        <button className="primary-button" onClick={handleSendFunds}>송금 요청 제출</button>
      </div>
    </div>
  );
}

export default Dashboard;
