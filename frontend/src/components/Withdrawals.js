// frontend/src/components/Withdrawals.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/App.css';

function Withdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [amount, setAmount] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');

  useEffect(() => {
    async function fetchWithdrawals() {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/admin/withdrawals', { headers: { 'Authorization': `Bearer ${token}` } });
        setWithdrawals(res.data);
      } catch (error) {
        console.error('출금 내역을 가져오는 중 오류 발생:', error);
      }
    }
    fetchWithdrawals();
  }, []);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/transactions/withdraw', { amount, destination_address: destinationAddress }, { headers: { 'Authorization': `Bearer ${token}` } });
      alert('출금 요청이 제출되었습니다.');
      setAmount('');
      setDestinationAddress('');
      // 출금 목록 새로고침
      const res = await axios.get('/api/admin/withdrawals', { headers: { 'Authorization': `Bearer ${token}` } });
      setWithdrawals(res.data);
    } catch (error) {
      alert('출금 요청 실패: ' + (error.response?.data?.message || '알 수 없는 오류'));
    }
  };

  return (
    <div className="withdrawals-container">
      <h2>출금 신청</h2>
      <form onSubmit={handleWithdraw}>
        <input
          type="number"
          placeholder="출금 금액 (USDT)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="목적지 TRON 주소"
          value={destinationAddress}
          onChange={(e) => setDestinationAddress(e.target.value)}
          required
        />
        <button type="submit">출금 신청</button>
      </form>

      <h3>내 출금 내역</h3>
      {withdrawals.length === 0 ? (
        <p>출금 내역이 없습니다.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>출금 ID</th>
              <th>금액 (USDT)</th>
              <th>수수료 (USDT)</th>
              <th>순 금액 (USDT)</th>
              <th>목적지 주소</th>
              <th>상태</th>
              <th>TXID</th>
              <th>제출 일자</th>
              <th>수정 일자</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.map(wd => (
              <tr key={wd.withdrawal_id}>
                <td>{wd.withdrawal_id}</td>
                <td>{wd.amount}</td>
                <td>{wd.fee}</td>
                <td>{wd.net_amount}</td>
                <td>{wd.destination_address}</td>
                <td>{wd.status}</td>
                <td>{wd.txid || '없음'}</td>
                <td>{new Date(wd.created_at).toLocaleString()}</td>
                <td>{wd.updated_at ? new Date(wd.updated_at).toLocaleString() : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Withdrawals;
