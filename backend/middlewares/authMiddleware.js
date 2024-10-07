// middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');

// 사용자가 인증되었는지 확인하는 미들웨어입니다.
// 요청 헤더에 포함된 JWT 토큰을 검증하여 유효한 사용자인지 확인합니다.
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

// 사용자가 관리자 권한을 가지고 있는지 확인하는 미들웨어입니다.
// req.user 객체의 is_admin 필드를 검사하여 관리자 권한이 있는지 확인합니다.
// 사용자가 관리자 권한을 가지고 있는지 확인하는 미들웨어입니다.
// req.user 객체의 is_admin 필드를 검사하여 관리자 권한이 있는지 확인합니다.
exports.authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.is_admin) {
    console.log('Admin access granted');
    next();
  } else {
    console.log('Admin access denied');
    return res.status(403).json({ message: 'Forbidden: 관리자 권한이 필요합니다.' });
  }
};



// 이 미들웨어는 사용자의 인증과 권한 확인을 위해 사용되며,
// 인증된 사용자만 특정 라우터에 접근할 수 있도록 도와줍니다.