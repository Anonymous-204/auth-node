const User = require('../models'); // hoặc '../models/User' tùy bạn
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

// Khai báo SECRET và EXPIRATION một lần
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// Hàm tạo token – dùng chung cho cả login & register
const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'vui lòng điền đầy đủ thông tin' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự' });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: 'Email không hợp lệ' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Mật khẩu xác nhận không khớp' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email đã được đăng ký' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = createToken(user);

    return res.status(201).json({ message: 'Đăng ký thành công', token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'vui lòng điền đầy đủ thông tin' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const token = createToken(user);

    return res.status(200).json({ message: 'Đăng nhập thành công', token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;
