// ConnectWallet.js

import React, { useState } from 'react';
import axios from 'axios';

function ConnectWallet() {
  const [privateKey, setPrivateKey] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  const handlePrivateKeyChange = (e) => {
    setPrivateKey(e.target.value);
  };

  const handleWalletAddressChange = (e) => {
    setWalletAddress(e.target.value);
  };

  const handleSendFunds = async () => {
    try {
      const token = localStorage.getItem('token'); // 인증 토큰 가져오기
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      // 송금 API 호출
      const res = await axios.post('/api/transactions/send-funds', 
        { privateKey, walletAddress, amount: 150 }, 
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      alert('송금이 완료되었습니다. 트랜잭션 ID: ' + res.data.txid);
    } catch (error) {
      alert('송금 실패: ' + (error.response?.data?.message || '알 수 없는 오류'));
    }
  };

  return (
    <div className="connect-wallet-container">
      <h2>지갑 연결 및 송금</h2>
      <input
        type="text"
        placeholder="프라이빗 키 입력"
        value={privateKey}
        onChange={handlePrivateKeyChange}
        required
      />
      <input
        type="text"
        placeholder="지갑 주소 입력"
        value={walletAddress}
        onChange={handleWalletAddressChange}
        required
      />
      <button onClick={handleSendFunds}>150 USDT 송금</button>
    </div>
  );
}

export default ConnectWallet;
