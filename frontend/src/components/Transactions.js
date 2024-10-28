// frontend/src/components/Transactions.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/App.css';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [txid, setTxid] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/transactions/status', { headers: { 'Authorization': `Bearer ${token}` } });
        setTransactions(res.data);
      } catch (error) {
        console.error(error);
      }
    }
    async function fetchWithdrawals() {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/transactions/withdrawals/status', { headers: { 'Authorization': `Bearer ${token}` } });
        setWithdrawals(res.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchTransactions();
    fetchWithdrawals();
  }, []);

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/transactions/submit', { txid, type: 'Deposit' }, { headers: { 'Authorization': `Bearer ${token}` } });
      alert('트랜잭션이 제출되었습니다.');
      setTxid('');
      // 트랜잭션 목록 새로고침
      const res = await axios.get('/api/transactions/status', { headers: { 'Authorization': `Bearer ${token}` } });
      setTransactions(res.data);
    } catch (error) {
      alert('트랜잭션 제출 실패: ' + (error.response?.data?.message || '알 수 없는 오류'));
    }
  };

  const handleWithdrawalSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/transactions/withdraw', { amount: withdrawAmount, destination_address: destinationAddress }, { headers: { 'Authorization': `Bearer ${token}` } });
      alert('출금 요청이 제출되었습니다.');
      setWithdrawAmount('');
      setDestinationAddress('');
      // 출금 목록 새로고침
      const res = await axios.get('/api/transactions/withdrawals/status', { headers: { 'Authorization': `Bearer ${token}` } });
      setWithdrawals(res.data);
    } catch (error) {
      alert('출금 요청 실패: ' + (error.response?.data?.message || '알 수 없는 오류'));
    }
  };

  return (
    <div className="transactions-container">
      <h2>트랜잭션 관리</h2>

      {/* 입금 제출 섹션 */}
      <section>
        <h3>입금 제출</h3>
        <form onSubmit={handleDepositSubmit}>
          <input 
            type="text" 
            placeholder="TXID 입력" 
            value={txid} 
            onChange={(e)=>setTxid(e.target.value)} 
            required 
          />
          <button type="submit">입금 제출</button>
        </form>
      </section>

      {/* 출금 신청 섹션 */}
      <section>
        <h3>출금 신청</h3>
        <form onSubmit={handleWithdrawalSubmit}>
          <input 
            type="number" 
            placeholder="출금 금액 (USDT)" 
            value={withdrawAmount} 
            onChange={(e)=>setWithdrawAmount(e.target.value)} 
            required 
          />
          <input 
            type="text" 
            placeholder="목적지 TRON 주소" 
            value={destinationAddress} 
            onChange={(e)=>setDestinationAddress(e.target.value)} 
            required 
          />
          <button type="submit">출금 신청</button>
        </form>
      </section>

      {/* 입금 내역 섹션 */}
      <section>
        <h3>내 입금 내역</h3>
        {transactions.length === 0 ? (
          <p>입금 내역이 없습니다.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>TXID</th>
                <th>금액 (USDT)</th>
                <th>유형</th>
                <th>상태</th>
                <th>제출 일자</th>
                <th>수정 일자</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.transaction_id}>
                  <td>{tx.txid}</td>
                  <td>{tx.amount}</td>
                  <td>{tx.type}</td>
                  <td>{tx.status}</td>
                  <td>{new Date(tx.created_at).toLocaleString()}</td>
                  <td>{tx.updated_at ? new Date(tx.updated_at).toLocaleString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* 출금 내역 섹션 */}
      <section>
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
      </section>
    </div>
  );
}

export default Transactions;
