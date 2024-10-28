// utils/addressUtils.js

const bs58 = require('bs58');

exports.decodeBase58Address = (address) => {
  const decoded = bs58.decode(address);
  // TRON 주소의 마지막 4바이트는 체크섬이므로 제외
  const hex = decoded.slice(0, -4).toString('hex');
  // TRON 주소는 20바이트(40 hex characters)
  return hex;
};

