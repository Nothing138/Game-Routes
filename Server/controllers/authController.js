const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- Register Logic ---
exports.register = async (req, res) => {
    const { full_name, email, password, role, registeredBy } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let status = 'pending';
        const autoApprovedRoles = ['superadmin', 'admin', 'hr_manager', 'candidate', 'recruiter'];
        
        if (registeredBy === 'superadmin' || autoApprovedRoles.includes(role)) {
            status = 'approved';
        }

        const sql = `INSERT INTO users (full_name, email, password, role, status) VALUES (?, ?, ?, ?, ?)`;
        await db.execute(sql, [full_name, email, hashedPassword, role || 'candidate', status]);

        res.status(201).json({ success: true, message: "User registered successfully!" });
    } catch (err) {
        res.status(500).json({ success: false, error: "Email already exists or Database error" });
    }
};

// --- Login Logic (FIXED) ---
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
        if (rows.length === 0) return res.status(404).json({ message: "User not found!" });

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials!" });

        if (user.status === 'suspended') {
            return res.status(403).json({ message: "Your account is suspended!" });
        }

        if (user.role !== 'candidate' && user.role !== 'superadmin' && user.status !== 'approved') {
            return res.status(403).json({ message: "Account pending approval." });
        }

        // ✅ TOKEN SIGN (Secret key must be EXACTLY 'jmit_global_secret_2024')
        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            'jmit_global_secret_2024', 
            { expiresIn: '1d' }
        );

        // ✅ Success Response (Ekhan theke extra jwt.verify muche deya hoyeche)
        res.json({
            success: true,
            token,
            role: user.role,
            user: { id: user.id, name: user.full_name, email: user.email }
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};