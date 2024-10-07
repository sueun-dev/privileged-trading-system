// frontend/src/components/Referrals.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/App.css';

function Referrals() {
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    async function fetchReferrals() {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/referrals', { headers: { 'Authorization': token } });
        setReferrals(res.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchReferrals();
  }, []);

  return (
    <div className="referrals-container">
      <h2>추천인 목록</h2>
      {referrals.length === 0 ? (
        <p>추천인이 없습니다.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>사용자 이름</th>
              <th>가입 일자</th>
            </tr>
          </thead>
          <tbody>
            {referrals.map(ref => (
              <tr key={ref.user_id}>
                <td>{ref.username}</td>
                <td>{new Date(ref.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Referrals;
