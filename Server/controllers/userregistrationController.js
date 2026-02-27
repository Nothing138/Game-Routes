const db = require('../config/db');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// OTP Store korar jonno (Temporary - real project-e Redis ba Database use kora bhalo, kintu ekhon memory-te rakhi)
let otpStore = {}; 

// --- 1. OTP Pathanor Function ---
const sendOTP = async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit code

    // Gmail Config
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'njmit2538@gmail.com', // Tomar Gmail
            pass: 'ayev qwgh cygc hefh'      // Gmail theke neya App Password
        }
    });

    try {
        await transporter.sendMail({
            from: '"Game Routes Agency" <njmit2538@gmail.com>',
            to: email,
            subject: "Verification Code for Game Routes",
            text: `Your verification code is: ${otp}`,
            html: `<b>Your verification code is: ${otp}</b>`
        });

        // Memory-te OTP save rakha (৫ min expiration dile bhalo hoy)
        otpStore[email] = otp;
        res.status(200).json({ success: true, message: 'OTP sent to your email!' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to send email' });
    }
};

// --- 2. Registration Function (Verification shoho) ---
const registerUser = async (req, res) => {
    const { full_name, email, password, otp } = req.body;

    // OTP Match korche kina check
    if (otpStore[email] !== otp) {
        return res.status(400).json({ success: false, message: "Invalid or Expired OTP!" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (full_name, email, password, role, status) VALUES (?, ?, ?, "candidate", "pending")';
        await db.query(query, [full_name, email, hashedPassword]);

        // Success hole OTP delete kore daw
        delete otpStore[email];

        res.status(201).json({ success: true, message: 'Registration Successful!' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Registration failed' });
    }
};

module.exports = { sendOTP, registerUser };