const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { getPendingRecruiters, approveRecruiter } = require('../controllers/adminController');

router.get('/pending-recruiters', getPendingRecruiters); 
router.put('/approve-recruiter/:id', approveRecruiter);

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

// --- 6. JOB CIRCULAR
// POST A JOB ---
router.post('/jobs', async (req, res) => {
    const { title, company_name, location, salary, job_type, description, recruiter_id } = req.body;
    try {
        await db.query(
            "INSERT INTO jobs (title, company_name, location, salary, job_type, description, recruiter_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'active')",
            [title, company_name, location, salary, job_type, description, recruiter_id || 1]
        );
        res.json({ success: true, message: "Job Posted Successfully!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

//  GET APPLIED CANDIDATES ---
router.get('/applied-candidates', async (req, res) => {
    try {
        const query = `
            SELECT ja.*, j.title as job_title, u.full_name, u.email, u.resume_url 
            FROM job_applications ja
            JOIN jobs j ON ja.job_id = j.id
            JOIN users u ON ja.user_id = u.id
            ORDER BY ja.id DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET RECRUITER LIST & HIRE COUNT ---
router.get('/recruiters', async (req, res) => {
    try {
        const query = `
            SELECT r.*, 
            (SELECT COUNT(*) FROM jobs WHERE recruiter_id = r.id) as total_jobs,
            (SELECT COUNT(*) FROM job_applications ja JOIN jobs j ON ja.job_id = j.id WHERE j.recruiter_id = r.id AND ja.status = 'hired') as total_hired
            FROM recruiters r
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- 7. Applied Candidates
// Update Application Status (Shortlisted/Hired/Rejected)
router.patch('/applications/:id/status', async (req, res) => {
    const { status } = req.body;
    try {
        await db.query("UPDATE job_applications SET status = ? WHERE id = ?", [status, req.params.id]);
        res.json({ success: true, message: `Candidate ${status} successfully!` });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Delete Application
router.delete('/applications/:id', async (req, res) => {
    try {
        await db.query("DELETE FROM job_applications WHERE id = ?", [req.params.id]);
        res.json({ success: true, message: "Application removed from database" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- 8. Recruiter List
// Get All Recruiters (Pending + Approved) with Activity Stats
router.get('/recruiters/manage', async (req, res) => {
    try {
        const query = `
            SELECT r.*, 
            COUNT(DISTINCT j.id) as total_jobs,
            COUNT(CASE WHEN ja.status = 'hired' THEN 1 END) as hired_count,
            COUNT(CASE WHEN ja.status = 'rejected' THEN 1 END) as rejected_count,
            COUNT(CASE WHEN ja.status = 'pending' THEN 1 END) as pending_count
            FROM recruiters r
            LEFT JOIN jobs j ON r.id = j.recruiter_id
            LEFT JOIN job_applications ja ON j.id = ja.job_id
            GROUP BY r.id
            ORDER BY r.created_at DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Update Recruiter Status (Approve / Suspend / Active)
router.patch('/recruiters/:id/status', async (req, res) => {
    const { status } = req.body;
    try {
        await db.query("UPDATE recruiters SET status = ? WHERE id = ?", [status, req.params.id]);
        res.json({ success: true, message: `Recruiter status updated to ${status}` });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Delete Recruiter
router.delete('/recruiters/:id', async (req, res) => {
    try {
        await db.query("DELETE FROM recruiters WHERE id = ?", [req.params.id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get Analytics Stats
router.get('/stats', async (req, res) => {
    try {
        // 1. Total Revenue (Joining bookings with packages to get the price)
        const [revenue] = await db.query(`
            SELECT SUM(p.price) as total 
            FROM tour_bookings b 
            JOIN tour_packages p ON b.package_id = p.id
        `);
        
        // 2. Staff Count
        const [staff] = await db.query("SELECT COUNT(*) as total FROM users WHERE role != 'candidate'");
        
        // 3. Total Bookings
        const [bookings] = await db.query("SELECT COUNT(*) as total FROM tour_bookings");

        // 4. Real Visa Success Rate
        // Note: Apnar table-e column name status kina check korben
        const [visaStats] = await db.query(`
            SELECT 
                COUNT(*) as total_apps,
                SUM(CASE WHEN application_status = 'approved' THEN 1 ELSE 0 END) as approved_apps
            FROM visa_applications
        `);
        
        const totalApps = visaStats[0].total_apps || 0;
        const approvedApps = visaStats[0].approved_apps || 0;
        const successRate = totalApps > 0 ? Math.round((approvedApps / totalApps) * 100) : 0;

        // 5. Recent Bookings for PDF (Fixed Join)
        const [recentBookings] = await db.query(`
            SELECT b.client_name, p.title as package, p.price, b.status 
            FROM tour_bookings b 
            JOIN tour_packages p ON b.package_id = p.id 
            ORDER BY b.id DESC LIMIT 10
        `);

        // 6. Monthly Growth
        const [growth] = await db.query(`
            SELECT MONTHNAME(booking_date) as name, COUNT(*) as bookings 
            FROM tour_bookings 
            GROUP BY MONTH(booking_date) 
            ORDER BY MONTH(booking_date) ASC LIMIT 6
        `);

        res.json({
            revenue: revenue[0].total || 0,
            staff: staff[0].total,
            bookings: bookings[0].total,
            visaSuccess: successRate,
            recentBookings: recentBookings || [],
            growth: growth || []
        });
    } catch (err) {
        console.error("Stats Error:", err);
        res.status(500).json({ error: "Database synchronization failed." });
    }
});

// --- 9. NOTIFICATION & BROADCAST ---

// 1. Get all Unique Conversations for Admin Inbox
router.get('/inbox-summary', async (req, res) => {
    try {
        const query = `
            SELECT m.*, u.full_name, u.email 
            FROM messages m
            JOIN users u ON m.sender_id = u.id
            WHERE m.id IN (SELECT MAX(id) FROM messages GROUP BY sender_id)
            ORDER BY m.created_at DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Inbox sync failed" });
    }
});

// 2. Send Message (Admin to User)
router.post('/messages/send', async (req, res) => {
    const { sender_id, receiver_id, message } = req.body;
    try {
        await db.query(
            "INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)",
            [sender_id, receiver_id, message]
        );
        res.json({ success: true, message: "Message dispatched!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Post Global Notification (Push Alert)
router.post('/notifications', async (req, res) => {
    const { title, message, type } = req.body;
    try {
        await db.query(
            "INSERT INTO notifications (title, message, type) VALUES (?, ?, ?)",
            [title, message, type]
        );
        res.json({ success: true, message: "Broadcast is now live!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Get Latest Notifications for Sidebar/Bell
router.get('/notifications/latest', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM notifications ORDER BY id DESC LIMIT 10");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Unread Notification Count for Bell Icon
router.get('/notifications/unread-count', async (req, res) => {
    try {
        // Eikhane dhore neya hochhe 'is_read' column ta table-e ase
        // Jodi is_read column na thake, tahole shudhu total count pathabe
        const [rows] = await db.query("SELECT COUNT(*) as unreadCount FROM notifications");
        res.json({ count: rows[0].unreadCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a specific notification
router.delete('/notifications/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query("DELETE FROM notifications WHERE id = ?", [id]);
        
        if (result.affectedRows > 0) {
            res.json({ success: true, message: "Notification purged from system." });
        } else {
            res.status(404).json({ error: "Notification not found." });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
/*
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
};*/

module.exports = router;