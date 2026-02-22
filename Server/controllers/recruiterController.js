const db = require('../config/db');

// Profile fetch korar function
exports.getProfile = async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT * FROM recruiters WHERE user_id = ?', 
            [req.user.id] 
        );
        if (rows.length === 0) return res.status(404).json({ msg: "Recruiter not found" });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Profile fetch failed" });
    }
};

// Message stats fetch korar function
exports.getMessageStats = async (req, res) => {
    try {
        const [stats] = await db.execute(
            `SELECT chat_type, COUNT(*) as unread 
             FROM recruiter_messages 
             WHERE receiver_id = ? AND is_read = 0 
             GROUP BY chat_type`, 
            [req.user.id]
        );

        const counts = { admin: 0, candidate: 0 };
        stats.forEach(s => {
            if (s.chat_type === 'admin') counts.admin = s.unread;
            if (s.chat_type === 'candidate') counts.candidate = s.unread;
        });
        res.json(counts);
    } catch (err) {
        res.status(500).json({ error: "Stats fetch failed" });
    }
};