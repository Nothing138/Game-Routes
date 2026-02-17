const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 1. Get All Staff (Except Candidates)
router.get('/all-members', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT id, full_name, email, role, status, created_at FROM users WHERE role != 'candidate' ORDER BY id DESC");
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. Delete Staff
router.delete('/delete/:id', async (req, res) => {
    try {
        await db.query("DELETE FROM users WHERE id = ?", [req.params.id]);
        res.json({ message: "Member vanished successfully!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 3. Update Status (Active/Suspended/Pending)
router.put('/update-status/:id', async (req, res) => {
    const { status } = req.body;
    try {
        await db.query("UPDATE users SET status = ? WHERE id = ?", [status, req.params.id]);
        res.json({ message: "Status updated!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;