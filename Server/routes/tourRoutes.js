const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all packages
router.get('/packages', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM tour_packages ORDER BY id DESC");
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Add new package
router.post('/add-package', async (req, res) => {
    const { title, destination, price, duration, description, image_url } = req.body;
    try {
        await db.query(
            "INSERT INTO tour_packages (title, destination, price, duration, description, image_url) VALUES (?, ?, ?, ?, ?, ?)",
            [title, destination, price, duration, description, image_url]
        );
        res.json({ message: "Package added successfully!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Delete package
router.delete('/package/:id', async (req, res) => {
    try {
        await db.query("DELETE FROM tour_packages WHERE id = ?", [req.params.id]);
        res.json({ message: "Package deleted!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

//  Get all bookings with package details
router.get('/bookings', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT tour_bookings.*, tour_packages.title as package_name 
            FROM tour_bookings 
            JOIN tour_packages ON tour_bookings.package_id = tour_packages.id 
            ORDER BY tour_bookings.id DESC
        `);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Update Booking Status (Confirm/Cancel)
router.put('/update-booking/:id', async (req, res) => {
    const { status } = req.body;
    try {
        await db.query("UPDATE tour_bookings SET status = ? WHERE id = ?", [status, req.params.id]);
        res.json({ message: "Booking status updated!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;