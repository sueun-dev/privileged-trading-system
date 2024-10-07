// PrivateRoute.js 파일: 인증된 사용자만 특정 페이지에 접근할 수 있도록 설정하는 컴포넌트 정의

// React 및 Navigate 컴포넌트를 import
import React from 'react';
import { Navigate } from 'react-router-dom';

// PrivateRoute 컴포넌트 정의
function PrivateRoute({ children }) {
  // 사용자가 로그인했는지 확인 (로컬 스토리지에서 토큰이 있는지 여부로 판단)
  const isAuthenticated = localStorage.getItem('token') ? true : false;
  // 인증된 경우 자식 컴포넌트를 렌더링하고, 그렇지 않으면 로그인 페이지로 이동
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// PrivateRoute 컴포넌트를 기본으로 내보내기
export default PrivateRoute;