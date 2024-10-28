// middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');

// 사용자가 인증되었는지 확인하는 미들웨어
exports.authenticateUser = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Access denied' });
  
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// 사용자가 관리자 권한을 가지고 있는지 확인하는 미들웨어
exports.authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.is_admin) {
    console.log('Admin access granted');
    next();
  } else {
    console.log('Admin access denied');
    return res.status(403).json({ message: 'Forbidden: 관리자 권한이 필요합니다.' });
  }
};
