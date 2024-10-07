// frontend/src/components/Register.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/App.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    tron_wallet_address: '',
    referral_code: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/register', formData);
      alert('회원가입이 성공적으로 완료되었습니다. 로그인해주세요.\n내 추천인 코드: ' + response.data.referral_code);
      navigate('/login');
    } catch (error) {
      alert('회원가입 실패: ' + (error.response?.data?.message || '알 수 없는 오류'));
    }
  };

  return (
    <div className="auth-container">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="사용자 이름"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="TRON 지갑 주소"
          value={formData.tron_wallet_address}
          onChange={(e) => setFormData({ ...formData, tron_wallet_address: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="추천인 코드 (선택 사항)"
          value={formData.referral_code}
          onChange={(e) => setFormData({ ...formData, referral_code: e.target.value })}
        />
        <button type="submit">회원가입</button>
      </form>
      <p>
        이미 계정이 있으신가요? <Link to="/login">로그인</Link>
      </p>
    </div>
  );
}

export default Register;
