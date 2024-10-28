// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Referrals from './components/Referrals';
import Commissions from './components/Commissions';
import Transactions from './components/Transactions';
import Withdrawals from './components/Withdrawals'; // Withdrawals 컴포넌트 추가
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import AdminDashboard from './components/AdminDashboard';
import ConnectWallet from './components/ConnectWallet'; // 추가
import './styles/App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* 인증 페이지 */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 사용자 대시보드 및 기능 */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/referrals" 
          element={
            <PrivateRoute>
              <Referrals />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/commissions" 
          element={
            <PrivateRoute>
              <Commissions />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/transactions" 
          element={
            <PrivateRoute>
              <Transactions />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/withdrawals" 
          element={
            <PrivateRoute>
              <Withdrawals />
            </PrivateRoute>
          } 
        />

        {/* 관리자 대시보드 */}
        <Route 
          path="/admin" 
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          } 
        />
        
        <Route 
  path="/connect-wallet" 
  element={
    <PrivateRoute>
      <ConnectWallet />
    </PrivateRoute>
  } 
/>

        {/* 기본 경로는 로그인 페이지로 리디렉션 */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
