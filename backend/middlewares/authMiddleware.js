// middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');

exports.authenticateUser = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Access denied' });
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

exports.authorizeAdmin = (req, res, next) => {
  if (!req.user.is_admin) return res.status(403).json({ message: 'Forbidden' });
  next();
};
