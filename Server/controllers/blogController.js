const db = require('../config/db');

exports.createBlog = async (req, res) => {
    try {
        const { title, slug, content } = req.body;
        const author_id = req.user.id; // Login kora user-er ID (Token theke ashbe)
        const imagePath = req.file ? `/uploads/blogs/${req.file.filename}` : null;

        const sql = `INSERT INTO blogs (author_id, title, slug, content, featured_image) VALUES (?, ?, ?, ?, ?)`;
        await db.execute(sql, [author_id, title, slug, content, imagePath]);

        res.status(201).json({ message: "Blog posted successfully!", image: imagePath });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};