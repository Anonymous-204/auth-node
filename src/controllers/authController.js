const mongoose = require('mongoose');
const User = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();   // 💥 DÒNG QUAN TRỌNG

const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN 
    }
  );
};

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, confirmPassword} = req.body;

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
        res.status(201).json({ message: 'Đăng ký thành công', token });
        // return res.redirect('/');


    } catch (error) {
        return res.status(500).json({ message: 'Lỗi server' });
    }
});

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
        res.status(200).json({ message: 'Đăng nhập thành công', token });
        // return res.redirect('./');


    } catch (error) {
        return res.status(500).json({ message: 'Lỗi server' });
    }
});

module.exports = router;
