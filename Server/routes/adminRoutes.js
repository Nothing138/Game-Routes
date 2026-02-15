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
// Get All Categories
router.get('/visa-categories', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM visa_categories ORDER BY id DESC");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add New Category
router.post('/visa-categories', async (req, res) => {
    const { category_name } = req.body;
    console.log("Incoming Data:", category_name);
    if (!category_name) return res.status(400).json({ success: false, message: "Name is missing!" });

    try {
        const sql = "INSERT INTO visa_categories (category_name) VALUES (?)";
        await db.query(sql, [category_name]);
        res.status(201).json({ success: true, message: "Added!" });
    } catch (err) {
        console.error("DB Error:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- 3. COUNTRY LIST ---
// Get All Countries
router.get('/visa-countries', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM visa_countries ORDER BY country_name ASC");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add Country with Charge
router.post('/visa-countries', async (req, res) => {
    const { country_name, application_charge } = req.body;
    try {
        const sql = "INSERT INTO visa_countries (country_name, application_charge) VALUES (?, ?)";
        await db.query(sql, [country_name, application_charge]);
        res.json({ success: true, message: "Country Added!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
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

module.exports = router;