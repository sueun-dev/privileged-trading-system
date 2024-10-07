// Commissions.js 파일: 사용자가 수당 내역을 볼 수 있는 컴포넌트 정의

// React의 useEffect, useState 훅을 import
import React, { useEffect, useState } from 'react';
// Axios 라이브러리를 import (HTTP 요청을 보낼 때 사용)
import axios from 'axios';
// 스타일 파일을 import
import '../styles/App.css';

// Commissions 컴포넌트 정의
function Commissions() {
  // 수당 목록을 저장할 상태 정의
  const [commissions, setCommissions] = useState([]);

  // 컴포넌트가 렌더링될 때 실행되는 useEffect 훅
  useEffect(() => {
    // 수당 정보를 가져오는 비동기 함수 정의
    async function fetchCommissions() {
      try {
        const token = localStorage.getItem('token'); // 로컬 스토리지에서 인증 토큰을 가져옴
        // 서버에서 수당 정보를 가져옴 (인증 토큰 포함)
        const res = await axios.get('/api/commissions', { headers: { 'Authorization': token } });
        setCommissions(res.data); // 가져온 데이터를 상태에 저장
      } catch (error) {
        console.error(error); // 오류 발생 시 콘솔에 출력
      }
    }
    fetchCommissions(); // 함수 호출
  }, []); // 빈 배열을 전달하여 컴포넌트 마운트 시 한 번만 실행되도록 함

  // JSX로 UI를 렌더링
  return (
    <div className="commissions-container">
      <h2>수당 내역</h2>
      {/* 수당 내역이 없을 경우와 있는 경우를 구분하여 렌더링 */}
      {commissions.length === 0 ? (
        <p>수당이 없습니다.</p> // 수당이 없을 경우 메시지 표시
      ) : (
        <table>
          <thead>
            <tr>
              <th>수당 유형</th> {/* 수당 유형 열 제목 */}
              <th>금액 (USDT)</th> {/* 수당 금액 열 제목 */}
              <th>설명</th> {/* 수당 설명 열 제목 */}
              <th>발생 일자</th> {/* 수당 발생 일자 열 제목 */}
            </tr>
          </thead>
          <tbody>
            {/* 수당 목록을 반복하여 각 수당 정보를 테이블에 표시 */}
            {commissions.map(comm => (
              <tr key={comm.commission_id}>
                <td>{comm.type}</td> {/* 수당 유형 표시 */}
                <td>{comm.amount}</td> {/* 수당 금액 표시 */}
                <td>{comm.description}</td> {/* 수당 설명 표시 */}
                <td>{new Date(comm.created_at).toLocaleString()}</td> {/* 수당 발생 일자를 사람이 읽을 수 있는 형식으로 변환하여 표시 */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Commissions 컴포넌트를 기본으로 내보내기
export default Commissions;