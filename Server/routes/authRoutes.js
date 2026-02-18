const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

router.post('/register', async (req, res) => {
    const { full_name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
        await db.query(
            "INSERT INTO users (full_name, email, password, role, status) VALUES (?, ?, ?, ?, ?)",
            [full_name, email, hashedPassword, role, 'approved']
        );
        res.status(201).json({ message: "Staff registered successfully!" });
    } catch (err) {
        res.status(500).json({ error: "Email already exists or DB error" });
    }
});

module.exports = router;