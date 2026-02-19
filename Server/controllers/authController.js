const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- Register Logic ---
exports.register = async (req, res) => {
    const { full_name, email, password, role, registeredBy } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Logic: Admin recruiter banale approved, nahole pending
        let status = 'pending';
        if (registeredBy === 'superadmin' || role === 'candidate' || role === 'admin') {
            status = 'approved';
        }

        const sql = `INSERT INTO users (full_name, email, password, role, status) VALUES (?, ?, ?, ?, ?)`;
        await db.execute(sql, [full_name, email, hashedPassword, role || 'candidate', status]);

        res.status(201).json({ success: true, message: "Registration successful!" });
    } catch (err) {
        res.status(500).json({ success: false, error: "Email already exists or DB error" });
    }
};

// --- Login Logic ---
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
        if (rows.length === 0) return res.status(404).json({ message: "User not found!" });

        const user = rows[0];

        // 1. Password check
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials!" });

        // 2. Status check
        if (user.status === 'suspended') {
            return res.status(403).json({ message: "Your account is suspended!" });
        }
        if (user.role === 'recruiter' && user.status !== 'approved') {
            return res.status(403).json({ message: "Account pending approval from SuperAdmin." });
        }

        // 3. Token Generate
        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET || 'YOUR_SECRET_KEY', 
            { expiresIn: '1d' }
        );

        res.json({
            success: true,
            token,
            role: user.role,
            user: { name: user.full_name, email: user.email }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};