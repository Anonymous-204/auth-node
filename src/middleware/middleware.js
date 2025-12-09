const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization']; // hoặc req.get('Authorization')

  if (!authHeader) {
    return res.status(401).json({ message: 'Không có token' });
  }

  // Expect: "Bearer xyz"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Token không hợp lệ' });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Gắn user vào request để dùng ở controller sau
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT verify error:', err.message);
    return res.status(401).json({ message: 'Token không hợp lệ hoặc hết hạn' });
  }
};

module.exports = authMiddleware;
