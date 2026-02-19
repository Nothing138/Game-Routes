const db = require('../config/db');

// Pending Recruiter-der list dekha
exports.getPendingRecruiters = async (req, res) => {
    try {
        // Table-er column name gulo jeno 'full_name', 'email', 'role', 'status' e thake
        const [rows] = await db.execute(
            "SELECT id, full_name, email, status FROM users WHERE role = 'recruiter' AND status = 'pending'"
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Recruiter Approve kora
exports.approveRecruiter = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute("UPDATE users SET status = 'approved' WHERE id = ?", [id]);
        res.json({ success: true, message: "Recruiter approved successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};