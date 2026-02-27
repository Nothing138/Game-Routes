const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Apnar database connection file

// --- REGISTER ROUTE ---
router.post('/register', async (req, res) => {
    const { full_name, email, password, role, registeredBy } = req.body;

    try {
        // Password Hash kora
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Logic: Admin recruiter banale auto-approve, nahole pending
        let status = 'pending';
        if (registeredBy === 'superadmin' || role === 'candidate') {
            status = 'approved'; 
        }

        const query = "INSERT INTO users (full_name, email, password, role, status) VALUES (?, ?, ?, ?, ?)";
        await db.query(query, [full_name, email, hashedPassword, role, status]);

        res.json({ success: true, message: "User registered successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- LOGIN ROUTE ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (rows.length === 0) return res.status(400).json({ message: "User not found" });

        const user = rows[0];

        // Status check
        if (user.status === 'suspended') {
            return res.status(403).json({ message: "Your account is suspended!" });
        }

        // Password check
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate JWT Token
        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            'jmit_global_secret_2024', // Eikhane icchamoto ekta string den
            { expiresIn: '1d' }
        );

        res.json({
            success: true,
            token,
            role: user.role,
            status: user.status,
            user: { name: user.full_name, email: user.email }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;