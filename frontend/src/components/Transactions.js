// Transactions.js 파일: 사용자가 트랜잭션을 제출하고, 내역을 볼 수 있는 컴포넌트 정의

// React의 useEffect, useState 훅을 import
import React, { useEffect, useState } from 'react';
// Axios 라이브러리를 import (HTTP 요청을 보낼 때 사용)
import axios from 'axios';
// 스타일 파일을 import
import '../styles/App.css';

// Transactions 컴포넌트 정의
function Transactions() {
  // 트랜잭션 목록 상태와 트랜잭션 ID 상태를 정의
  const [transactions, setTransactions] = useState([]); // 트랜잭션 목록을 저장할 상태
  const [txid, setTxid] = useState(''); // 입력된 트랜잭션 ID를 저장할 상태

  // 컴포넌트가 렌더링될 때 실행되는 useEffect 훅
  useEffect(() => {
    // 트랜잭션 목록을 가져오는 비동기 함수 정의
    async function fetchTransactions() {
      try {
        const token = localStorage.getItem('token'); // 로컬 스토리지에서 인증 토큰을 가져옴
        // 서버에서 트랜잭션 상태를 가져옴 (인증 토큰 포함)
        const res = await axios.get('/api/transactions/status', { headers: { 'Authorization': token } });
        setTransactions(res.data); // 가져온 데이터를 상태에 저장
      } catch (error) {
        console.error(error); // 오류 발생 시 콘솔에 출력
      }
    }
    fetchTransactions(); // 함수 호출
  }, []); // 빈 배열을 전달하여 컴포넌트 마운트 시 한 번만 실행되도록 함

  // 트랜잭션 제출을 처리하는 함수
  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    try {
      const token = localStorage.getItem('token'); // 로컬 스토리지에서 인증 토큰을 가져옴
      // 서버에 트랜잭션 ID 제출 (인증 토큰 포함)
      await axios.post('/api/transactions/submit', { txid }, { headers: { 'Authorization': token } });
      alert('트랜잭션이 제출되었습니다.'); // 제출 성공 시 알림
      setTxid(''); // 입력된 트랜잭션 ID 초기화
      // 제출 후 거래 내역 새로고침
      const res = await axios.get('/api/transactions/status', { headers: { 'Authorization': token } });
      setTransactions(res.data); // 새로 가져온 트랜잭션 데이터를 상태에 저장
    } catch (error) {
      // 오류 발생 시 알림
      alert('트랜잭션 제출 실패: ' + (error.response?.data?.message || '알 수 없는 오류'));
    }
  };

  // JSX로 UI를 렌더링
  return (
    <div className="transactions-container">
      <h2>트랜잭션 제출</h2>
      {/* 트랜잭션 제출 폼 */}
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="TXID 입력" 
          value={txid} 
          onChange={(e)=>setTxid(e.target.value)} // 입력 필드 변경 시 상태 업데이트
          required 
        />
        <button type="submit">제출</button> {/* 제출 버튼 */}
      </form>

      <h3>내 트랜잭션 내역</h3>
      {/* 트랜잭션 내역 표시 */}
      {transactions.length === 0 ? (
        <p>트랜잭션이 없습니다.</p> // 트랜잭션이 없을 경우 메시지 표시
      ) : (
        <table>
          <thead>
            <tr>
              <th>TXID</th>
              <th>금액 (USDT)</th>
              <th>상태</th>
              <th>제출 일자</th>
            </tr>
          </thead>
          <tbody>
            {/* 트랜잭션 목록을 반복하며 각 트랜잭션 데이터를 테이블에 표시 */}
            {transactions.map(tx => (
              <tr key={tx.transaction_id}>
                <td>{tx.txid}</td>
                <td>{tx.amount}</td>
                <td>{tx.status}</td>
                <td>{new Date(tx.created_at).toLocaleString()}</td> {/* 날짜를 사람이 읽을 수 있는 형식으로 변환 */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Transactions 컴포넌트를 기본으로 내보내기
export default Transactions;