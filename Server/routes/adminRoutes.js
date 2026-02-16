const express = require('express');
const router = express.Router();
const db = require('../config/db');

// --- 1. DASHBOARD SUMMARY ---
router.get('/dashboard-stats', async (req, res) => {
    try {
        const [visaReq] = await db.query("SELECT COUNT(*) as count FROM visa_applications");
        const [jobs] = await db.query("SELECT COUNT(*) as count FROM jobs WHERE status = 'active'");
        const [users] = await db.query("SELECT COUNT(*) as count FROM users WHERE role = 'candidate'");
        const [packages] = await db.query("SELECT COUNT(*) as count FROM travel_bookings");

        res.json({
            visaRequests: visaReq[0].count,
            activeJobs: jobs[0].count,
            totalClients: users[0].count,
            tourPackages: packages[0].count
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 2. VISA CATEGORIES ---
router.get('/visa-categories', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM visa_categories ORDER BY id DESC");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/visa-categories', async (req, res) => {
    const { category_name } = req.body;
    if (!category_name) return res.status(400).json({ success: false, message: "Name is missing!" });
    try {
        const sql = "INSERT INTO visa_categories (category_name) VALUES (?)";
        await db.query(sql, [category_name]);
        res.status(201).json({ success: true, message: "Added!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.delete('/visa-categories/:id', async (req, res) => {
    try {
        await db.query("DELETE FROM visa_categories WHERE id = ?", [req.params.id]);
        res.json({ success: true, message: "Category deleted!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.put('/visa-categories/:id', async (req, res) => {
    const { category_name } = req.body;
    try {
        await db.query("UPDATE visa_categories SET category_name = ? WHERE id = ?", [category_name, req.params.id]);
        res.json({ success: true, message: "Category updated!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- 3. COUNTRY LIST (FIXED JOIN & ROUTES) ---

// FETCH ALL COUNTRIES WITH CATEGORY NAME
router.get('/visa-countries', async (req, res) => {
    try {
        const query = `
            SELECT 
                vc.id, 
                vc.country_name, 
                vc.application_charge, 
                vc.status, 
                vc.category_id,
                cat.category_name 
            FROM visa_countries vc
            LEFT JOIN visa_categories cat ON vc.category_id = cat.id
            ORDER BY vc.id DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADD COUNTRY LINKED WITH CATEGORY
router.post('/visa-countries', async (req, res) => {
    const { country_name, category_id, application_charge } = req.body;
    try {
        const sql = "INSERT INTO visa_countries (country_name, category_id, application_charge, status) VALUES (?, ?, ?, 'active')";
        await db.query(sql, [country_name, category_id, application_charge]);
        res.json({ success: true, message: "Country added successfully!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Update Price Only
router.put('/visa-countries/price/:id', async (req, res) => {
    const { application_charge } = req.body;
    try {
        await db.query("UPDATE visa_countries SET application_charge = ? WHERE id = ?", [application_charge, req.params.id]);
        res.json({ success: true, message: "Price updated!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Toggle Status (Active/Inactive)
router.put('/visa-countries/status/:id', async (req, res) => {
    const { status } = req.body;
    try {
        await db.query("UPDATE visa_countries SET status = ? WHERE id = ?", [status, req.params.id]);
        res.json({ success: true, message: `Country is now ${status}` });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Delete Country
router.delete('/visa-countries/:id', async (req, res) => {
    try {
        await db.query("DELETE FROM visa_countries WHERE id = ?", [req.params.id]);
        res.json({ success: true, message: "Deleted successfully" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- 4. VISA APPLICATIONS ---
router.get('/visa-applications', async (req, res) => {
    try {
        const query = `
            SELECT va.*, u.full_name, vc.category_name as visa_type_name 
            FROM visa_applications va
            JOIN users u ON va.user_id = u.id
            LEFT JOIN visa_categories vc ON va.category_id = vc.id
            ORDER BY va.id DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Application Status & Payment
router.put('/visa-applications/:id', async (req, res) => {
    const { application_status, payment_status } = req.body;
    try {
        await db.query(
            "UPDATE visa_applications SET application_status = ?, payment_status = ? WHERE id = ?",
            [application_status, payment_status, req.params.id]
        );
        res.json({ success: true, message: "Application updated!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Delete Application
router.delete('/visa-applications/:id', async (req, res) => {
    try {
        await db.query("DELETE FROM visa_applications WHERE id = ?", [req.params.id]);
        res.json({ success: true, message: "Application deleted!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- 5. Agency Blog ---
// Upload Blog
router.post('/blogs', async (req, res) => {
    const { author_id, title, content, featured_image } = req.body;
    const slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

    try {
        await db.query(
            "INSERT INTO blogs (author_id, title, slug, content, featured_image, status) VALUES (?, ?, ?, ?, ?, 'published')",
            [author_id || 1, title, slug, content, featured_image]
        );
        res.json({ success: true, message: "Blog posted successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Blogs
router.get('/blogs', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM blogs ORDER BY id DESC");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Blog
router.put('/blogs/:id', async (req, res) => {
    const { title, content, featured_image } = req.body;
    const slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    
    try {
        await db.query(
            "UPDATE blogs SET title = ?, slug = ?, content = ?, featured_image = ? WHERE id = ?",
            [title, slug, content, featured_image, req.params.id]
        );
        res.json({ success: true, message: "Blog updated successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Blog
router.delete('/blogs/:id', async (req, res) => {
    try {
        await db.query("DELETE FROM blogs WHERE id = ?", [req.params.id]);
        res.json({ success: true, message: "Blog deleted!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;