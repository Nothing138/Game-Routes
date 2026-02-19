const db = require('../config/db');

exports.createBlog = async (req, res) => {
    try {
        const { title, slug, content } = req.body;
        
        // AuthMiddleware theke user id nawa
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized: No user found in token" });
        }
        
        const author_id = req.user.id; 
        const imagePath = req.file ? `/uploads/blogs/${req.file.filename}` : null;

        const sql = `INSERT INTO blogs (author_id, title, slug, content, featured_image) VALUES (?, ?, ?, ?, ?)`;
        await db.execute(sql, [author_id, title, slug, content, imagePath]);

        res.status(201).json({ 
            success: true,
            message: "Blog posted successfully!", 
            image: imagePath 
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};