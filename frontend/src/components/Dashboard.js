// frontend/src/components/Dashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/App.css';

function Dashboard() {
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/user/info', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserInfo(res.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <h2>대시보드</h2>
      <p>안녕하세요, {userInfo.username}님!</p>
      <p>상태: {userInfo.is_active ? '활성화됨' : '비활성화됨'}</p>
      <p>직급: {userInfo.rank_name || '1 Star'}</p>
      <p>내 추천인 코드: {userInfo.referral_code}</p>
      {/* 추가적인 대시보드 정보나 링크를 여기에 추가할 수 있습니다 */}
    </div>
  );
}

export default Dashboard;