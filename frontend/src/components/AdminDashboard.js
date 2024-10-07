// AdminDashboard.js 파일: 관리자가 사용자와 트랜잭션을 관리할 수 있는 컴포넌트 정의

// React의 useEffect, useState 훅을 import
import React, { useEffect, useState } from 'react';
// Axios 라이브러리를 import (HTTP 요청을 보낼 때 사용)
import axios from 'axios';
// 스타일 파일을 import
import '../styles/App.css';

// AdminDashboard 컴포넌트 정의
function AdminDashboard() {
  // 사용자 목록과 트랜잭션 목록을 저장할 상태 정의
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // 컴포넌트가 렌더링될 때 실행되는 useEffect 훅
  useEffect(() => {
    // 관리자 데이터를 가져오는 비동기 함수 정의
    async function fetchAdminData() {
      try {
        const token = localStorage.getItem('token'); // 로컬 스토리지에서 인증 토큰을 가져옴
        if (!token) {
          throw new Error('로그인이 필요합니다.'); // 토큰이 없으면 오류 발생
        }

        // 헤더에 'Bearer ' 추가하여 토큰을 포함합니다.
        const config = {
          headers: { 'Authorization': `Bearer ${token}` }
        };

        // 사용자 정보 조회
        const usersRes = await axios.get('/api/admin/users', config);
        setUsers(usersRes.data); // 가져온 사용자 데이터를 상태에 저장

        // 트랜잭션 정보 조회
        const txRes = await axios.get('/api/admin/transactions', config);
        setTransactions(txRes.data); // 가져온 트랜잭션 데이터를 상태에 저장

      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error); // 오류 발생 시 콘솔에 출력
      }
    }
    fetchAdminData(); // 함수 호출
  }, []); // 빈 배열을 전달하여 컴포넌트 마운트 시 한 번만 실행되도록 함

  // 사용자 정보를 업데이트하는 함수 정의
  const handleUserUpdate = async (user_id, is_active, rank_id) => {
    try {
      const token = localStorage.getItem('token'); // 로컬 스토리지에서 인증 토큰을 가져옴
      if (!token) {
        throw new Error('로그인이 필요합니다.'); // 토큰이 없으면 오류 발생
      }

      const config = {
        headers: { 'Authorization': `Bearer ${token}` }
      };

      // 사용자 업데이트 요청 전송
      await axios.put(`/api/admin/users/${user_id}`, { is_active, rank_id }, config);
      alert('사용자 정보가 업데이트되었습니다.'); // 업데이트 성공 시 알림

      // 사용자 목록 새로고침
      const usersRes = await axios.get('/api/admin/users', config);
      setUsers(usersRes.data); // 새로 가져온 사용자 데이터를 상태에 저장
    } catch (error) {
      alert('사용자 업데이트 실패: ' + (error.response?.data?.message || '알 수 없는 오류')); // 오류 발생 시 알림
    }
  };

  // 트랜잭션 정보를 업데이트하는 함수 정의
  const handleTransactionUpdate = async (transaction_id, status) => {
    try {
      const token = localStorage.getItem('token'); // 로컬 스토리지에서 인증 토큰을 가져옴
      if (!token) {
        throw new Error('로그인이 필요합니다.'); // 토큰이 없으면 오류 발생
      }

      const config = {
        headers: { 'Authorization': `Bearer ${token}` }
      };

      // 트랜잭션 상태 업데이트 요청 전송
      await axios.put(`/api/admin/transactions/${transaction_id}`, { status }, config);
      alert('트랜잭션 상태가 업데이트되었습니다.'); // 업데이트 성공 시 알림

      // 트랜잭션 목록 새로고침
      const txRes = await axios.get('/api/admin/transactions', config);
      setTransactions(txRes.data); // 새로 가져온 트랜잭션 데이터를 상태에 저장
    } catch (error) {
      alert('트랜잭션 업데이트 실패: ' + (error.response?.data?.message || '알 수 없는 오류')); // 오류 발생 시 알림
    }
  };

  // JSX로 UI를 렌더링
  return (
    <div className="admin-dashboard-container">
      <h2>관리자 대시보드</h2>

      <section>
        <h3>사용자 관리</h3>
        {users.length === 0 ? (
          <p>사용자가 없습니다.</p> // 사용자가 없을 경우 메시지 표시
        ) : (
          <table>
            <thead>
              <tr>
                <th>사용자 ID</th>
                <th>사용자 이름</th>
                <th>TRON 지갑 주소</th>
                <th>추천인 ID</th>
                <th>직급</th>
                <th>활성화 여부</th>
                <th>가입 일자</th>
                <th>수정</th>
              </tr>
            </thead>
            <tbody>
              {/* 사용자 목록을 반복하여 각 사용자 정보를 테이블에 표시 */}
              {users.map(user => (
                <tr key={user.user_id}>
                  <td>{user.user_id}</td> {/* 사용자 ID 표시 */}
                  <td>{user.username}</td> {/* 사용자 이름 표시 */}
                  <td>{user.tron_wallet_address}</td> {/* TRON 지갑 주소 표시 */}
                  <td>{user.referral_id ? user.referral_id : '없음'}</td> {/* 추천인 ID 출력 개선 */}
                  <td>{user.rank_id}</td> {/* 사용자 직급 표시 */}
                  <td>{user.is_active ? '활성화' : '비활성화'}</td> {/* 사용자 활성화 여부 표시 */}
                  <td>{new Date(user.created_at).toLocaleString()}</td> {/* 가입 일자를 사람이 읽을 수 있는 형식으로 변환하여 표시 */}
                  <td>
                    <button onClick={() => handleUserUpdate(user.user_id, !user.is_active, user.rank_id)}>
                      {user.is_active ? '비활성화' : '활성화'} {/* 사용자 활성화/비활성화 버튼 */}
                    </button>
                    {/* 직급 변경 기능을 추가할 수 있습니다 */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h3>트랜잭션 관리</h3>
        {transactions.length === 0 ? (
          <p>트랜잭션이 없습니다.</p> // 트랜잭션이 없을 경우 메시지 표시
        ) : (
          <table>
            <thead>
              <tr>
                <th>트랜잭션 ID</th>
                <th>사용자 ID</th>
                <th>TXID</th>
                <th>금액 (USDT)</th>
                <th>상태</th>
                <th>제출 일자</th>
                <th>수정</th>
              </tr>
            </thead>
            <tbody>
              {/* 트랜잭션 목록을 반복하여 각 트랜잭션 정보를 테이블에 표시 */}
              {transactions.map(tx => (
                <tr key={tx.transaction_id}>
                  <td>{tx.transaction_id}</td> {/* 트랜잭션 ID 표시 */}
                  <td>{tx.user_id}</td> {/* 사용자 ID 표시 */}
                  <td>{tx.txid}</td> {/* TXID 표시 */}
                  <td>{tx.amount}</td> {/* 금액 표시 */}
                  <td>{tx.status}</td> {/* 트랜잭션 상태 표시 */}
                  <td>{new Date(tx.created_at).toLocaleString()}</td> {/* 제출 일자를 사람이 읽을 수 있는 형식으로 변환하여 표시 */}
                  <td>
                    <button onClick={() => handleTransactionUpdate(tx.transaction_id, tx.status === 'Approved' ? 'Rejected' : 'Approved')}>
                      {tx.status === 'Approved' ? '거절' : '승인'} {/* 트랜잭션 승인/거절 버튼 */}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

// AdminDashboard 컴포넌트를 기본으로 내보내기
export default AdminDashboard;