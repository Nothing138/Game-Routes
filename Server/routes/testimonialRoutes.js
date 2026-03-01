const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 📂 Ensure folder exists logic
const uploadDir = 'public/uploads/success';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 📸 Multer Storage Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage: storage });

// 🚀 POST: Add New Testimony
router.post('/testimonials', upload.single('image'), async (req, res) => {
    const { name, designation, description } = req.body;
    const image_url = req.file ? `/uploads/success/${req.file.filename}` : null;

    try {
        const sql = "INSERT INTO testimonials (name, designation, description, image_url) VALUES (?, ?, ?, ?)";
        await db.query(sql, [name, designation, description, image_url]);
        res.json({ success: true, message: "Testimonial added successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📋 GET: Fetch All Testimonials (For Frontend)
router.get('/testimonials', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM testimonials WHERE status = 'active' ORDER BY id DESC");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;