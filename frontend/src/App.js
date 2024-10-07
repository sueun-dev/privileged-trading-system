// App.js 파일: React 애플리케이션의 기본 구조를 정의하는 파일

// React 라이브러리에서 React를 import
import React from 'react';
// React Router에서 BrowserRouter, Routes, Route 컴포넌트를 import
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// 필요한 컴포넌트들을 import
import Dashboard from './components/Dashboard';
import Referrals from './components/Referrals';
import Commissions from './components/Commissions';
import Transactions from './components/Transactions';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import AdminDashboard from './components/AdminDashboard';
// 스타일 시트를 import
import './styles/App.css';

// App 컴포넌트 정의: 애플리케이션의 라우팅을 설정하는 컴포넌트
function App() {
  return (
    // Router로 애플리케이션을 감싸서 라우팅 기능을 사용할 수 있도록 설정
    <Router>
      <Routes>
        {/* 로그인 페이지 라우트 */}
        <Route path="/login" element={<Login />} />
        {/* 회원가입 페이지 라우트 */}
        <Route path="/register" element={<Register />} />
        
        {/* 대시보드 페이지: PrivateRoute를 통해 인증된 사용자만 접근 가능 */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        {/* 추천 페이지: PrivateRoute를 통해 인증된 사용자만 접근 가능 */}
        <Route 
          path="/referrals" 
          element={
            <PrivateRoute>
              <Referrals />
            </PrivateRoute>
          } 
        />
        {/* 수수료 페이지: PrivateRoute를 통해 인증된 사용자만 접근 가능 */}
        <Route 
          path="/commissions" 
          element={
            <PrivateRoute>
              <Commissions />
            </PrivateRoute>
          } 
        />
        {/* 거래 내역 페이지: PrivateRoute를 통해 인증된 사용자만 접근 가능 */}
        <Route 
          path="/transactions" 
          element={
            <PrivateRoute>
              <Transactions />
            </PrivateRoute>
          } 
        />

        {/* 관리자 대시보드 페이지: PrivateRoute를 통해 인증된 사용자만 접근 가능 */}
        <Route 
          path="/admin" 
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          } 
        />

        {/* 기본 경로는 로그인 페이지로 리디렉션 */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

// App 컴포넌트를 기본으로 내보내기
export default App;