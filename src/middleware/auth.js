const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

function getTokenFromHeader(req) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return null;

    const parts = authHeader.split(' ');
    if (parts.length !== 2) return null;

    const [scheme, token] = parts;
    if (scheme !== 'Bearer') return null;

    return token;
}

function authMiddleware(req, res, next) {
    try {
        const token = getTokenFromHeader(req);
        if (!token) {
            return res.status(401).json({ message: 'Không có token, vui lòng đăng nhập' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Lỗi auth middleware:', err.message);
        return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
}

// CHỈ EXPORT 1 HÀM
module.exports = authMiddleware;
