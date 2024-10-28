// frontend/src/components/AdminDashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/App.css';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [settings, setSettings] = useState({});
  const [wallets, setWallets] = useState([]);

  useEffect(() => {
    async function fetchAdminData() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('로그인이 필요합니다.');
        }

        const config = {
          headers: { 'Authorization': `Bearer ${token}` }
        };

        // 사용자 정보 조회
        const usersRes = await axios.get('/api/admin/users', config);
        setUsers(usersRes.data);

        // 트랜잭션 정보 조회
        const txRes = await axios.get('/api/admin/transactions', config);
        setTransactions(txRes.data);

        // 출금 요청 조회
        const withdrawalsRes = await axios.get('/api/admin/withdrawals', config);
        setWithdrawals(withdrawalsRes.data);

        // 설정 조회
        const settingsRes = await axios.get('/api/admin/settings', config);
        setSettings(settingsRes.data);

        // 회사 지갑 조회
        const walletsRes = await axios.get('/api/admin/wallets', config);
        setWallets(walletsRes.data);

      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      }
    }
    fetchAdminData();
  }, []);

  // 사용자 업데이트 함수
  const handleUserUpdate = async (user_id, is_active, rank_id, is_admin) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      const config = {
        headers: { 'Authorization': `Bearer ${token}` }
      };

      await axios.put(`/api/admin/users/${user_id}`, { is_active, rank_id, is_admin }, config);
      alert('사용자 정보가 업데이트되었습니다.');

      // 사용자 목록 새로고침
      const usersRes = await axios.get('/api/admin/users', config);
      setUsers(usersRes.data);
    } catch (error) {
      alert('사용자 업데이트 실패: ' + (error.response?.data?.message || '알 수 없는 오류'));
    }
  };

  // 트랜잭션 업데이트 함수
  const handleTransactionUpdate = async (transaction_id, status, txid) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      const config = {
        headers: { 'Authorization': `Bearer ${token}` }
      };

      await axios.put(`/api/admin/transactions/${transaction_id}`, { status, txid }, config);
      alert('트랜잭션 상태가 업데이트되었습니다.');

      // 트랜잭션 목록 새로고침
      const txRes = await axios.get('/api/admin/transactions', config);
      setTransactions(txRes.data);
    } catch (error) {
      alert('트랜잭션 업데이트 실패: ' + (error.response?.data?.message || '알 수 없는 오류'));
    }
  };

  // 출금 요청 업데이트 함수
  const handleWithdrawalUpdate = async (withdrawal_id, status, txid) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      const config = {
        headers: { 'Authorization': `Bearer ${token}` }
      };

      await axios.put(`/api/admin/withdrawals/${withdrawal_id}`, { status, txid }, config);
      alert('출금 요청이 업데이트되었습니다.');

      // 출금 요청 목록 새로고침
      const withdrawalsRes = await axios.get('/api/admin/withdrawals', config);
      setWithdrawals(withdrawalsRes.data);
    } catch (error) {
      alert('출금 요청 업데이트 실패: ' + (error.response?.data?.message || '알 수 없는 오류'));
    }
  };

  // 설정 업데이트 함수
  const handleSettingsUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      const config = {
        headers: { 'Authorization': `Bearer ${token}` }
      };

      await axios.put('/api/admin/settings', settings, config);
      alert('설정이 업데이트되었습니다.');

    } catch (error) {
      alert('설정 업데이트 실패: ' + (error.response?.data?.message || '알 수 없는 오류'));
    }
  };

  // 지갑 업데이트 함수
  const handleWalletUpdate = async (wallet_id, address, balance) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      const config = {
        headers: { 'Authorization': `Bearer ${token}` }
      };

      await axios.put(`/api/admin/wallets/${wallet_id}`, { address, balance }, config);
      alert('지갑 정보가 업데이트되었습니다.');

      // 지갑 목록 새로고침
      const walletsRes = await axios.get('/api/admin/wallets', config);
      setWallets(walletsRes.data);
    } catch (error) {
      alert('지갑 업데이트 실패: ' + (error.response?.data?.message || '알 수 없는 오류'));
    }
  };

  return (
    <div className="admin-dashboard-container">
      <h2>관리자 대시보드</h2>

      {/* 사용자 관리 섹션 */}
      <section>
        <h3>사용자 관리</h3>
        {users.length === 0 ? (
          <p>사용자가 없습니다.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>사용자 ID</th>
                <th>사용자 이름</th>
                <th>TRON 지갑 주소</th>
                <th>추천인 ID</th>
                <th>직급</th>
                <th>직급 이름</th>
                <th>활성화 여부</th>
                <th>관리자 여부</th>
                <th>가입 일자</th>
                <th>수정</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.user_id}>
                  <td>{user.user_id}</td>
                  <td>{user.username}</td>
                  <td>{user.tron_wallet_address}</td>
                  <td>{user.referral_id ? user.referral_id : '없음'}</td>
                  <td>{user.rank_id}</td>
                  <td>{user.rank_name}</td>
                  <td>{user.is_active ? '활성화' : '비활성화'}</td>
                  <td>{user.is_admin ? '관리자' : '일반 사용자'}</td>
                  <td>{new Date(user.created_at).toLocaleString()}</td>
                  <td>
                    <button onClick={() => handleUserUpdate(user.user_id, !user.is_active, user.rank_id, user.is_admin)}>
                      {user.is_active ? '비활성화' : '활성화'}
                    </button>
                    <button onClick={() => handleUserUpdate(user.user_id, user.is_active, user.rank_id, !user.is_admin)}>
                      {user.is_admin ? '일반 사용자로 전환' : '관리자로 전환'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* 트랜잭션 관리 섹션 */}
      <section>
        <h3>트랜잭션 관리</h3>
        {transactions.length === 0 ? (
          <p>트랜잭션이 없습니다.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>트랜잭션 ID</th>
                <th>사용자 ID</th>
                <th>사용자 이름</th>
                <th>TXID</th>
                <th>금액 (USDT)</th>
                <th>유형</th>
                <th>상태</th>
                <th>제출 일자</th>
                <th>수정</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.transaction_id}>
                  <td>{tx.transaction_id}</td>
                  <td>{tx.user_id}</td>
                  <td>{tx.username}</td>
                  <td>{tx.txid}</td>
                  <td>{tx.amount}</td>
                  <td>{tx.type}</td>
                  <td>{tx.status}</td>
                  <td>{new Date(tx.created_at).toLocaleString()}</td>
                  <td>
                    {tx.type === 'Deposit' && (
                      <button onClick={() => handleTransactionUpdate(tx.transaction_id, tx.status === 'Approved' ? 'Rejected' : 'Approved', tx.txid)}>
                        {tx.status === 'Approved' ? '거절' : '승인'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* 출금 요청 관리 섹션 */}
      <section>
        <h3>출금 요청 관리</h3>
        {withdrawals.length === 0 ? (
          <p>출금 요청이 없습니다.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>출금 ID</th>
                <th>사용자 ID</th>
                <th>사용자 이름</th>
                <th>금액 (USDT)</th>
                <th>수수료 (USDT)</th>
                <th>순 금액 (USDT)</th>
                <th>목적지 주소</th>
                <th>상태</th>
                <th>TXID</th>
                <th>제출 일자</th>
                <th>수정</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map(wd => (
                <tr key={wd.withdrawal_id}>
                  <td>{wd.withdrawal_id}</td>
                  <td>{wd.user_id}</td>
                  <td>{wd.username}</td>
                  <td>{wd.amount}</td>
                  <td>{wd.fee}</td>
                  <td>{wd.net_amount}</td>
                  <td>{wd.destination_address}</td>
                  <td>{wd.status}</td>
                  <td>{wd.txid || '없음'}</td>
                  <td>{new Date(wd.created_at).toLocaleString()}</td>
                  <td>
                    <button onClick={() => handleWithdrawalUpdate(wd.withdrawal_id, wd.status === 'Approved' ? 'Rejected' : 'Approved', wd.txid)}>
                      {wd.status === 'Approved' ? '거절' : '승인'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* 설정 관리 섹션 */}
      <section>
        <h3>설정 관리</h3>
        <div className="settings-form">
          <label>
            입금 금액 (USDT):
            <input
              type="number"
              value={settings.deposit_amount || ''}
              onChange={(e) => setSettings({ ...settings, deposit_amount: parseFloat(e.target.value) })}
            />
          </label>
          <label>
            출금 수수료 (%):
            <input
              type="number"
              value={settings.withdrawal_fee || ''}
              onChange={(e) => setSettings({ ...settings, withdrawal_fee: parseFloat(e.target.value) })}
            />
          </label>
          <button onClick={handleSettingsUpdate}>설정 업데이트</button>
        </div>
      </section>

      {/* 회사 지갑 관리 섹션 */}
      <section>
        <h3>회사 지갑 관리</h3>
        {wallets.length === 0 ? (
          <p>회사 지갑이 없습니다.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>지갑 ID</th>
                <th>지갑 이름</th>
                <th>주소</th>
                <th>잔액 (USDT)</th>
                <th>수정</th>
              </tr>
            </thead>
            <tbody>
              {wallets.map(wallet => (
                <tr key={wallet.wallet_id}>
                  <td>{wallet.wallet_id}</td>
                  <td>{wallet.wallet_name}</td>
                  <td>{wallet.address}</td>
                  <td>{wallet.balance}</td>
                  <td>
                    <button onClick={() => {
                      const newAddress = prompt('새 주소를 입력하세요:', wallet.address);
                      const newBalance = parseFloat(prompt('새 잔액을 입력하세요:', wallet.balance));
                      if (newAddress && !isNaN(newBalance)) {
                        handleWalletUpdate(wallet.wallet_id, newAddress, newBalance);
                      } else {
                        alert('유효한 주소와 잔액을 입력해야 합니다.');
                      }
                    }}>
                      수정
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

export default AdminDashboard;
