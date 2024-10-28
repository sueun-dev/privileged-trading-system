// frontend/src/components/Commissions.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/App.css';

function Commissions() {
  const [commissions, setCommissions] = useState([]);

  useEffect(() => {
    async function fetchCommissions() {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/commissions', { headers: { 'Authorization': `Bearer ${token}` } });
        setCommissions(res.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchCommissions();
  }, []);

  return (
    <div className="commissions-container">
      <h2>수당 내역</h2>
      {commissions.length === 0 ? (
        <p>수당이 없습니다.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>수당 유형</th>
              <th>금액 (USDT)</th>
              <th>설명</th>
              <th>발생 일자</th>
            </tr>
          </thead>
          <tbody>
            {commissions.map(comm => (
              <tr key={comm.commission_id}>
                <td>{comm.type}</td>
                <td>{comm.amount}</td>
                <td>{comm.description}</td>
                <td>{new Date(comm.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Commissions;
